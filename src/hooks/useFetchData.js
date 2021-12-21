import { useState, useEffect } from "react"
import apiCall from '../api'
import Localbase from 'localbase'

var db = new Localbase('db')
db.config.debug = false


const baseVehicleUrl = 'https://www.swapi.tech/api/vehicles/'
const basePlanetsUrl = 'https://www.swapi.tech/api/planets/'
const basePilotsUrl = 'https://www.swapi.tech/api/pilots/'

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

    const findDocument = await getData(collectionName, docId)

    if (!findDocument) {
      const fetchData = await apiCall(urlAskey)
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
  const [pilotData, setPilotData] = useState([])
  const [planetData, setPlanetData] = useState([])
  const [totals, setTotals] = useState({ planets: 0, vehicles: 0 })
  const [loading, setIsLoading] = useState(false)

  useEffect(() => {

    const seedIndexedDbRecursively = async (apiUrl) => {
      try {
        const initialDocs = await fetchFromApiOrIndexedDb('vehicles', apiUrl)
        if (initialDocs.results.length) {
          for (const vehicleApiData of initialDocs.results) {
            if (!vehicleApiData.url) continue;
            const vehicleResponse = await fetchFromApiOrIndexedDb('vehicles', vehicleApiData.url)

            if (vehicleResponse?.result?.properties?.pilots?.length) {
              for (const pilot of vehicleResponse.result.properties.pilots) {
                const pilotData = await fetchFromApiOrIndexedDb('pilots', pilot)
                if (pilotData?.result?.properties?.homeworld) {
                  const planet = await fetchFromApiOrIndexedDb('planets', pilotData.result.properties.homeworld)
                }
              }
            }
          }
        }
        if (initialDocs.next) return await seedIndexedDbRecursively(initialDocs.next)
      } catch (error) {
        console.log("🚀 ~ file: useFetchData.js ~ line 48 ~ seedState ~ error", error)
      }
    }

    const seedState = async () => {
      try {
        setIsLoading(true)
        const vehicles = await fetchFromApiOrIndexedDb('totals', baseVehicleUrl)
        const planets = await fetchFromApiOrIndexedDb('totals', basePlanetsUrl)
        if (vehicles.total_records) setTotals(totals => ({ ...totals, vehicles: vehicles.total_records }))
        if (planets.total_records) setTotals(totals => ({ ...totals, planets: planets.total_records }))

        await seedIndexedDbRecursively(baseVehicleUrl)

        console.log('Done fetching all vehicles!')

        const vehiclesCollection = await db.collection('vehicles').get()
        const pilotsCollection = await db.collection('pilots').get()
        const planetsCollection = await db.collection('planets').get()

        setVehiclesData(d => vehiclesCollection)
        setPilotData(d => pilotsCollection)
        setPlanetData(d => planetsCollection)
      } catch (error) {
        console.log("🚀 ~ file: useFetchData.js ~ line 97 ~ seedState ~ error", error)
      } finally {
        console.log("🚀 ~ file: useFetchData.js ~ line 116 ~ seedState ~ FINALLY false", false)
        setIsLoading(false)
      }
    }

    seedState()
  }, [])

  return {
    vehiclesData,
    pilotData,
    planetData,
    totals,
    loading
  }
}