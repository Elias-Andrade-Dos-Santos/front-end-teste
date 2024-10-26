import React, { createContext, useContext, ReactNode, useState } from 'react';
import axios from 'axios';
import { Appointment } from './types';


interface Address {
  street: string;
  number: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Patient {
  id?: number;
  name: string;
  dateOfBirth: string;
  cpf: string;
  gender: string;
  address: Address;
  isActive?: boolean;
}

interface AuthContextData {
  patient: Patient | undefined;
  atua: boolean | undefined;
  appointment: Appointment[] | undefined;
  setPatient: (patient: Patient) => void;
  searchPatients: (name?: string, cpf?: string, isActive?: boolean) => Promise<Patient[]>;
  createPatient: (patient: Patient) => Promise<void>;
  getPatientById: (id: number) => Promise<Patient>;
  updatePatientById: (id: number, patient: Patient) => Promise<void>;
  deletePatientById: (id: number) => Promise<void>;
  inactivatePatientById: (id: number) => Promise<void>;
  createAppointment: (appointmentData: { patientId: string; dateTime: string; description: string }) => Promise<void>;
  searchAppointments: (startDate?: string, endDate?: string, patientId?: number, isActive?: boolean) => Promise<void>;
  updateAppointmentById: (id: number, appointmentData: { patientId: number; dateTime: string; description: string }) => Promise<void>;
  inactivateAppointmentById: (id: number) => Promise<void>;
  getAppointmentById: (id: number) => Promise<void>;
  deleteAppointmentById: (id: number) => Promise<void>;
  atualizar: () => void;
}

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    const errors = error.response.data.errors;
    if (errors && Array.isArray(errors)) {
      errors.forEach((err: any) => {
        console.error(`Erro no campo ${err.field}: ${err.error}`);
      });
    } else {
      console.error('Erro desconhecido:', error.message);
    }
  } else {
    console.error('Erro:', error.message);
  }
};


const AuthContext = createContext<AuthContextData | undefined>(undefined);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const baseUrl = 'http://localhost:5143/api/Patients';
  const baseUrl2 = 'http://localhost:5143/api';

  const [patient, setPatient] = useState<Patient | undefined>();
  const [appointment, setAppointment] = useState<Appointment[] | undefined>();
  const [atua, setAtua] = useState<boolean>();

  const atualizar = () => {
    setAtua(!atua);
  };

  const searchPatients = async (name?: string, cpf?: string, isActive?: boolean) => {
    try {
      const response = await axios.get(`${baseUrl}`, {
        params: {
          name,
          cpf,
          isActive,
        },
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const createPatient = async (patient: Patient) => {
    try {
      await axios.post(baseUrl, patient);
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const getPatientById = async (id: number) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const updatePatientById = async (id: number, patient: Patient) => {
    try {
      await axios.put(`${baseUrl}/${id}`, patient);
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const deletePatientById = async (id: number) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const inactivatePatientById = async (id: number) => {
    try {
      await axios.patch(`${baseUrl}/${id}/inactivate`);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const createAppointment = async (appointmentData: { patientId: string; dateTime: string; description: string }) => {
    try {
      await axios.post(`${baseUrl2}/Appointments`, appointmentData);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const searchAppointments = async (
    startDate?: string,
    endDate?: string,
    patientId?: string,
    isActive?: boolean
  ) => {
    const params = new URLSearchParams();

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (patientId !== undefined) params.append('patientId', patientId.toString());
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    try {
      const response = await axios.get(`${baseUrl2}/Appointments?${params.toString()}`);
      setAppointment(response.data);
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const getAppointmentById = async (id: number) => {
    try {
      const response = await axios.get(`${baseUrl2}/Appointments/${id}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const updateAppointmentById = async (id: number, appointmentData: { patientId: number; dateTime: string; description: string }) => {
    try {
      await axios.put(`${baseUrl2}/Appointments/${id}`, appointmentData);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const inactivateAppointmentById = async (id: number) => {
    try {
      await axios.patch(`${baseUrl2}/Appointments/${id}/inactivate`);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  const deleteAppointmentById = async (id: number) => {
    try {
      await axios.delete(`${baseUrl2}/Appointments/${id}`);
      atualizar();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        appointment,
        createAppointment,
        deleteAppointmentById,
        inactivateAppointmentById,
        updateAppointmentById,
        getAppointmentById,
        searchAppointments,
        atua,
        atualizar,
        patient,
        setPatient,
        searchPatients,
        createPatient,
        getPatientById,
        updatePatientById,
        deletePatientById,
        inactivatePatientById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
