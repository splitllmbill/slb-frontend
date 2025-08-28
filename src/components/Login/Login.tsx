import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Alert, AlertColor } from '@mui/material';
import './Login.css';
import Header from '../Header/Header';
import apiService from '../../services/DataService';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../util/aes';
import VerificationModal from '../Account/VerificationModal/VerificationModal';
import CustomSnackbar from '../Common/SnackBar/SnackBar';
import ChangePasswordModal from '../Account/ChangePasswordModal/ChangePasswordModal';
import { FaUser, FaEnvelope, FaLock, FaPlay } from 'react-icons/fa';

interface LoginProps {
   loginRefresh: () => void;
}

const Login: React.FC<LoginProps> = ({ loginRefresh }) => {
   const appTitle = import.meta.env.VITE_APP_TITLE;
   let navigate = useNavigate();
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rpassword, setRPassword] = useState('');
   // const [inviteCode, setInviteCode] = useState('');
   const [buttonText, setButtonText] = useState('Login');
   const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'success', message: '' });
   const [loading, setLoading] = useState(false);
   const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false);
   const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });
   const [isPasswordModalOpen, setisPasswordModalOpen] = useState(false);

   const handleCloseAlert = () => {
      setAlertInfo({ ...alertInfo, open: false });
   };

   const handleVerificationModal = async () => {
      setSnackBarState({ message: 'Email is not yet verified. Please verify to access all functionality.', open: true });
      try {
         const result = await apiService.generateVerificationCode('email');
         if (result) {
            setisVerificationModalOpen(true);
         }
      } catch (error) {
         console.error("Error while generating verification code", error);
      }
   }

   const handleCloseVerification = (check: boolean = false) => {
      setisVerificationModalOpen(false);
      if (check)
         navigate('/home')
   }

   const handleSignUpOrLogin = async (event: any) => {
      event.preventDefault();
      setLoading(true);

      const formData = new FormData(event.target);
      const formDataObject = Object.fromEntries(formData.entries());
      formDataObject['password'] = encrypt(formDataObject.password.toString());
      try {
         const result = buttonText === 'Login' ? await apiService.login(formDataObject as unknown as User) : await apiService.signup(formDataObject as unknown as User);
         if (result) {
            if (buttonText === 'Login') {
               localStorage.setItem('authToken', result.token);
               localStorage.setItem('userId', result.id);
               if (result.verified) {
                  loginRefresh();
                  navigate('/home');
               }
               else
                  handleVerificationModal();
            } else if (buttonText === 'Signup') {
               setAlertInfo({ open: true, severity: 'success', message: 'Signup successful!' });
               setName('');
               setEmail('');
               setPassword('');
               setRPassword('');
               setButtonText('Login');
            }
         }
      } catch (error: any) {
         setAlertInfo({ open: true, severity: 'error', message: error.message });
         console.error('Unexpected error during signup:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleMessageFromModal = (message: string) => {
      setSnackBarState({ open: true, message: message });
   };

   const handleClose = () => {
      setSnackBarState({ ...snackBarState, open: false });
   };

   const handleForgotPassword = () => {
      setisPasswordModalOpen(true);
   }

   const handleCloseChangePassword = () => {
      setisPasswordModalOpen(false);
   }

   return (
      <>
         <div className="modern-login-container">
            <Header />
            <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
            
            {isPasswordModalOpen && <ChangePasswordModal onClose={handleCloseChangePassword} handleMessage={handleMessageFromModal} forgotPassword={true} />}
            {isVerificationModalOpen && <VerificationModal handleClose={handleCloseVerification} handleMessage={handleMessageFromModal} type={'Email'} userData={{ email: email }} />}
            
            {alertInfo.open && (
               <div className="alert-container">
                  <Alert onClose={handleCloseAlert} severity={alertInfo.severity as AlertColor} sx={{ width: '100%', borderRadius: '12px' }}>
                     {alertInfo.message}
                  </Alert>
               </div>
            )}

            <div className="login-content">
            <div className="login-inner-wrapper">
               <Row className="h-100 align-items-center">
                  <Col lg={6} className="login-form-section">
                     <div className="login-card">
                        <div className="login-header">
                           <h2 className="login-title">Welcome Back</h2>
                           <p className="login-subtitle">Sign in to your account to continue</p>
                        </div>

                        <div className="auth-toggle">
                           <button 
                              type="button"
                              disabled={loading} 
                              className={`toggle-btn ${buttonText === 'Login' ? 'active' : ''}`} 
                              onClick={() => setButtonText('Login')}
                           >
                              Login
                           </button>
                           <button 
                              type="button"
                              disabled={loading} 
                              className={`toggle-btn ${buttonText === 'Signup' ? 'active' : ''}`} 
                              onClick={() => setButtonText('Signup')}
                           >
                              Sign Up
                           </button>
                        </div>

                        <Form onSubmit={handleSignUpOrLogin} className="modern-form">
                           {buttonText === 'Signup' && (
                              <div className="input-group">
                                 <div className="input-icon">
                                    <FaUser />
                                 </div>
                                 <Form.Control 
                                    type="text" 
                                    placeholder="Full Name" 
                                    onChange={(event) => setName(event.target.value)} 
                                    value={name} 
                                    name="name" 
                                    required 
                                    className="modern-input"
                                 />
                              </div>
                           )}

                           <div className="input-group">
                              <div className="input-icon">
                                 <FaEnvelope />
                              </div>
                              <Form.Control 
                                 type="email" 
                                 placeholder="Email Address" 
                                 onChange={(event) => setEmail(event.target.value)} 
                                 value={email} 
                                 name="email" 
                                 required 
                                 className="modern-input"
                              />
                           </div>

                           <div className="input-group">
                              <div className="input-icon">
                                 <FaLock />
                              </div>
                              <Form.Control 
                                 type="password"
                                 placeholder="Password" 
                                 onChange={(event) => setPassword(event.target.value)} 
                                 value={password} 
                                 name="password" 
                                 required 
                                 className="modern-input"
                              />
                           </div>

                           {buttonText === 'Signup' && (
                              <>
                                 <div className="input-group">
                                    <div className="input-icon">
                                       <FaLock />
                                    </div>
                                    <Form.Control 
                                       type="password"
                                       placeholder="Confirm Password" 
                                       onChange={(event) => setRPassword(event.target.value)} 
                                       value={rpassword} 
                                       required 
                                       className="modern-input"
                                    />
                                 </div>

                                 {/* <div className="input-group">
                                    <Form.Control 
                                       type="text" 
                                       placeholder="Invite Code (or use: 8I3JVN)" 
                                       onChange={(event) => setInviteCode(event.target.value)} 
                                       value={inviteCode} 
                                       name="inviteCode" 
                                       required 
                                       className="modern-input"
                                    />
                                 </div> */}
                              </>
                           )}

                           <Button 
                              disabled={loading} 
                              type="submit" 
                              className="modern-submit-btn"
                           >
                              {loading ? (
                                 <div className="loading-spinner"></div>
                              ) : (
                                 buttonText
                              )}
                           </Button>

                           {buttonText === 'Login' && (
                              <div className="forgot-password">
                                 <button type="button" onClick={handleForgotPassword} className="forgot-link">
                                    Forgot your password?
                                 </button>
                              </div>
                           )}
                        </Form>
                     </div>
                  </Col>

                  <Col lg={6} className="info-section">
                     <div className="info-content">
                        <div className="app-intro">
                           <h1 className="app-title">Welcome to {appTitle}!</h1>
                           <p className="app-description">
                              SplitLLM simplifies managing shared expenses. Whether dining with friends or organizing group activities, you can easily split bills and ensure everyone pays their fair share.
                           </p>
                           <p className="app-feature">
                              Just take a photo of your bill, and SplitLLM takes care of the rest! Our intuitive interface helps you track your finances effortlessly, making outings hassle-free while keeping your budget in check.
                           </p>
                        </div>

                        <div className="video-section">
                           <h3 className="video-title">See How It Works</h3>
                           <div className="video-container">
                              <div className="video-thumbnail">
                                 <iframe
                                    src="https://www.youtube.com/embed/1G2chXNCphg"
                                    title="SplitLLM Overview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="video-iframe"
                                 />
                                 <div className="play-overlay">
                                    <FaPlay />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
               </div>
            </div>
         </div>
      </>
   );
};

export default Login;
