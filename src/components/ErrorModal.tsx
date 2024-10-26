import React from 'react';
import "../styles/ErrorModal.scss"
interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal">
      <div className="error-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Error</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
