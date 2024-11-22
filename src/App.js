import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import PilotView from './components/PilotView';
import ATCView from './components/ATCView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PROFILE_URL } from '../utils/data';

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
      <h3 style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
        color: 'white',
        textAlign: 'center',
        background: 'none',
      }}>
        Loading...
      </h3>
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
