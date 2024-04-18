import { useEffect, useState } from 'react';
import { Box, Modal } from '@mui/material';
import { Container, Flex } from '../../../App.styled';
import { Label, Input } from '../AccountPage.styled';
import QRCode from 'react-qr-code';
import { Row, Col } from 'react-bootstrap';

interface QRModalModalProps {
    onClose: () => void;
    upiId: string
}

const QRModal: React.FC<QRModalModalProps> = ({ onClose, upiId }) => {
    const [amount, setamount] = useState('');
    const [notes, setNotes] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        setLink('upi://pay?pa=' + upiId + '&pn=User1&tn=' + notes + '&am=' + amount + '&cu=INR')
    }, [amount, notes])

    return (
        <Container>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="change-pwd-modal-title"
                aria-describedby="change-pwd-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        margin: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        padding: '40px',
                        borderRadius: 1,
                        maxWidth: '400px',
                        maxHeight: '550px',
                        overflow: 'auto'
                    }}
                >
                    <h4 >UPI QR code</h4>
                    <Row>
                        <Col xs={12} md={4}>
                            <Label>Amount:</Label>
                        </Col>
                        <Col xs={12} md={2}></Col>
                        <Col xs={12} md={6}>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 100000)
                                        setamount(e.target.value)
                                }}
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Label>Notes:</Label>
                        </Col>
                        <Col xs={12} md={2}></Col>
                        <Col xs={12} md={6}>
                            <Input
                                type="text"
                                value={notes}
                                onChange={(e) => {
                                    if (e.target.value.length < 20)
                                        setNotes(e.target.value)
                                }}
                                required
                            />
                        </Col>
                    </Row>
                    <Flex style={{ marginTop: '20px', justifyContent: "center" }}>
                        <QRCode value={link} />
                    </Flex>
                </Box>
            </Modal>
        </Container >
    );
};

export default QRModal;