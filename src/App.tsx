import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatientsPage from './pages/PatientPage'; // Página de cadastro de pacientes
import AppointmentsPage from './pages/AppointmentPage'; // Página de registro de atendimentos
import './styles/App.scss';
import "./styles/Header.scss"


const App: React.FC = () => {
  return (
    <Router>
      <div className="header">
        <nav>
          <ul className="nav-buttons">
            <li>
              <Link to="/patients">Pacientes</Link>
            </li>
            <li>
              <Link to="/appointments">Atendimentos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
