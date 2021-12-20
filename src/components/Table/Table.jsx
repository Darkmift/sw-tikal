import { useState } from 'react';
import './Table.css';

function Table() {
  const [vehicleName, setVehicleName] = useState('AT-AT');
  const [planetPop, setPlanetPop] = useState(['Naboo', 5000]);
  const [pilotNames, setPilotNames] = useState(['Luke SkyWalker']);

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
