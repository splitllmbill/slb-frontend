import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Modal, TextField, styled } from '@mui/material';
import { Flex, Container } from '../../../App.styled';
import QRCode from 'react-qr-code';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Tooltip from '@mui/material/Tooltip';
import { IconButton, Typography } from '@mui/material';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { toTitleCase } from '../../../services/State';
import { Col, Row } from 'react-bootstrap';
import { MarginLeft } from '../ExpenseCardNew/ExpenseCardNew.styled';
import dataService from '../../../services/DataService';

interface SettleExpenseModalProps {
    onClose: () => void;
    friendSettleUp?: () => void;
    eventSettleUp?:(shares:{userId:string,amount:number}[]) => void;
    friendData: {id:string;name:string;due:number}[]
    settleType:string
}

const SettleExpenseModal: React.FC<SettleExpenseModalProps> = ({ onClose, friendSettleUp,eventSettleUp, friendData ,settleType}) => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    const dueRef =  useRef<HTMLInputElement>(null);
    const [showQR, setshowQR] = useState(false);
    const [selectedFriendData, setSelectedFriendData] = useState<{id:string;name:string;due:number}>({id:"",name:"",due:0})
    const [amountConfirmed,setAmountConfirmed] =useState(false)
    const [friendSelected,setFriendSelected ]= useState(false)
    const  [link,setLink]=useState("")
    const CenteredFlex = styled(Flex)({
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
       marginBottom: '-5px',
      });
    const HorizontalCenteredFlex = styled(Flex)({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    });
    const StyledCurrencyRupeeIcon = styled(CurrencyRupeeIcon)({
        marginRight: '4px', // Adjust the margin as needed
      });
    const verifySubmit = async() => {
        const response = confirm("Please confirm that you have paid Rs " + selectedFriendData.due + " to " + selectedFriendData.name);
        if (response) {
            if(settleType=="friend"){
                friendSettleUp!();
            }else{
                const shares=[{userId:selectedFriendData.id,amount:selectedFriendData.due}]
                console.log("shares",shares)
                eventSettleUp!(shares);
            }
                
        }
    }
    const handleConfirmAmount = ()=>{
        if(dueRef.current!==null){
            const updatedFriendData = {
                ...selectedFriendData,
                due: parseFloat(dueRef.current.value)
              };
              setSelectedFriendData(updatedFriendData);
      
              setAmountConfirmed(true);
              handleConfirmAmount1();
        }
        
    }
    const handleConfirmAmount1 = async() =>{
        try{
            const result = await dataService.generateUPILink(selectedFriendData.due, 'Settle ' + appTitle + ' dues', selectedFriendData.id);
            if (result.message === "No record found for id") {
                const response = confirm("Receiving has not added UPI ID to their account.\nDo you want to proceed to settle manually ? ");
                if (response) {
                    if(settleType=="friend"){
                        friendSettleUp!();
                    }else{
                        const shares=[{userId:selectedFriendData.id,amount:selectedFriendData.due}]
                        eventSettleUp!(shares);
                    }    
                }else{
                    onClose()
                }
            } else {
                setLink(result.upiLink);
            }
        } catch (error) {
            console.error("Error while generating UPI Link", error);
        }

    }

    const handleSelectSettleUser =  (data:{id:string;name:string;due:number})=>{
        setSelectedFriendData(data);
        setFriendSelected(true);

    }

    useEffect(()=>{
        if(friendData.length==1){
            setSelectedFriendData(friendData[0]);
            setFriendSelected(true);
        }
    },[])

    return (
        <Container>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="change-pwd-modal-title"
                aria-describedby="change-pwd-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1 }}>
                   
                    {!friendSelected &&
                        (<CenteredFlex> 
                        <Typography variant="h6" component="div" >
                                                Who do you want to settle with:
                        </Typography>
                        {friendData.map((data)=>{
                            return (
                            
                                <Card sx={{"width":"100%"}} onClick={()=>{handleSelectSettleUser(data)
                                }}>
                            
                                    <CardContent>
                                        
                                        <Row>
                                            <Col className="d-flex ">
                                                <MarginLeft className="text-left"> {/* Add text-left class for left alignment inside the div */}
                                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                        {toTitleCase(data.name)}
                                                    </Typography>
                                                </MarginLeft>
                                            </Col>
                                            <br></br>
                                            <Col className="d-flex justify-content-end">
                                                <HorizontalCenteredFlex sx={{'gap':'4px'}}>
                                                    <StyledCurrencyRupeeIcon fontSize="small"/>
                                                    <Typography variant="h6" component="div" >
                                                                {data.due}
                                                    </Typography>
                                                </HorizontalCenteredFlex>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                    <Typography variant="h4"><b>{selectedFriendData.name}</b> </Typography>
                                </Card>
                            )
                        })}
                        </CenteredFlex>)
                    
                    }
                    {!amountConfirmed && friendSelected && 
                         <CenteredFlex>
                         <Typography variant="h4"><b>You </b><ArrowForwardIcon/> <b> {selectedFriendData.name}</b></Typography>
    
                         <Typography variant="h5">You are going to pay:</Typography>
                         <HorizontalCenteredFlex>
                            <CurrencyRupeeIcon/>
                            <TextField
                           type="number"
                            inputRef={dueRef}
                           name="amount"
                           defaultValue={selectedFriendData.due}
                           required
                            />
                            
                         </HorizontalCenteredFlex>
                         <br/>
                         <button className="w-100" style={{marginBottom: 0}} onClick={handleConfirmAmount}>
                                <span>Confirm</span>
                            </button>
                       </CenteredFlex>
                    }{
                        amountConfirmed && link=="" && <Typography variant="h4">Awaiting confirmation...</Typography>
                    }{amountConfirmed && link!="" && <div>
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
                </div>}
                </Box>
            </Modal>
        </Container >
    );
};

export default SettleExpenseModal;