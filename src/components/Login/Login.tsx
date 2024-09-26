import React, { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
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
   const [inviteCode, setInviteCode] = useState('');
   const [buttonText, setButtonText] = useState('Login');
   const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'success', message: '' });
   const [loading, setLoading] = useState(false); // Add loading state
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
      setLoading(true); // Set loading state to true

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
               setInviteCode('');
               setButtonText('Login');
            }
         }
      } catch (error: any) {
         setAlertInfo({ open: true, severity: 'error', message: error.message });
         console.error('Unexpected error during signup:', error);
      } finally {
         setLoading(false); // Reset loading state regardless of success or failure
      }
   };

   const handleMessageFromModal = (message: string) => {
      setSnackBarState({ open: true, message: message }); // Update the snackbar state with the message
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

   const appDesc = `SplitLLM is designed to make managing shared expenses a breeze. Whether you're dining out with friends or organizing group activities, our app allows you to effortlessly split bills and ensure everyone pays their fair share. Simply take a photo of your bill, and SplitLLM will handle the rest! Stay organized with our intuitive interface that helps you track your finances, so you can enjoy hassle-free outings while keeping your budget in check.`;


   return (
      <>
         <div className="login-container">
            <Header></Header>
            <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
            <br></br>
            {isPasswordModalOpen && <ChangePasswordModal onClose={handleCloseChangePassword} handleMessage={handleMessageFromModal} forgotPassword={true} />}
            {isVerificationModalOpen && <VerificationModal handleClose={handleCloseVerification} handleMessage={handleMessageFromModal} type={'Email'} userData={{ email: email }} />}
            {alertInfo.open && (
               <Alert onClose={handleCloseAlert} severity={alertInfo.severity as AlertColor} sx={{ width: '100%' }}>
                  {alertInfo.message}
               </Alert>
            )}
            <br></br>
            <Row>
               <Col sm={5}>
                  <Row>
                     <Row>
                        <Col sm={6}><Button disabled={loading} className={buttonText === 'Login' ? 'button primary active' : 'button primary'} onClick={() => setButtonText('Login')}>Login</Button></Col>
                        <Col sm={6}><Button disabled={loading} className={buttonText === 'Signup' ? 'button primary active' : 'button primary'} onClick={() => setButtonText('Signup')}>Signup</Button></Col>
                     </Row>
                     <Row>
                        <Col>
                           <Form onSubmit={handleSignUpOrLogin}>
                              {buttonText === 'Signup' &&
                                 <FormGroup controlId="formBasicName">
                                    <Form.Control type="text" placeholder="Name" onChange={(event) => setName(event.target.value)} value={name} name="name" required />
                                 </FormGroup>
                              }
                              <br></br>
                              <FormGroup controlId="formBasicEmail">
                                 <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} value={email} name="email" required />
                              </FormGroup>
                              <br></br>
                              <FormGroup controlId="formBasicPassword">
                                 <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} value={password} name="password" required />
                              </FormGroup>
                              <br></br>
                              {buttonText === 'Signup' &&
                                 <>
                                    <FormGroup controlId="formBasicPasswordRepeat">
                                       <Form.Control type="password" placeholder="Re-enter Password" onChange={(event) => setRPassword(event.target.value)} value={rpassword} required />
                                    </FormGroup>
                                    <br></br>
                                    <FormGroup controlId="formBasicInviteCode">
                                       <Form.Control type="text" placeholder="Your invite code (or use: BQRM27)" onChange={(event) => setInviteCode(event.target.value)} value={inviteCode} name="inviteCode" required />
                                    </FormGroup>
                                    <br></br>
                                 </>
                              }
                              <Button disabled={loading} variant="outline-primary" type="submit">
                                 {buttonText}
                              </Button>
                              <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
                           </Form>
                        </Col>
                     </Row>
                  </Row>
               </Col>
               <Col sm={1}></Col>
               <Col sm={5}>
                  <div>
                     <div style={{ textAlign: "justify" }}>
                        <p>
                           <b>Welcome to {appTitle}!</b>
                        </p>
                        <p>
                           SplitLLM simplifies managing shared expenses. Whether dining with friends or organizing group activities, you can easily split bills and ensure everyone pays their fair share.
                        </p>
                        <p>
                           Just take a photo of your bill, and SplitLLM takes care of the rest! Our intuitive interface helps you track your finances effortlessly, making outings hassle-free while keeping your budget in check.
                        </p>
                        <p>
                           For more details, watch our YouTube video!
                        </p>

                        <iframe
                           width="400"
                           height="250"
                           src="https://www.youtube.com/embed/1G2chXNCphg"
                           title="SplitLLM Overview"
                           frameBorder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                        ></iframe>
                     </div>
                  </div>

               </Col>
            </Row>
         </div >
      </>
   );
};

export default Login;
