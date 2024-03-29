import { useState, useEffect } from 'react';
import { Container, Label, Input, Button, Flex } from './AccountPage.styled'; // Import styled components
import dataService from '../../services/DataService';
import { IoLogOutOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import { RiUpload2Line } from 'react-icons/ri';
import { Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';

const UserPage = () => {
    let navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        upiId: '',
        upiNumber: '',
        uuid: ''
    });
    const [showLoader, setShowLoader] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dataService.getUserAccount();
                setUserData(data);
                setShowLoader(false);
            } catch (error) {
                console.log("Error occurred", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const result = await dataService.updateUserAccount(userData);
            if (result) {
                alert('Updated successfully!')
            }

        } catch (error) {
            console.error("Error occurred while updating user account", error);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

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
        setIsModalOpen(true);
    }

    const handleCloseChangePassword = () => {
        setIsModalOpen(false);
    }

    return (
        !showLoader && (
            <Container>
                <Flex>
                    <button onClick={handleChangePassword}>Change Password <MdLockReset style={{ fontSize: 'x-large' }}></MdLockReset></button>
                    <button onClick={handleLogout}>Logout <IoLogOutOutline style={{ fontSize: 'x-large' }}></IoLogOutOutline></button>
                </Flex>
                <h2>Edit User Information</h2>
                <Row>
                    <Alert key='light' variant='light' style={{ width: '100%' }} >
                        Share this unique friend code <a href="#" onClick={() => handleCopyToClipboard(userData.uuid)}>{userData.uuid}</a> with friends who want to add you on SplitLLM!
                    </Alert>
                </Row>
                {isModalOpen && <ChangePasswordModal onClose={handleCloseChangePassword} forgotPassword={false} />}
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
                        <Input
                            type="email"
                            value={userData.email}
                            disabled
                        />
                    </div>
                    <div>
                        <Label>UPI ID:</Label>
                        <Input
                            type="text"
                            value={userData.upiId}
                            onChange={(e) => setUserData({ ...userData, upiId: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>UPI Number:</Label>
                        <Input
                            type="text"
                            value={userData.upiNumber}
                            onChange={(e) => setUserData({ ...userData, upiNumber: e.target.value })}
                        />
                    </div>
                    <br />
                    <Button type="submit">Submit <RiUpload2Line style={{ fontSize: 'x-large' }} /></Button>
                </form>
            </Container>
        )
    );
};

export default UserPage;
