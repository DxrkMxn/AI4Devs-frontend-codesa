import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import CandidateCard from './CandidateCard';
import { Candidate } from '../services/positionService';

interface InterviewStepColumnProps {
  title: string;
  candidates: Candidate[];
  onDropCandidate: (candidate: Candidate, newStep: string) => void;
}

const InterviewStepColumn: React.FC<InterviewStepColumnProps> = ({
  title,
  candidates,
  onDropCandidate,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'CANDIDATE',
    drop: (item: { candidate: Candidate }) => {
      onDropCandidate(item.candidate, title);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Col md={4} sm={6} xs={12} className="mb-4">
      <Card 
        className={`shadow-sm h-100 step-column ${isOver ? 'bg-light' : ''}`}
      >
        <div className="step-header">
          <h5 className="step-title">{title}</h5>
          <span className="candidate-count">{candidates.length}</span>
        </div>
        <Card.Body ref={drop} className="p-3">
          {candidates.map((candidate, index) => (
            <CandidateCard key={`${candidate.fullName}-${index}`} candidate={candidate} />
          ))}
          {candidates.length === 0 && (
            <div className="empty-step">
              <p>No hay candidatos en esta fase</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InterviewStepColumn; 