import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PillarPage from './components/PillarPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pillar/:pillarId" element={<PillarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
