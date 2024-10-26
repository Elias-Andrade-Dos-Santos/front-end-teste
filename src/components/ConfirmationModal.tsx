
import React from 'react';
import '../styles/ConfirmationModal.scss';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>Sim</button>
          <button className="cancel-btn" onClick={onCancel}>Não</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
