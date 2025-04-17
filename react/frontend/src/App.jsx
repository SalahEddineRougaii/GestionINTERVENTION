import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminePage';
import EmployeePage from './pages/EmployeePage';
import ClientPage from './pages/ClientPage';
import Connexion from './Connexion';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Connexion />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        
        <Route path="/client" element={<ClientPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
