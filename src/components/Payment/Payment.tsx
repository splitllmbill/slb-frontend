import { useEffect, useState } from 'react';
import { Flex } from '../../App.styled';
import QRCode from 'react-qr-code';
import { CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import dataService from '../../services/DataService';
import { BaseContainer } from './Payment.styled';

interface UPIDetails {
    upiId: string;
    upiLink: string;
    amount: number;
    note: string;
    expiryAt: string;
    userName: string;
}

const Payment = () => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    const [showQR, setshowQR] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [upiData, setUpiData] = useState<UPIDetails | null>(null);

    const convertUTCToLocalTime = (utcTime: string): string => {
        const localTime = new Date(utcTime);
        return localTime.toLocaleString(); // Converts UTC to local time
    };

    function formatDateString(inputDate: string): string {
        const dateObj = new Date(inputDate);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric' as const, 
            month: 'long' as const, 
            day: '2-digit' as const,
            hour: 'numeric' as const,
            minute: 'numeric' as const,
            second: 'numeric' as const,
            hour12: true
        };
        return dateObj.toLocaleString('en-US', options);
    }
    
    const calculateRemainingHours = (expiryTime: string): number => {
        const expiryDate = new Date(expiryTime);
        const currentTime = new Date();
        const timeDifference = expiryDate.getTime() - currentTime.getTime();
        const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
        return hoursDifference;
    };

    const getPageDetails = async (id: string) => {
        setShowLoader(true);
        try {
            const data = await dataService.getUPIPage(id);
            setUpiData({...data, expiryAt: convertUTCToLocalTime(data.expiryAt)});
            setShowLoader(false);
        } catch (error) {
            console.log("Error occurred", error);
        }
    };

    useEffect(() => {
        const id = location.pathname.replace('/payments/','')
        if(id.length == 256){
            getPageDetails(id);
        }
    }, [location.pathname]);

    return showLoader ? (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>) :
        <BaseContainer >
            <Flex style={{ marginBottom: '-5px' }}>
                <Typography variant="h4">{appTitle} Payment Handler</Typography>
                <Tooltip title={showQR ? "Hide QR" : "View QR"}>
                    <IconButton
                        size="small"
                        style={{ width: 'auto', height: 'auto' }}
                        onClick={() => setshowQR(!showQR)}
                    >
                        <QrCode2OutlinedIcon style={{ color: 'black' }} />
                    </IconButton>
                </Tooltip>
            </Flex>
            <Typography variant="body2" color="textSecondary">Note: Links work only on mobile. For other devices use QR</Typography>
            <Typography variant="h6">You are paying an amount of Rs. {upiData?.amount} for {upiData?.note} to {upiData?.userName}. </Typography>

            {
                !showQR &&
                <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">Google Pay</Typography>
                        <IconButton href={'tez://' + upiData?.upiLink} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                            <VerifiedUserOutlinedIcon
                                color={'success'}
                            />
                        </IconButton>

                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">PhonePe</Typography>
                        <IconButton href={'phonepe://' + upiData?.upiLink} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                            <VerifiedUserOutlinedIcon
                                color={'success'}
                            />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography variant="body1">Others</Typography>
                        <IconButton href={'upi://' + upiData?.upiLink} aria-label="launch" color="primary" style={{ width: 'auto' }}>
                            <VerifiedUserOutlinedIcon
                                color={'success'}
                            />
                        </IconButton>
                    </div>
                </>
            }
            {
                showQR &&
                <Flex style={{ marginTop: '10px', marginBottom: '20px' }}>
                    <QRCode
                        value={'upi://' + upiData?.upiLink}
                        size={350}
                    />
                </Flex>
            }
            <Typography variant="body1">If none of the above methods are working then please try with: </Typography>
            <Typography variant="body1"><b>UPI Id - </b>{upiData?.upiId}</Typography>
            <Typography variant="body2" color="textSecondary">
                This link expires on {formatDateString(upiData?.expiryAt as string)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {calculateRemainingHours(upiData?.expiryAt as string).toString()} hours left.
            </Typography>
        </BaseContainer>
};

export default Payment;