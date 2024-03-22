import React, { useState, useEffect } from 'react';
import { Container, Label, Input, Button, Flex } from './AccountPage.styled'; // Import styled components
import dataService from '../../services/DataService';
import { IoLogOutOutline } from "react-icons/io5";
import { MdLockReset, MdOutlineDelete, MdOutlinePlaylistAdd } from "react-icons/md";
import { RiUpload2Line } from 'react-icons/ri';
import { IoMdArrowBack } from 'react-icons/io';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        upiId: '',
        upiNumber: ''
    });
    const [showLoader, setShowLoader] = useState(true);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await dataService.updateUserAccount(userData);
            if(result){
                alert('Updated successfully!')
            }

        } catch (error) {
            console.error("Error occurred while updating user account", error);
        }
    };



    const isMobile = window.innerWidth <= 500;

    return (
        !showLoader && (
            <Container>
                <Flex>
                    <button >Change Password <MdLockReset style={{ fontSize: 'x-large' }}></MdLockReset></button><button >Logout <IoLogOutOutline style={{ fontSize: 'x-large' }}></IoLogOutOutline ></button>
                </Flex>
                <h2>Edit User Information</h2>
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
