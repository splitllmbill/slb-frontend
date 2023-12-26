import { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Alert, AlertColor } from '@mui/material';
import './Login.css';
import Header from '../Header/Header';
import apiService from '../../services/DataService';

const Login = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rpassword, setRPassword] = useState('');
   const [buttonText, setButtonText] = useState('Login');
   const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'success', message: '' });

   const handleCloseAlert = () => {
      setAlertInfo({ ...alertInfo, open: false });
   };

   const handleSignUp = async (event: any) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = Object.fromEntries(formData.entries());

      try {
         const result = await apiService.signup(formDataObject as unknown as User);
         if (result) {
            setAlertInfo({ open: true, severity: 'success', message: 'Signup successful!' });
            setName('');
            setEmail('');
            setPassword('');
            setRPassword('');
         }
      } catch (error) {
         setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error during signup' });
         console.error('Unexpected error during signup:', error);
      }
   };
   const appDesc = "Welcome to SplitLLMBill, your go-to app for seamless bill splitting. Easily manage shared expenses, split bills with friends, and keep track of your finances.";
   const lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

   return (
      <>
         <div className="login-container">
            <Header></Header>
            <br></br>
            {alertInfo.open && (
               <Alert open={alertInfo.open} onClose={handleCloseAlert} severity={alertInfo.severity as AlertColor} sx={{ width: '100%' }}>
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
                           <Form onSubmit={handleSignUp}>
                              <FormGroup controlId="formBasicName">
                                 <Form.Control type="name" placeholder="Name" onChange={(event) => setName(event.target.value)} value={name} name="name" required />
                              </FormGroup>
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
                                 </>
                              }
                              <Button variant="primary" type="submit">
                                 {buttonText}
                              </Button>
                              <p>Or sign up with</p>
                              <Button variant="outline-primary" type="submit">
                                 <i className="fab fa-google" /> Google
                              </Button>
                           </Form>
                        </Col>
                     </Row>
                  </Row>
               </Col>
               <Col sm={1}></Col>
               <Col sm={5}>
                  <div>
                     <br></br>
                     <p>{appDesc}</p>
                     <p>{lorem}</p>
                  </div>
               </Col>
            </Row>
         </div >
      </>
   );
};

export default Login;
