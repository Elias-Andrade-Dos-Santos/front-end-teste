import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ModalAppointment';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/AppointmentPage.scss';
import { Appointment } from '../context/types';

const AppointmentPage: React.FC = () => {
  const { searchAppointments, appointment, updateAppointmentById, deleteAppointmentById, atua, createAppointment, inactivateAppointmentById } = useAuth();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    patientId: '',
    isActive: '',
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [appointmentIndex, setAppointmentIndex] = useState<number | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  
  // Novo estado para confirmar inativação
  const [isInactivateConfirmationOpen, setIsInactivateConfirmationOpen] = useState(false);
  const [appointmentToInactivate, setAppointmentToInactivate] = useState<number | null>(null);

  useEffect(() => {
    searchAppointments(
      filters.startDate,
      filters.endDate,
      filters.patientId,
      filters.isActive === '' ? undefined : filters.isActive === 'true'
    );
  }, [filters, atua]);

  const handleAddAppointment = () => {
    setIsEditMode(false);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (id?: number, index?: number) => {
    setAppointmentId(id!);
    setAppointmentIndex(index!);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      if (isEditMode && appointmentId!) {
        await updateAppointmentById(appointmentId!, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  const handleDelete = (id: number) => {
    setAppointmentToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const handleInactivate = (id: number) => {
    setAppointmentToInactivate(id);
    setIsInactivateConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete !== null) {
      try {
        await deleteAppointmentById(appointmentToDelete);
        setIsConfirmationModalOpen(false);
        setAppointmentToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
      }
    }
  };

  const handleInactivateConfirm = async () => {
    if (appointmentToInactivate !== null) {
      try {
        await inactivateAppointmentById(appointmentToInactivate);
        setIsInactivateConfirmationOpen(false);
        setAppointmentToInactivate(null);
      } catch (error) {
        console.error('Erro ao inativar agendamento:', error);
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
    <div className="appointments-page">
      <h1>Listagem de Agendamentos</h1>
      <button className="add-button" onClick={handleAddAppointment}>
        Cadastrar Atendimento
      </button>

      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="patientId"
          value={filters.patientId}
          onChange={handleInputChange}
          placeholder="PatientId"
        />
        <select name="isActive" value={filters.isActive} onChange={handleInputChange}>
          <option value="">Todos os Status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div className="appointments-list">
        {appointment?.length > 0 ? (
          appointment.map((appointments: Appointment, index) => (
            <div key={appointments.id} className="appointment-card">
              <p><strong>Paciente ID:</strong> {appointments.patientId}</p>
              <p><strong>Data e Hora:</strong> {appointments.dateTime}</p>
              <p><strong>Descrição:</strong> {appointments.description}</p>
              <p><strong>Status:</strong> {appointments.isActive ? 'Ativo' : 'Inativo'}</p>
              <div className="appointment-actions">
                <button className="edit-btn" onClick={() => handleEditAppointment(appointments.id, index)}>Editar</button>
                <button className="inactivate-btn" onClick={() => handleInactivate(appointments.id)}>Inativar</button>
                <button className="delete-btn" onClick={() => handleDelete(appointments.id)}>Deletar</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum agendamento encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          appointmenId={appointmentId!}
          appointmenIndex={appointmentIndex!}
          isEditMode={isEditMode}
          onSave={handleSaveAppointment}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Você realmente deseja deletar este agendamento?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}

      {isInactivateConfirmationOpen && (
        <ConfirmationModal
          message="Você realmente deseja inativar este agendamento?"
          onConfirm={handleInactivateConfirm}
          onCancel={() => setIsInactivateConfirmationOpen(false)}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
