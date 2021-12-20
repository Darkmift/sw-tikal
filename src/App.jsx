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
  const { vehiclesData } = useFetchData();

  const [popData, setPopData] = useState([]);

  let amountKey = 'population';
  let labaelName = 'name';

  useEffect(() => {
    console.log('🚀 ~ file: App.jsx ~ line 17 ~ App ~ vehiclesData', vehiclesData);
    setPopData(rawData);
  }, []);

  return (
    <div className="app">
      <h1>Tikal Code Challenge</h1>
      <Table />
      <ChartWrapper amountKey={amountKey} labaelName={labaelName} chartData={popData} />
    </div>
  );
}

export default App;
