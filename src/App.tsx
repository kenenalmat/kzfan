import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { EventsProvider } from './context/EventsContext';

function App() {
  return (
    <EventsProvider>
      <Router>
        <div className="app">
          <Header />
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem', minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </EventsProvider>
  );
}

export default App;
