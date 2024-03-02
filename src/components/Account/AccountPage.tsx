import React, { useState, useEffect } from 'react';
import { Container, Label, Input, Button, Flex } from './AccountPage.styled'; // Import styled components
import dataService from '../../services/DataService';
import { IoLogOutOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import { RiUpload2Line } from "react-icons/ri";

const UserPage = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        account: {
            upiId: '',
            upiNumber: ''
        }
    });

    const fetchData = async () => {
        const userData = await dataService.getUserByID();
        setUserData(userData);
        if (userData && userData.account) {
            const accountData = await dataService.getUserAccount();
            setUserData(prevUserData => ({
                ...prevUserData,
                account: accountData
            }));
        } else {
            console.log("User data or account ID is missing.");
        }
    }
    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.log("Error occurred");
        }
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        await dataService.updateAccount(userData.account);
        await dataService.updateUser(userData);
    };

    return (
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
                        value={userData.account.upiId}
                        onChange={(e) => setUserData({ ...userData, account: { ...userData.account, upiId: e.target.value } })}
                    />
                </div>
                <div>
                    <Label>UPI Number:</Label>
                    <Input
                        type="text"
                        value={userData.account.upiNumber}
                        onChange={(e) => setUserData({ ...userData, account: { ...userData.account, upiNumber: e.target.value } })}
                    />
                </div>
                <Button >Submit <RiUpload2Line style={{ fontSize: 'x-large' }}></RiUpload2Line></Button>
            </form>
        </Container>
    );
};

export default UserPage;
