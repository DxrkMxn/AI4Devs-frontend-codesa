import React from 'react';
import { Card } from 'react-bootstrap';
import { useDrag } from 'react-dnd';
import { Candidate } from '../services/positionService';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANDIDATE',
    item: { candidate },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Renderizar estrellas según la puntuación
  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 0; i < score; i++) {
      stars.push(
        <span key={i} className="me-1">●</span>
      );
    }
    return stars;
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="candidate-card"
    >
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>{candidate.fullName}</Card.Title>
          <div className="score-stars">
            {candidate.averageScore > 0 
              ? renderStars(candidate.averageScore) 
              : <span className="text-muted">Sin puntuación</span>}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CandidateCard; 