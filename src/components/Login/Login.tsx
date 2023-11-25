import { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import './Login.css';
import logo from '../../assets/logo.png';
import apiService from '../../services/DataService';

const Login = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rpassword, setRPassword] = useState('');
   const [buttonText, setButtonText] = useState('Login');

   const handleSignUp = (event: any) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = Object.fromEntries(formData.entries());
      console.log(formDataObject);
      //apiService.signup(formDataObject as unknown as User)
   };

   const appName = "SplitLLMBill";

   return (
      <>
         <div className="login-container">
            <div className="app-header">
               <Stack direction="horizontal" gap={2}>
                  <img src={logo} height={50} width={50} />
                  <h3><b>{appName}</b></h3>
               </Stack>
            </div>
            <Row>
               <Row>
                  <Col sm={6}><Button className={buttonText === 'Login' ? 'button primary active' : 'button primary '} onClick={() => setButtonText('Login')}>Login</Button></Col>
                  <Col sm={6}><Button className='button primary' onClick={() => setButtonText('Sign Up')}>Signup</Button></Col>
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
                        {buttonText === 'Sign Up' &&
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
         </div>
      </>
   );
};

export default Login;
