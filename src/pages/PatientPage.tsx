import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/PatientsPage.scss';

const PatientsPage: React.FC = () => {
  const { searchPatients, createPatient, updatePatientById, getPatientById, deletePatientById, atua, inactivatePatientById } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    cpf: '',
    isActive: '',
  });
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false); // Estado para modal de inativação
  const [patientToInactivate, setPatientToInactivate] = useState<number | null>(null);

  const fetchPatients = async () => {
    try {
      const response = await searchPatients(
        filters.name,
        filters.cpf,
        filters.isActive === '' ? undefined : filters.isActive === 'true'
      );
      setPatients(response);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters, atua]);

  const handleAddPatient = () => {
    setIsEditMode(false);
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = async (id: number) => {
    try {
      const patient = await getPatientById(id);
      setSelectedPatient(patient);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
    }
  };

  const handleSavePatient = async (patientData: any) => {
    try {
      if (isEditMode && selectedPatient) {
        await updatePatientById(selectedPatient.id, patientData);
      } else {
        await createPatient(patientData);
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleDelete = (id: number) => {
    setPatientToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete !== null) {
      try {
        await deletePatientById(patientToDelete);
        setIsConfirmationModalOpen(false);
        setPatientToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
      }
    }
  };

  const handleInactivate = (id: number) => {
    setPatientToInactivate(id);
    setIsInactivateModalOpen(true); // Abre o modal de confirmação para inativação
  };

  const handleInactivateConfirm = async () => {
    if (patientToInactivate !== null) {
      try {
        await inactivatePatientById(patientToInactivate);
        setIsInactivateModalOpen(false);
        setPatientToInactivate(null);
      } catch (error) {
        console.error('Erro ao inativar paciente:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="patients-page">
      <h1>Listagem de Pacientes</h1>
      <button className="add-button" onClick={handleAddPatient}>
        Cadastrar Paciente
      </button>

      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Nome do Paciente"
          value={filters.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={filters.cpf}
          onChange={handleInputChange}
        />
        <select
          name="isActive"
          value={filters.isActive}
          onChange={handleInputChange}
        >
          <option value="">Todos os Status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div className="patients-list">
        {patients.length > 0 ? (
          patients.map((patient: any) => (
            <div key={patient.id} className="patient-card">
              <h3>{patient.name}</h3>
              <p><strong>ID:</strong>{patient.id}</p>
              <p><strong>CPF:</strong> {patient.cpf}</p>
              <p><strong>Data de Nascimento:</strong> {patient.dateOfBirth}</p>
              <p><strong>Gênero:</strong> {patient.gender}</p>
              <p><strong>Status:</strong> {patient.isActive ? 'Ativo' : 'Inativo'}</p>
              <p><strong>Endereço:</strong> {`${patient.address.street}, ${patient.address.number}, ${patient.address.city}, ${patient.address.state}, ${patient.address.postalCode}`}</p>

              <div className="patient-actions">
                <button className="edit-btn" onClick={() => handleEditPatient(patient.id)}>Editar</button>
                <button className="inactivate-btn" onClick={() => handleInactivate(patient.id)}>Inativar</button>
                <button className="delete-btn" onClick={() => handleDelete(patient.id)}>Deletar</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum paciente encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          patient={selectedPatient}
          isEditMode={isEditMode}
          onSave={handleSavePatient}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Você realmente deseja deletar este paciente?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}

      {isInactivateModalOpen && (
        <ConfirmationModal
          message="Você realmente deseja inativar este paciente?"
          onConfirm={handleInactivateConfirm}
          onCancel={() => setIsInactivateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientsPage;
