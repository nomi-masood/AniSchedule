import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Details from './pages/Details';
import Schedule from './pages/Schedule';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import { StoreProvider } from './context/Store';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans text-slate-100 selection:bg-primary/30 selection:text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<Details />} />
              <Route path="/calendar" element={<Schedule />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;