import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import { Col, Row } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { Button, Container, Input } from '../../../App.styled';

const ChangePasswordModal = ({ onClose, forgotPassword }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleChangePassword = async () => {
        if (!forgotPassword) {
            if (newPassword === confirmPassword && newPassword != '') {
                let requestData = {
                    password: newPassword
                }
                await dataService.changePassword(requestData).then((data) => {
                    alert(data.message)
                    onClose();
                })
            } else {
                if (newPassword != confirmPassword)
                    alert("New password and confirm new password don't match!")
                else if (newPassword == '')
                    alert("Password cannot be empty!")
            }
        }
        else {
            await dataService.forgotPassword({ email: email }).then((data) => {
                alert(data.message)
                console.log("new password", data.new_password);
                onClose();
            })
        }
    }

    return (
        <Container>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="change-pwd-modal-title"
                aria-describedby="change-pwd-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', minWidth: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1 }}>
                    <div>
                        <Row>
                            <Col xs={10}>
                                {forgotPassword && (<h2 id="change-pwd-modal-title">Forgot Password</h2>)}
                                {!forgotPassword && (<h2 id="change-pwd-modal-title">Change Password</h2>)}
                            </Col>
                            <Col xs={2} className="d-flex justify-content-end">
                                <IoMdClose onClick={onClose} style={{ fontSize: 'x-large' }} />
                            </Col>
                        </Row>
                        <p id="add-friend-modal-description">Enter the below details</p>
                        {forgotPassword && (
                            <Row>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />
                            </Row>
                        )}
                        {!forgotPassword && (
                            <>
                                < Row >
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                    />
                                </Row>
                                <Row>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                    />
                                </Row>
                            </>
                        )}
                        <Row>
                            {!forgotPassword && (<Button onClick={handleChangePassword}>Change Password</Button>)}
                            {forgotPassword && (<Button onClick={handleChangePassword}>Reset Password</Button>)}
                        </Row>
                    </div>
                </Box>
            </Modal>
        </Container >
    );
};

export default ChangePasswordModal;