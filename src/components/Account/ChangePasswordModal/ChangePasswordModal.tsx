import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import { Col, Row } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { Button, Container, Input } from '../../../App.styled';
import { encrypt } from '../../../util/aes';

interface ChangePasswordModalProps {
    onClose: () => void; // Define onClose as a function that takes no arguments and returns void
    forgotPassword: boolean;
    handleMessage: (message: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, forgotPassword, handleMessage }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (!forgotPassword) {
            setLoading(true);
            if (newPassword === confirmPassword && newPassword != '') {
                let requestData = {
                    password: encrypt(newPassword)
                }
                try {
                    await dataService.changePassword(requestData).then((data) => {
                        handleMessage(data.message);
                        onClose();
                    })
                } catch (error) {
                    console.log("Error occured", error);
                } finally {
                    setLoading(false);
                }
            } else {
                if (newPassword != confirmPassword)
                    handleMessage("New password and confirm new password don't match!");
                else if (newPassword == '')
                    handleMessage("Password cannot be empty!");
                setLoading(false);
            }
        }
        else {
            try {
                await dataService.forgotPassword({ email: email }).then((data) => {
                    handleMessage(data.message);
                    console.log("new password", data.new_password);
                    onClose();
                })
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
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
                            {!forgotPassword && (<Button onClick={handleChangePassword} disabled={loading}>Change Password</Button>)}
                            {forgotPassword && (<Button onClick={handleChangePassword} disabled={loading}>Reset Password</Button>)}
                        </Row>
                    </div>
                </Box>
            </Modal>
        </Container >
    );
};

export default ChangePasswordModal;