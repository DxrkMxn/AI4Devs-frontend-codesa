import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BsArrowLeft } from 'react-icons/bs';
import InterviewStepColumn from './InterviewStepColumn';
import { 
  getPositionInterviewFlow, 
  getPositionCandidates, 
  updateCandidateStep,
  Candidate,
  InterviewStep
} from '../services/positionService';
import './PositionDetails.css';

const PositionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [positionName, setPositionName] = useState<string>('');
  const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Cargar datos de la posición y candidatos
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('ID de posición no encontrado');
        }

        setLoading(true);
        setError(null);

        // Obtener flujo de entrevista y candidatos en paralelo
        const [positionData, candidatesData] = await Promise.all([
          getPositionInterviewFlow(id),
          getPositionCandidates(id)
        ]);

        setPositionName(positionData.positionName);
        
        // Guardar los pasos de entrevista completos para tener acceso a los IDs
        setInterviewSteps(positionData.interviewFlow.interviewSteps);
        
        // Enriquecer los candidatos con los IDs de etapa
        const enrichedCandidates = candidatesData.map(candidate => {
          const stepObj = positionData.interviewFlow.interviewSteps.find(
            step => step.name === candidate.currentInterviewStep
          );
          return {
            ...candidate,
            currentInterviewStepId: stepObj ? stepObj.id : undefined
          };
        });
        
        setCandidates(enrichedCandidates);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejar el arrastre de candidatos entre columnas
  const handleDropCandidate = async (candidate: Candidate, newStepName: string) => {
    // Si ya está en esta fase, no hacemos nada
    if (candidate.currentInterviewStep === newStepName) {
      return;
    }

    try {
      // Buscar el ID de la nueva etapa
      const newStepObj = interviewSteps.find(step => step.name === newStepName);
      
      if (!newStepObj || !candidate.id || !newStepObj.id) {
        throw new Error('Datos incompletos para actualizar al candidato');
      }

      // Actualizar la UI de forma optimista
      const updatedCandidates = candidates.map(c => 
        c.fullName === candidate.fullName 
          ? { 
              ...c, 
              currentInterviewStep: newStepName,
              currentInterviewStepId: newStepObj.id
            } 
          : c
      );
      setCandidates(updatedCandidates);

      // Enviar la actualización al backend
      await updateCandidateStep(candidate.id, newStepObj.id);
    } catch (err) {
      // Revertir cambios si hay error
      setError('Error al actualizar la fase del candidato. Los cambios no se han guardado.');
      console.error(err);
      
      // Recargar los datos originales
      if (id) {
        const refreshedCandidates = await getPositionCandidates(id);
        setCandidates(refreshedCandidates);
      }
    }
  };

  // Filtrar candidatos por fase
  const getCandidatesByStep = (stepName: string) => {
    return candidates.filter(candidate => candidate.currentInterviewStep === stepName);
  };

  // Volver a la lista de posiciones
  const handleBack = () => {
    navigate('/positions');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button variant="primary" onClick={handleBack}>
          <BsArrowLeft /> Volver a posiciones
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 mb-5">
      <div className="position-header">
        <a 
          href="#" 
          className="back-button" 
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
        >
          <BsArrowLeft className="me-2" size={20} />
          Volver a posiciones
        </a>
        <h2>{positionName}</h2>
      </div>

      <DndProvider backend={HTML5Backend}>
        <Row className="candidate-columns">
          {interviewSteps.map((step) => (
            <InterviewStepColumn
              key={step.id}
              title={step.name}
              candidates={getCandidatesByStep(step.name)}
              onDropCandidate={handleDropCandidate}
            />
          ))}
        </Row>
      </DndProvider>
    </Container>
  );
};

export default PositionDetails; 