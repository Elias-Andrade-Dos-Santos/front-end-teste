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
    dateTime: string; 
    description: string;
    isActive: boolean;
  }

  