import { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { Flex, Container } from '../../../App.styled';
import QRCode from 'react-qr-code';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Tooltip from '@mui/material/Tooltip';
import { IconButton, Typography } from '@mui/material';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';


interface SettleExpenseModalProps {
    onClose: () => void;
    submitSettleUp: () => void;
    link: string
    friendData: any
}

const SettleExpenseModal: React.FC<SettleExpenseModalProps> = ({ onClose, submitSettleUp, link , friendData }) => {
    const [showQR, setshowQR] = useState(false);

    const verifySubmit = async() => {
        const response = confirm("Please confirm that you have paid Rs " + friendData.due + " to " + friendData.name);
        if (response) {
            submitSettleUp();
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
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1 }}>
                    <Flex style={{marginBottom: '-5px'}}>
                        <Typography variant="h4">UPI Payment Helper</Typography>
                        <Tooltip title={showQR ? "Hide QR" : "View QR"}>
                            <IconButton
                                size="small"
                                style={{ width: 'auto', height: 'auto'}}
                                onClick={() => setshowQR(!showQR)}
                            >
                                <QrCode2OutlinedIcon style={{ color: 'black' }} />
                            </IconButton>
                        </Tooltip>                        
                    </Flex>
                    <Typography variant="body2" color="textSecondary">Note: Links work only on mobile. For other devices use QR</Typography>
                    {   
                        !showQR && 
                        <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">Google Pay</Typography>
                                <IconButton href={'tez://' + link} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                                    <VerifiedUserOutlinedIcon
                                        color={'success'}
                                    />
                                </IconButton>

                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">PhonePe</Typography>
                                <IconButton href={'phonepe://' + link} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                                    <VerifiedUserOutlinedIcon
                                        color={'success'}
                                    />
                                </IconButton>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Typography variant="body1">Others</Typography>
                                <IconButton href={'upi://' + link} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                                    <VerifiedUserOutlinedIcon
                                        color={'success'}
                                    />
                                </IconButton>
                            </div>
                        </>
                    }
                    
                    {
                        showQR &&
                        <Flex style={{ marginTop: '10px', marginBottom: '20px'}}>
                            <QRCode
                                value={'upi://' + link}
                                size={400}
                            />
                        </Flex>
                    }
                    <button className="w-100" style={{marginBottom: 0}} onClick={verifySubmit}>
                        <span>Settle Up!</span>
                    </button>
                </Box>
            </Modal>
        </Container >
    );
};

export default SettleExpenseModal;