import React, { useState, useEffect } from 'react';
import '../styles/Modal.scss';

interface ModalProps {
  patient: any;
  isEditMode: boolean;
  onSave: (patientData: any) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ patient, isEditMode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      postalCode: ''
    },
    isActive: true,
  });

  useEffect(() => {
    if (isEditMode && patient) {
      setFormData({
        ...patient,
        address: { ...patient.address }, // Garantir que o endereço também seja definido
      });
    } else {
      // Limpa o formulário quando não está no modo de edição
      setFormData({
        name: '',
        cpf: '',
        dateOfBirth: '',
        gender: '',
        address: {
          street: '',
          number: '',
          city: '',
          state: '',
          postalCode: ''
        },
        isActive: true,
      });
    }
  }, [isEditMode, patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>{isEditMode ? 'Editar Paciente' : 'Cadastrar Paciente'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Data de Nascimento"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="gender"
            placeholder="Gênero"
            value={formData.gender}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Rua"
            value={formData.address.street}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="number"
            placeholder="Número"
            value={formData.address.number}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Cidade"
            value={formData.address.city}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="state"
            placeholder="Estado"
            value={formData.address.state}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Código Postal"
            value={formData.address.postalCode}
            onChange={handleAddressChange}
          />
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
