import { useState } from 'react';
import { Box, CircularProgress, IconButton, Modal, Tooltip } from '@mui/material';
import { Button, Container } from '../../../App.styled';
import { Label, Input } from '../AccountPage.styled';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { Row, Col } from 'react-bootstrap';
import dataService from '../../../services/DataService';

interface UPIModalProps {
    onClose: () => void;
    handleCopy: (text: string, type: string) => void;
    upiId: string
}

const UPIModal: React.FC<UPIModalProps> = ({ onClose, handleCopy, upiId }) => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    const [amount, setamount] = useState('');
    const [notes, setNotes] = useState('');
    const [pageLink, setPageLink] = useState('');
    const [expiry, setExpiry] = useState('24');
    const [showLoader, setShowLoader] = useState(false);

    const generateContent = () => {
        return `Hey there, could you please settle the balance you owe me using this link: <a href="${pageLink}">${pageLink}</a> . If you would also like to create similar links, check out ${appTitle} at <a href="${location.origin}">${location.origin}</a>!`
    }

    const handleShare = async (title: string) => {
        if (navigator.share) {
            try {
                if(title === 'UPI Page') {
                    await navigator.share({
                        title: title,
                        text: generateContent()
                    });
                    
                }
                else {
                    await navigator.share({
                        title: title,
                        text: upiId
                    });
                }
                console.log('Successfully shared');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            console.log('Web Share API is not supported');
        }
    };

    const getPageLink = (link: string) => {
        return `${location.origin}/payments/${link}`
    }

    const handleGenerate = async () => {
        setShowLoader(true);
        try {
            const data = await dataService.createUPIPage({
                destination: upiId,
                expiry: parseInt(expiry),
                amount: parseFloat(amount),
                note: notes
            });
            setPageLink(getPageLink(data['link']));
            setShowLoader(false);
        } catch (error) {
            console.log("Error occurred", error);
        }
    };

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
                    <h4 style={{marginBottom: '25px'}}>Share your payment info</h4>
                    <Row>
                        <Col xs={12} md={3}>
                            <Label>UPI Id:</Label>
                        </Col>
                        <Col xs={12} md={5}>
                            <Input
                                type="text"
                                value={upiId}
                                disabled
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Tooltip title="Copy UPI Id">
                                <IconButton
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                                    onClick={() => handleCopy(upiId,'UPI Id')}
                                >
                                    <ContentCopyOutlinedIcon style={{ color: 'black' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share UPI Id">
                                <IconButton
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                                    onClick={() => handleShare('UPI Id')}
                                >
                                    <ShareRoundedIcon style={{ color: 'black' }} />
                                </IconButton>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={3}>
                            <Label>Amount:</Label>
                        </Col>
                        <Col xs={12} md={5}>
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
                        <Col xs={12} md={4}></Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={3}>
                            <Label>Notes:</Label>
                        </Col>
                        <Col xs={12} md={5}>
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
                        <Col xs={12} md={4}></Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Label>Expiry(hours):</Label>
                        </Col>
                        <Col xs={12} md={4}>
                            <Input
                                type="number"
                                value={expiry}
                                onChange={(e) => {
                                    if (e.target.value.length < 1000)
                                        setExpiry(e.target.value)
                                }}
                                required
                            />
                        </Col>
                        <Col xs={12} md={4}></Col>
                    </Row>
                    {
                        pageLink.length !== 0 && 
                        <Row style={{ marginBottom: '10px' }}>
                            <Col xs={12} md={4}>
                                <Label>Link: </Label>
                            </Col>
                            <Col xs={12} md={4}>
                                <a style={{ color: '#007bff', cursor: 'pointer' }} href={pageLink} target='_blank'> Try it! </a>
                            </Col>
                                <Col xs={12} md={4}>
                                    <Tooltip title="Copy Link">
                                        <IconButton
                                            size="small"
                                            style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                                            onClick={() => handleCopy(pageLink, 'UPI page link')}
                                        >
                                            <ContentCopyOutlinedIcon style={{ color: 'black' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share Link">
                                        <IconButton
                                            size="small"
                                            style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                                            onClick={() => handleShare('UPI Page')}
                                        >
                                            <ShareRoundedIcon style={{ color: 'black' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Col>
                        </Row>
                    }
                    
                    { showLoader && 
                        <div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>
                    }
                    { !showLoader && 
                        <Row>
                            <Col xs={12} md={12}>
                                <Button onClick={handleGenerate} disabled={amount == '' || notes == ''}>Generate UPI Page </Button>
                            </Col>
                        </Row>
                    }
                    
                </Box>
            </Modal>
        </Container >
    );
};

export default UPIModal;