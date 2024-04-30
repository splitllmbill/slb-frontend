import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { Button, Container } from '../../../App.styled';
import dataService from '../../../services/DataService';
import './VerificationModal.css';
import { useNavigate } from 'react-router-dom';

interface VerificationModalProps {
  handleClose: (check: boolean) => void;
  type: string;
  userData: any;
  handleMessage: (message: string) => void;
  navigationPath?: string;
}

const typeMap: Record<string, string> = {
  'Mobile': 'mobile',
  'UPI Number': 'upiNumber',
  'Email': 'email'
};

const VerificationModal: React.FC<VerificationModalProps> = ({ handleClose, type, userData, handleMessage, navigationPath }) => {

  const navigate = useNavigate();
  const [codes, setCodes] = useState(['', '', '', '']);
  const [verificationStatus, setVerificationStatus] = useState(true);

  const handleChange = (index: number, value: string) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    const verificationCode = codes.join('');
    try {
      const result = await dataService.validateVerificationCode(typeMap[type], verificationCode, userData[typeMap[type]]);
      if (result.message !== 'Success') {
        setVerificationStatus(false);
      }
      else {
        handleMessage('Verified ' + type)
        handleClose(true);
        navigate(navigationPath || '/home');
      }
    } catch (error) {
      console.error("Error while validating verification code", error);
    }
  };

  const handleClear = () => {
    setCodes(['', '', '', '']);
    setVerificationStatus(true);
    const firstInput = document.getElementById('input-0');
    if (firstInput) {
      firstInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');
    const pastedCodes = pastedData.split('').slice(0, 4); // Take only the first four characters
    const newCodes = [...codes];
    pastedCodes.forEach((code, index) => {
      newCodes[index] = code;
    });
    setCodes(newCodes);
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    setVerificationStatus(true)
    if (event.key === 'Backspace' && index > 0 && !codes[index]) {
      // If backspace is pressed and the current input field is empty,
      // move the focus to the previous input field and delete its content
      event.preventDefault();
      const newCodes = [...codes];
      newCodes[index - 1] = '';
      setCodes(newCodes);
      const prevInput = document.getElementById(`input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <Container>
      <Modal
        open={true}
        onClose={() => handleClose(false)}
        aria-labelledby="verification-modal-title"
        aria-describedby="verification-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '25%' }}>
          <form className="form">
            <span className="close" onClick={() => handleClose(false)}>X</span>
            <div className="info">
              <span className="title">{type} Verification</span>
              <p className="description">Enter the verification code sent via {type !== 'Email' ? 'sms' : type.toLocaleLowerCase()}</p>
              {!verificationStatus &&
                <p className="error-message">Invalid Verification Code</p>
              }
            </div>
            <div className="input-fields">
              {codes.map((code, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  maxLength={1}
                  type="text"
                  placeholder=""
                  value={code}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{ border: !verificationStatus ? '2.5px solid red' : '' }}
                  required
                />
              ))}
            </div>
            <div className="action-btns">
              <Button type="button" className="verify" onClick={handleVerify}>Verify</Button>
              <Button type="button" className="clear" onClick={handleClear}>Clear</Button>
              <Button type="button" className="cancel" onClick={() => handleClose(false)}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default VerificationModal;