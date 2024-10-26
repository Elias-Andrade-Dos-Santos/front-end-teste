import { Patient } from "../context/AuthContext";

export const savePatient = async (
    selectedPatient: Patient | null,
    patient: Patient,
    updatePatientById: (id: number, patient: Patient) => Promise<void>,
    createPatient: (patient: Patient) => Promise<void>,
    searchPatients: () => Promise<Patient[]>,
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
    closeModal: () => void
  ) => {
    if (selectedPatient?.id) {
      await updatePatientById(selectedPatient.id, patient);  // Edita o paciente existente
    } else {
      await createPatient(patient);  // Cria um novo paciente
    }
  
    const fetchedPatients = await searchPatients(); // Atualiza a lista após salvar
    setPatients(fetchedPatients);
    closeModal(); // Fecha o modal após salvar
  };
  