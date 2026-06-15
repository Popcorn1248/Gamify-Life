import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PillarPage from './components/PillarPage';
import AchievementsPage from './components/AchievementsPage';
import { useAppStore } from './store/useAppStore';

function App() {
  const checkAchievements = useAppStore((s) => s.checkAchievements);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pillar/:pillarId" element={<PillarPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
