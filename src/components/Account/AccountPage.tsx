import React, { useState, useEffect } from 'react';
import { Container, Label, Input, Button } from './AccountPage.styled'; // Import styled components
import dataService from '../../services/DataService';

const UserPage = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        token: '',
        createdAt: '',
        updatedAt: '',
        account: {
            userId: '',
            upiId: '',
            upiNumber: '',
            createdAt: '',
            updatedAt: ''
        }
    });

    const fetchData = () => {
        dataService.getUserByID()
            .then(data => {
                console.log(data);

            });
    }
    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.log("Error occurred");
        }
    }, []);


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form submitted");
        // Implement logic to handle form submission
    };

    return (
        <Container>
            <h2>User Information</h2>
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
                    <Label>Phone Number:</Label>
                    <Input
                        type="tel"
                        value={userData.phoneNumber}
                        onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                    />
                </div>
                <div>
                    <Label>Password:</Label>
                    <Input
                        type="password"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        required
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
                <Button type="submit">Submit</Button>
            </form>
        </Container>
    );
};

export default UserPage;
