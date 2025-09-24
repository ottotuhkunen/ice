import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import PilotView from './components/PilotView';
import ATCView from './components/ATCView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PROFILE_URL } from './utils/data';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(PROFILE_URL, {
          credentials: 'include',
        });

        if (response.ok) {
          const { user: userData, view } = await response.json();
          setUser(userData);
          setView(view); 
        } else {
          console.warn('Unauthorized user. Redirecting to login.');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="images/snow.svg" alt="Snowflake" className="loading-snowflake" />
        <h3 className="loading-text">
          Loading
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h3>
      </div>
    );
  }
  

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={user ? <Navigate to={view === 'PilotView' ? '/pilotView' : '/atcView'} replace /> : <Login />}
        />

        <Route
          path="/pilotView"
          element={user && view === 'PilotView' ? <PilotView user={user} /> : <Navigate to="/" replace />}
        />

        <Route
          path="/atcView"
          element={user && view === 'ATCView' ? <ATCView user={user} /> : <Navigate to="/" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
