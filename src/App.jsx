import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './tokens.css';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import AIAdvisor from './pages/AIAdvisor';
import DocumentCheck from './pages/DocumentCheck';
import EssayAnalyst from './pages/EssayAnalyst';
import MyChances from './pages/MyChances';
import BudgetPlanner from './pages/BudgetPlanner';
import MyJourney from './pages/MyJourney';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="advisor"   element={<AIAdvisor />} />
          <Route path="documents" element={<DocumentCheck />} />
          <Route path="essay"     element={<EssayAnalyst />} />
          <Route path="chances"   element={<MyChances />} />
          <Route path="budget"    element={<BudgetPlanner />} />
          <Route path="journey"   element={<MyJourney />} />
          <Route path="settings"  element={<Settings />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
