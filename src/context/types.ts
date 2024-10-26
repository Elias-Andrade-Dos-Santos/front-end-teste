export interface Address {
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  }
  
  export interface Patient {
    name: string;
    dateOfBirth: string;
    cpf: string;
    gender: string;
    address: Address;
  }


  export interface Appointment {
    id: number,
    patientId: string;
    dateTime: string; // ou Date, se preferir trabalhar com objetos Date
    description: string;
    isActive: boolean;
  }

  