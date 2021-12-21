import { useState, useEffect } from 'react';
import './Table.css';

function Table({ vehicleWithLargestSum }) {
  const [vehicleName, setVehicleName] = useState('AT-AT');
  const [planetPop, setPlanetPop] = useState(['Naboo', 5000]);
  const [pilotNames, setPilotNames] = useState(['Luke SkyWalker']);

  useEffect(() => {
    const v = vehicleWithLargestSum;
    if (!v?.result?.properties?.name || !v.totalSum) return;
    setVehicleName(v.result.properties.name);
    setPlanetPop(
      v.planetsInfo.map((p) => ({
        name: p.result.properties.name,
        population: p.result.properties.population,
      }))
    );
    setPilotNames(
      v.vehiclePilotsInfo.map((p) => ({
        name: p.result.properties.name,
      }))
    );
  }, [vehicleWithLargestSum]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan="2">Table contents</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Vehicle name with largest sum</td>
          <td>{vehicleName}</td>
        </tr>
        <tr>
          <td>Related home planets and their respective population</td>
          <td>{JSON.stringify(planetPop)}</td>
        </tr>
        <tr>
          <td>Related pilot names</td>
          <td>{JSON.stringify(pilotNames)}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
