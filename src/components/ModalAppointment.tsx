import React, { useState, useEffect } from 'react';
import '../styles/AppointmentModal.scss';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Patient {
  id: number;
  name: string;
}

interface ModalProps {
  appointmenId: number;
  appointmenIndex: number;
  isEditMode: boolean;
  onSave: (appointmentData: any) => void;
  onClose: () => void;
}

const ModalAppointment: React.FC<ModalProps> = ({ appointmenId, appointmenIndex, isEditMode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    dateTime: '',
    description: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const { appointment } = useAuth();

  // Carrega os pacientes apenas no modo de cadastro
  useEffect(() => {
    if (!isEditMode) {
      axios.get<Patient[]>('http://localhost:5143/api/Patients?status=active')
        .then(response => setPatients(response.data))
        .catch(error => console.error("Erro ao carregar pacientes:", error));
    }
  }, [isEditMode]);

  // Carrega dados do atendimento no modo de edição
  useEffect(() => {
    if (isEditMode && appointment?.[appointmenIndex]) {
      const { patientId, dateTime, description } = appointment[appointmenIndex];
      setFormData({
        patientId: patientId || '',
        dateTime: dateTime || '',
        description: description || '',
      });
    }
  }, [isEditMode, appointment, appointmenIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>{isEditMode ? 'Editar Atendimento' : 'Cadastrar Atendimento'}</h2>
        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <input
                type="text"
                name="dateTime"
                placeholder="Data e Hora"
                value={formData.dateTime}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
              >
                <option value="">Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="dateTime"
                placeholder="Data e Hora"
                value={formData.dateTime}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleInputChange}
              />
            </>
          )}
          
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ModalAppointment;
