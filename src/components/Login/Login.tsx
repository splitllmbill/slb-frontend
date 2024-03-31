import { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Alert, AlertColor } from '@mui/material';
import './Login.css';
import Header from '../Header/Header';
import apiService from '../../services/DataService';
import { useNavigate } from 'react-router-dom';
// import ChangePasswordModal from '../Account/ChangePasswordModal/ChangePasswordModal';
import VerificationModal from '../Account/VerificationModal/VerificationModal';

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
   // const [isModalOpen, setIsModalOpen] = useState(false);
   const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false);


   // const openModal = () => {
   //    setIsModalOpen(true);
   // }

   // const closeModal = () => {
   //    setIsModalOpen(false);
   // }

   const handleCloseAlert = () => {
      setAlertInfo({ ...alertInfo, open: false });
   };

   const tempDisplayCode = (code: string) => {
      alert(code);
   }
   

   const handleVerificationModal = async() => {
      alert('Email is not yet verified. Please verify to access all functionality.')
      try {
         const result = await apiService.generateVerificationCode('email');
         if (result) {
            tempDisplayCode(result.emailCode);
            setisVerificationModalOpen(true);
         }
      } catch (error) {
         console.error("Error while generating verification code", error);
      }
   }

   const handleCloseVerification = (check: boolean = false) => {
      setisVerificationModalOpen(false);
      if(check)
         navigate('/home')
   }

   const handleSignUpOrLogin = async (event: any) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = Object.fromEntries(formData.entries());
      try {
         const result = buttonText === 'Login' ? await apiService.login(formDataObject as unknown as User) : await apiService.signup(formDataObject as unknown as User);
         if (result) {
            if (buttonText === 'Login') {
               localStorage.setItem('authToken', result.token);
               localStorage.setItem('userId', result.id);
               if(result.verified){
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
      } catch (error : any) {
         setAlertInfo({ open: true, severity: 'error', message: error.message });
         console.error('Unexpected error during signup:', error);
      }
   };

   const appDesc = `Welcome to ${appTitle}, your go-to app for seamless bill splitting. Easily manage shared expenses, split bills with friends, and keep track of your finances.`;

   return (
      <>
         <div className="login-container">
            <Header></Header>
            <br></br>
            {/* {isModalOpen && <ChangePasswordModal onClose={closeModal} forgotPassword={true} />} */}
            {isVerificationModalOpen && <VerificationModal handleClose={handleCloseVerification} type={'Email'} userData={{email: email}}/>}
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
                        <Col sm={6}><Button className={buttonText === 'Login' ? 'button primary active' : 'button primary'} onClick={() => setButtonText('Login')}>Login</Button></Col>
                        <Col sm={6}><Button className={buttonText === 'Signup' ? 'button primary active' : 'button primary'} onClick={() => setButtonText('Signup')}>Signup</Button></Col>
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
                                       <Form.Control type="text" placeholder="Enter invite code provided" onChange={(event) => setInviteCode(event.target.value)} value={inviteCode} name="inviteCode" required />
                                    </FormGroup>
                                    <br></br>
                                 </>
                              }
                              <Button variant="primary" type="submit">
                                 {buttonText}
                              </Button>
                              {/* <p>Or sign up with</p>
                              <Button variant="outline-primary" type="submit">
                                 <i className="fab fa-google" /> Google
                              </Button>
                              <a href="#" onClick={openModal}>Forgot password?</a> */}
                           </Form>
                        </Col>
                     </Row>
                  </Row>
               </Col>
               <Col sm={1}></Col>
               <Col sm={5}>
                  <div>
                     <br></br>
                     <br></br>
                     <p>{appDesc}</p>
                  </div>
               </Col>
            </Row>
         </div >
      </>
   );
};

export default Login;
