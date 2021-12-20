import { useState, useEffect } from "react";
import apiCall from '../api'
import Localbase from 'localbase'

var db = new Localbase('db')
// var vehicleCollection = db.collection('vehicles')
// var pilotCollection = db.collection('pilots')
// var planetCollection = db.collection('planets')

const baseVehicleUrl = 'https://www.swapi.tech/api/vehicles/'



async function getData(collectionName, urlAsKey) {
  try {
    if (!collectionName || !urlAsKey) throw 'missing args'

    const document = await db.collection(collectionName).doc({ id: urlAsKey }).get()

    return document
  } catch (error) {
    console.log("🚀 ~ file: useFetchData.js ~ line 23 ~ getData ~ error", error)
    return null
  }
}

async function addData(collectionName, urlAsKey, payload) {
  try {
    if (!collectionName || !urlAsKey || !payload) throw 'missing args'
    await db.collection(collectionName).add({ id: urlAsKey, ...payload })
    return await getData(collectionName, urlAsKey)
  } catch (error) {
    console.log("🚀 ~ file: useFetchData.js ~ line 23 ~ getData ~ error", error)
    return null
  }
}

// will search in indexeddb,if not found will try to fetch and create
async function fetchFromApiOrIndexedDb(collectionName, urlAskey) {
  try {

    if (!collectionName || !urlAskey) throw 'missing args'
    const docId = urlAskey

    const findDocument = await getData('vehicles', docId)
    console.log("🚀 ~ file: useFetchData.js ~ line 45 ~ fetchFromApiOrIndexedDb ~ findDocument", findDocument)

    if (!findDocument) {
      const fetchData = await apiCall(urlAskey)
      console.info("🚀 ~ file: useFetchData.js ~ line 49 ~ fetchFromApiOrIndexedDb ~ fetchData", fetchData)
      if (fetchData) return await addData(collectionName, docId, fetchData)
    }

    return findDocument

  } catch (error) {
    console.log("🚀 ~ file: useFetchData.js ~ line 42 ~ fetchFromApiOrIndexedDb ~ error", error)
    return null
  }
}

export const useFetchData = () => {

  const [vehiclesData, setVehiclesData] = useState([])

  useEffect(() => {

    const seedStateRecursively = async (apiUrl) => {
      try {
        const initialDocs = await fetchFromApiOrIndexedDb('vehicles', apiUrl)
        console.log("🚀 ~ file: useFetchData.js ~ line 72 ~ seedState ~ initialDocs", { initialDocs, link: initialDocs.next })
        if (initialDocs.results.length) {
          for (const vehicleApiData of initialDocs.results) {
            if (!vehicleApiData.url) continue;
            const vehicleData = await fetchFromApiOrIndexedDb('vehicles', vehicleApiData.url)
            if (vehicleData?.result?.properties?.pilots?.length) {
              for (const pilot of vehicleData.result.properties.pilots) {
                const pilotData = await fetchFromApiOrIndexedDb('pilots', pilot)
                console.log("🚀 ~ file: useFetchData.js ~ line 79 ~ seedStateRecursively ~ pilotData", pilotData)
                if (pilotData?.result?.properties?.homeworld) {
                  const planet = await fetchFromApiOrIndexedDb('planets', pilotData.result.properties.homeworld)
                  console.log("🚀 ~ file: useFetchData.js ~ line 81 ~ seedStateRecursively ~ planet", planet)
                }
              }
            }
          }
        }
        if (initialDocs.next) await seedStateRecursively(initialDocs.next)

        console.log('Done fetching all vehicles!')
      } catch (error) {
        console.log("🚀 ~ file: useFetchData.js ~ line 48 ~ seedState ~ error", error)
      }
    }

    seedStateRecursively(baseVehicleUrl)
  }, [])

  return { vehiclesData }
}