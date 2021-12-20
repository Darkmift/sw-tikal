
const axios = {}
const vehiclesUrl = 'https://www.swapi.tech/api/vehicles/';

const store = {
  vehicles: [{ atat: { uid: 1, name: 'AT-AT', url: '', data: {} } }],
  pilots: [{ url: 'https://www.swapi.tech/api/people/1' }],
  planets: {}
}

// notify user of error
const toastError = (error) => { }

// recursive fetch of all vehicles
async function fetchVehicles(baseUrl) {
  try {

    const response = await axios.get(baseUrl)
    if (!response?.results) return

    const responseUrls = response.results
    responseUrls.forEach((vehicleData) => {
      vehicleData.data = {}
      if (store.vehicles.find(vehicle => vehicle.url != vehicleData.url)) store.vehicles.push(vehicleData)
    })
    // slow down to be api friendly
    if (response.next) setTimeout(() => fetchVehicles(response.next), 750)
  } catch (error) {
    console.log("🚀 ~ file: state.js ~ line 23 ~ fetchVehicles ~ error", error)
    toastError('something went wrong')
  }
}

function getVehicleData(vehicleUrl, uid) {
  if (store.vehicles.find(v => v.uid === uid && v.data.model)) return
  populateVehiclesData(vehicleUrl, uid)
}

// fetch vehicle data
async function populateVehiclesData(vehicleUrl, uid) {
  try {
    const response = await axios.get(vehicleUrl)
    if (!response?.result?.properties) throw 'no data found for: ' + vehicleUrl

    const vehicleData = response.result.properties
    const initialVehicleInfo = store.vehicles.find(vehicle => vehicle.uid === uid)

    initialVehicleInfo.data = vehicleData
    const { pilots } = initialVehicleInfo.data

    if (pilots.length) {
      pilots.forEach(pilot => {
        let storedPilotData = store.pilots.find(p => p.url === pilot.url)
        if (storedPilotData.name) return

        if (!storedPilotData) {
          storedPilotData = pilot
          store.pilots.push(storedPilotData)
        }

      })
    }
  } catch (error) {
    console.log("🚀 ~ file: state.js ~ line 23 ~ fetchVehicles ~ error", error)
    toastError('something went wrong')
  }
}


/**
 *  1.initial fetch
 *  fetch vehicleApiUrl and populate store.vehicles with respose.results IF store.vehicles.length is zero
 *
 * 2.loop
 *
 *
 */

// fetch vehicle info if store.vehicle.find(vehicle=> vehicle.url!=)