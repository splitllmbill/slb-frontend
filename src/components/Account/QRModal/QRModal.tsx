import { useEffect, useState } from 'react';
import { Box, Modal } from '@mui/material';
import { Flex, Container, Input } from '../../../App.styled';
import { Label } from '../AccountPage.styled';
import QRCode from 'react-qr-code';

interface QRModalModalProps {
    onClose: () => void;
    upiId: string
}

const QRModal: React.FC<QRModalModalProps> = ({ onClose , upiId }) => {
    const [amount, setamount] = useState('');
    const [notes, setNotes] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        setLink('upi://pay?pa=' + upiId + '&pn=User1&tn=' + notes + '&am=' + amount + '&cu=INR')
    }, [amount,notes])

    return (
        <Container>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="change-pwd-modal-title"
                aria-describedby="change-pwd-modal-description"
            >
                <Box sx={{ position: 'absolute', bgcolor: 'background.paper', boxShadow: 24, padding: '40px', borderRadius: 1 }}>
                    <h4 >UPI QR code</h4>
                    <Flex style={{ marginTop: '20px', alignItems: 'baseline' }}>
                        <Label>Amount:</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                if(Number(e.target.value) < 100000)
                                    setamount(e.target.value)
                            }}
                            style={{ width:'100px' }}
                            required
                        />
                        <Label>Notes:</Label>
                        <Input
                            type="text"
                            value={notes}
                            onChange={(e) => {
                                if(e.target.value.length < 20)
                                    setNotes(e.target.value)
                            }}
                            required
                        />
                    </Flex>
                    <Flex style={{ marginTop: '10px' }}>
                        <QRCode value={link} size={200}/>
                    </Flex>
                </Box>
            </Modal>
        </Container >
    );
};

export default QRModal;