import axios from "axios";

const API_URL = "http://localhost:3010";

// Interfaz para los datos de la posición y su proceso de entrevista
export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

export interface PositionDetails {
  positionName: string;
  interviewFlow: InterviewFlow;
}

// Interfaz para los datos de candidatos
export interface Candidate {
  id?: number;              // ID del candidato o aplicación
  fullName: string;
  currentInterviewStep: string;
  currentInterviewStepId?: number;  // ID de la etapa actual
  averageScore: number;
}

// Mock data para pruebas y desarrollo
const MOCK_POSITION_DATA = {
  positionName: "Senior Backend Engineer Position",
  interviewFlow: {
    id: 1,
    description: "Standard development interview process",
    interviewSteps: [
      {
        id: 1,
        interviewFlowId: 1,
        interviewTypeId: 1,
        name: "Llamada telefónica",
        orderIndex: 1
      },
      {
        id: 2,
        interviewFlowId: 1,
        interviewTypeId: 2,
        name: "Entrevista técnica",
        orderIndex: 2
      },
      {
        id: 3,
        interviewFlowId: 1,
        interviewTypeId: 3,
        name: "Entrevista cultural",
        orderIndex: 3
      },
      {
        id: 4,
        interviewFlowId: 1,
        interviewTypeId: 4,
        name: "Entrevista manager",
        orderIndex: 4
      }
    ]
  }
};

const MOCK_CANDIDATES = [
  {
    id: 1,
    fullName: "John Doe",
    currentInterviewStep: "Llamada telefónica",
    averageScore: 3
  },
  {
    id: 2,
    fullName: "Jane Smith",
    currentInterviewStep: "Entrevista técnica",
    averageScore: 3
  },
  {
    id: 3,
    fullName: "Alice Johnson",
    currentInterviewStep: "Llamada telefónica",
    averageScore: 4
  },
  {
    id: 4,
    fullName: "Bob Brown",
    currentInterviewStep: "Entrevista cultural",
    averageScore: 2
  },
  {
    id: 5,
    fullName: "Eva White",
    currentInterviewStep: "Entrevista manager",
    averageScore: 5
  }
];

// Función para determinar si usamos datos mock o reales
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

// Obtener detalles del flujo de entrevista para una posición
export const getPositionInterviewFlow = async (
  positionId: string
): Promise<PositionDetails> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_POSITION_DATA);
      }, 500); // Simular delay de red
    });
  }

  try {
    const response = await axios.get(
      `${API_URL}/positions/${positionId}/interviewFlow`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el flujo de entrevista:", error);
    throw new Error(
      "No se pudo obtener la información del flujo de entrevista"
    );
  }
};

// Obtener candidatos para una posición
export const getPositionCandidates = async (
  positionId: string
): Promise<Candidate[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CANDIDATES);
      }, 500); // Simular delay de red
    });
  }

  try {
    const response = await axios.get(
      `${API_URL}/positions/${positionId}/candidates`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los candidatos:", error);
    throw new Error("No se pudo obtener la lista de candidatos");
  }
};
/**
 * Actualiza la fase actual de un candidato en el proceso de entrevista.
 *
 * @param positionId - El identificador único de la posición
 * @param candidateName - El nombre completo del candidato a actualizar
 * @param newStep - El nombre de la nueva fase de entrevista
 * @returns Una promesa que se resuelve cuando la actualización se completa exitosamente
 * @throws Error si la actualización falla
 */
// Actualizar la fase de un candidato
export const updateCandidateStep = async (
  candidateId: number,           // ID de la aplicación del candidato
  newInterviewStepId: number     // ID de la nueva fase de entrevista
): Promise<void> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      console.log(`MOCK: Actualizando candidato ${candidateId} a la etapa ${newInterviewStepId}`);
      setTimeout(resolve, 300); // Simular delay de red
    });
  }

  try {
    // Realiza una solicitud PUT para actualizar la fase del candidato
    await axios.put(`${API_URL}/candidates/${candidateId}/stage`, {
      applicationId: candidateId,
      currentInterviewStep: newInterviewStepId
    });
  } catch (error) {
    console.error("Error al actualizar la fase del candidato:", error);
    throw new Error("No se pudo actualizar la fase del candidato");
  }
};
