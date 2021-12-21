import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table/Table';
import ChartWrapper from './components/ChartWrapper';
import { useFetchData } from './hooks/useFetchData';

const rawData = [
  { name: 'Naboo', population: 800000 },
  { name: 'Aldoraan', population: 400000 },
  { name: 'Gamma', population: 600000 },
  { name: 'Beta', population: 200000 },
];

function App() {
  const { vehiclesData, pilotData, planetData, totals, loading } = useFetchData();
  const totalVehiclesFetched = vehiclesData.filter((v) => v?.result?.uid);

  const [popData, setPopData] = useState([]);
  const [vehicleWithLargestSum, setVehicleWithLargestSum] = useState({});

  const findVehicleWithLargestSum = () => {
    return vehiclesData.reduce((targetVehicle, item) => {
      const vehiclePilots = item?.result?.properties?.pilots;
      if (!vehiclePilots?.length) return targetVehicle;

      const vehiclePilotsInfo = [];

      const planetsInfo = vehiclePilots.map((url) => {
        const pilotInfo = pilotData.find((pilot) => pilot.result.properties.url === url);
        if (pilotInfo) vehiclePilotsInfo.push(pilotInfo);
        const planetInfo = planetData.find(
          (planet) => planet.result.properties.url === pilotInfo?.result?.properties?.homeworld
        );
        return planetInfo;
      });

      const totalSum = planetsInfo.reduce((population, planet) => {
        population += +planet?.result?.properties?.population;
        return population;
      }, 0);
      console.log('🚀 ~ file: App.jsx ~ line 38 ~ totalSum ~ planetsInfo', planetsInfo);

      const itemClone = JSON.parse(JSON.stringify(item));
      itemClone.totalSum = totalSum;
      itemClone.vehiclePilotsInfo = vehiclePilotsInfo;
      itemClone.planetsInfo = planetsInfo;
      if (!targetVehicle.totalSum) {
        targetVehicle = itemClone;
      }

      return itemClone.totalSum > targetVehicle.totalSum ? itemClone : targetVehicle;
    }, {});
  };

  let amountKey = 'population';
  let labaelName = 'name';

  useEffect(() => {
    console.log('🚀 ~ file: App.jsx ~ line 17 ~ App ~ vehiclesData', vehiclesData);
    setPopData(rawData);
  }, []);

  useEffect(() => {
    if (!loading && vehiclesData.length && planetData.length && pilotData.length)
      setVehicleWithLargestSum(findVehicleWithLargestSum(vehiclesData));
  }, [loading]);

  return (
    <div className="app">
      <h1>Tikal Code Challenge</h1>
      <h3>
        {totalVehiclesFetched.length != totals.vehicles && (
          <span>
            fetching vehicles info....( {totalVehiclesFetched}/{totals.vehicles})
          </span>
        )}
      </h3>

      <code>{JSON.stringify(vehicleWithLargestSum, null, 2)}</code>

      <Table vehicleWithLargestSum={vehicleWithLargestSum} />
      <ChartWrapper amountKey={amountKey} labaelName={labaelName} chartData={popData} />
    </div>
  );
}

export default App;
