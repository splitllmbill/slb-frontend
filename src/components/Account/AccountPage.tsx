import { useState, useEffect } from 'react';
import { Container, Label, Input } from './AccountPage.styled'; // Import styled components
import dataService from '../../services/DataService';
import { IoLogOutOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';

import { RiUpload2Line } from 'react-icons/ri';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';
import VerificationModal from './VerificationModal/VerificationModal';
import FriendLink from '../Common/FriendLink';
import { Flex, Button } from '../../App.styled';
import QRModal from './QRModal/QRModal';

const UserPage = () => {
    const appTitle = import.meta.env.VITE_APP_TITLE;
    let navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobile: '',
        upiId: '',
        upiNumber: '',
        uuid: '',
        inviteCode: '',
        referralCount: 0,
        emailVerified: false,
        upiNumberVerified: false,
        mobileVerified: false
    });
    const [verificationFields, setverificationFields] = useState({
        mobileEdit: false,
        upiNumberEdit: false,
        type: ''
    })
    const [apiData, setApiData] = useState({
        mobile: '',
        upiNumber: '',
        refresh: false,
    })
    const [showLoader, setShowLoader] = useState(true);
    const [isPasswordModalOpen, setisPasswordModalOpen] = useState(false);
    const [isQRModalOpen, setisQRModalOpen] = useState(false);
    const [isVerificationModalOpen, setisVerificationModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dataService.getUserAccount();
                setUserData(data);
                setApiData({
                    ...apiData,
                    mobile: data.mobile,
                    upiNumber: data.upiNumber
                })
                setShowLoader(false);
            } catch (error) {
                console.log("Error occurred", error);
            }
        };
        fetchData();
    }, [apiData.refresh]);

    const validateUPI = (upiId: string): boolean => {
        const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;
        const valid = upiRegex.test(upiId)
        return valid;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if(validateUPI(userData.upiId)){
            try {
                const result = await dataService.updateUserAccount({
                    upiId: userData.upiId,
                    name: userData.name
                });
                if (result) {
                    alert('Updated successfully!')
                    setApiData({
                        ...apiData,
                        refresh: !apiData.refresh
                    })
                }
    
            } catch (error) {
                console.error("Error occurred while updating user account", error);
            }    
        }
        else
            alert('Invalid UPI Id');
    };

    const handleCopyToClipboard = (text: string, type: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Copied ' + type + ' to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                    fallbackCopyTextToClipboard(text,type);
                });
        } else {
            fallbackCopyTextToClipboard(text,type);
        }
    };
    
    function fallbackCopyTextToClipboard(text: string, type: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Copied ' + type + ' code to clipboard!');
        } catch (err) {
            console.error('Failed to copy ', err);
        }
        document.body.removeChild(textArea);
    }

    const handleLogout = async () => {
        try {
            const result = await dataService.logout();
            if (result) {
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            console.error("Error occurred while updating user account", error);
        }
    };

    const handleChangePassword = () => {
        setisPasswordModalOpen(true);
    }

    const handleCloseChangePassword = () => {
        setisPasswordModalOpen(false);
    }

    const handleCloseVerification = () => {
        setisVerificationModalOpen(false);
        setApiData({
            ...apiData,
            refresh: !apiData.refresh 
        })
    }

    const handleMobileEditClick = () => {
        if(!verificationFields.upiNumberEdit)
            setverificationFields({...verificationFields, mobileEdit: true});
    }

    const handleMobileSave = async () => {
        const valid = validateNumber(userData.mobile);
        if(!valid){
            alert('Invalid mobile number. Please try again.')
            return;
        }
        try {
            const result = await dataService.generateVerificationCode('mobile');
            if (result) {
                tempDisplayCode(result.mobileCode);
                setisVerificationModalOpen(true);
                setverificationFields({...verificationFields, mobileEdit: false, type: 'Mobile'});
            }

        } catch (error) {
            console.error("Error while generating verification code", error);
        }
    }

    const handleCloseMobileEdit = () => {
        setverificationFields({...verificationFields, mobileEdit: false});
        setUserData({...userData, mobile: apiData.mobile})
    }

    const handleDuplicateClick = () => {
        alert('2')
    }

    const handleUPINumberEditClick = () => {
        if(!verificationFields.mobileEdit)
            setverificationFields({...verificationFields, upiNumberEdit: true})
    }

    const handleUPINumberSave = async () => {
        const valid = validateNumber(userData.upiNumber);
        if(!valid){
            alert('Invalid UPI number. Please try again.')
            return;
        }
        try {
            const result = await dataService.generateVerificationCode('upiNumber');
            if (result) {
                tempDisplayCode(result.upiNumberCode);
                setisVerificationModalOpen(true);
                setverificationFields({...verificationFields, upiNumberEdit: false, type: 'UPI Number'})    
            }

        } catch (error) {
            console.error("Error while generating verification code", error);
        }
        
    }

    const handleCloseUPINumberEdit = () => {
        setverificationFields({...verificationFields, upiNumberEdit: false});
        setUserData({...userData, upiNumber: apiData.upiNumber})
    }
    
    const handleGenerateQR = () => {
        setisQRModalOpen(true);
    }

    const handleCloseQR = () => {
        setisQRModalOpen(false);
    }

    const validateNumber = (value : string) => {
        const mobileRegex = /^[0-9]{10}$/; // Regex for 10-digit numbers
        return mobileRegex.test(value);
      };
    
    const tempDisplayCode = (code: string) => {
        alert('Verification Code: ' + code);
    }

    return (
        !showLoader && (
            <Container>
                <Flex>
                    <button onClick={handleChangePassword}>Change Password <MdLockReset style={{ fontSize: 'x-large' }}></MdLockReset></button>
                    <button onClick={handleLogout}>Logout <IoLogOutOutline style={{ fontSize: 'x-large' }}></IoLogOutOutline></button>
                </Flex>
                <h2>Edit User Information</h2>
                <FriendLink friendCode={userData.uuid} dismissable={false} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Alert variant='primary' style={{ width: '67.5%' }} >
                        Share this unique invite code <a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => handleCopyToClipboard(userData.inviteCode, 'invite code')}>{userData.inviteCode} </a> to refer your friends and family and get exciting rewards in {appTitle}.
                    </Alert>
                    <Alert variant='success' style={{ width: '9.5%' , minWidth: '100px'}} >
                        Referrals: <b>{userData.referralCount}</b>
                    </Alert>
                </div>
                {isPasswordModalOpen && <ChangePasswordModal onClose={handleCloseChangePassword} forgotPassword={false} />}
                {isVerificationModalOpen && <VerificationModal handleClose={handleCloseVerification} type={verificationFields.type} userData={userData} />}
                {isQRModalOpen && <QRModal onClose={handleCloseQR} upiId={userData?.upiId}/>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label>Name:</Label>
                        <Input
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label>Email:</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            type="email"
                            style={{ 
                                marginRight: '10px' ,
                            }}
                            value={userData.email}
                            disabled
                        />
                        <Tooltip 
                            title={userData.emailVerified ? 'Verified' : 'Not Verified'}
                        >
                            <VerifiedUserOutlinedIcon
                                color={userData.emailVerified ? 'success' : 'error'}
                                style={{ width: 'auto', marginBottom: '10px' }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Label >Mobile:</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            style={{ 
                                marginRight: '10px' ,
                            }}
                            type="number"
                            value={userData.mobile}
                            disabled={!verificationFields.mobileEdit}
                            onChange={(e) => {
                                if(e.target.value.length <= 10)
                                    setUserData({ ...userData, mobile: e.target.value });
                            }}
                        />
                        {
                            !verificationFields.mobileEdit && 
                            <Tooltip title={"Edit mobile"}>
                                <IconButton 
                                    size="small" 
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleMobileEditClick}
                                >  
                                    <EditOutlinedIcon style={{ 
                                        color: verificationFields.upiNumberEdit ? 'grey' : 'black' 
                                    }}/>
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            verificationFields.mobileEdit && 
                            <Tooltip title="Save mobile">
                                <IconButton 
                                    size="small" 
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleMobileSave}
                                >
                                    <SaveOutlinedIcon style={{ color: 'black' }}/>
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            false && 
                            <Tooltip title="Copy mobile to UPI number">
                                <IconButton
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleDuplicateClick}
                                >
                                    <ContentCopyOutlinedIcon style={{ color: 'black' }} />
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            verificationFields.mobileEdit && 
                            <Tooltip title="Cancel">
                                <IconButton
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleCloseMobileEdit}
                                >
                                    <CloseOutlinedIcon style={{ color: 'black' }} />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip 
                            title={userData.mobileVerified ? 'Verified' : 'Not Verified'}
                        >
                            <VerifiedUserOutlinedIcon
                                color={userData.mobileVerified ? 'success' : 'error'}
                                style={{ width: 'auto', marginBottom: '10px' }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Label >UPI Number:</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            style={{ marginRight: '10px' }}
                            type="number"
                            value={userData.upiNumber}
                            disabled={!verificationFields.upiNumberEdit}
                            onChange={(e) => {
                                if(e.target.value.length <= 10)
                                    setUserData({ ...userData, upiNumber: e.target.value });
                            }}
                        />
                        {
                            !verificationFields.upiNumberEdit && 
                            <Tooltip title="Edit UPI number">
                                <IconButton 
                                    size="small" 
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleUPINumberEditClick}
                                >
                                    <EditOutlinedIcon style={{ 
                                        color: verificationFields.mobileEdit ? 'grey' : 'black' 
                                    }}/>
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            verificationFields.upiNumberEdit && 
                            <Tooltip title="Save UPI number">
                                <IconButton 
                                    size="small" 
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleUPINumberSave}
                                >
                                    <SaveOutlinedIcon style={{ color: 'black' }}/>
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            verificationFields.upiNumberEdit && 
                            <Tooltip title="Cancel">
                                <IconButton
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px' , marginRight: '10px' }}
                                    onClick={handleCloseUPINumberEdit}
                                >
                                    <CloseOutlinedIcon style={{ color: 'black' }} />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip 
                            title={userData.upiNumberVerified ? 'Verified' : 'Not Verified'}
                        >
                            <VerifiedUserOutlinedIcon
                                color={userData.upiNumberVerified ? 'success' : 'error'}
                                style={{ width: 'auto', marginBottom: '10px' }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Label>UPI ID:</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            style={{ marginRight: '10px' }}
                            type="text"
                            value={userData.upiId}
                            onChange={(e) => setUserData({ ...userData, upiId: e.target.value })}
                        />
                        <Tooltip title={validateUPI(userData.upiId) ? "View QR" : "Invalid UPI Id"}>
                            <span>
                                <IconButton
                                    disabled={!validateUPI(userData.upiId)}
                                    size="small"
                                    style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px', cursor: validateUPI(userData.upiId) ? 'auto' : 'not-allowed'  }}
                                    onClick={handleGenerateQR}
                                >
                                    <QrCode2OutlinedIcon style={{ color: validateUPI(userData.upiId) ? 'black' : 'grey' }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>
                    <br />
                    <Button type="submit" disabled={verificationFields.mobileEdit || verificationFields.upiNumberEdit}>Submit <RiUpload2Line style={{ fontSize: 'x-large' }} /></Button>
                </form>
            </Container>
        )
    );
};

export default UserPage;
