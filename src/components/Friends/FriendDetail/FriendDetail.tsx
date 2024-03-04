import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataService from '../../../services/DataService';
import { ButtonText, Flex, FriendDetailWrapper } from './FriendDetail.styled';
import { IoMdArrowBack } from "react-icons/io";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { Typography } from '@mui/material';
import ExpenseCardNew from '../../Expenses/ExpenseCardNew/ExpenseCardNew';

function FriendDetail() {
    const [friendData, setFriendData] = useState({
        "name": "",
        "overallOweAmount": "",
        "overallWhoOwes": "",
        "expenses": []
    });
    const [showData, setShowData] = useState(false);
    const { friendId } = useParams<{ friendId: string }>();

    useEffect(() => {
        if (friendId) { // Ensure friendId is not undefined
            dataService.getFriendDetails(friendId)
                .then((data) => {
                    setFriendData(data);
                    setShowData(true);
                })
                .catch(error => console.error('Error fetching friend data:', error));
        }
    }, [friendId]); // useEffect dependency

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(`/home`);
    };

    return (
        <FriendDetailWrapper>
            <Flex>
                <button onClick={handleGoBack}> 
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </button>
                <button>
                    Remove Friend <IoPersonRemoveOutline style={{ fontSize: 'x-large' }}></IoPersonRemoveOutline >
                </button>
            </Flex>
            <div>
                <h2>{friendData.name}</h2>
                {showData && (<Typography variant="h6">
                    Overall,
                    {friendData.overallWhoOwes === 'user' ? (
                        'you owe '
                    ) : (
                        ` ${friendData.name} owes you `
                    )}
                    ${friendData.overallOweAmount}
                </Typography>)}
                <br></br>
                {friendData.expenses && friendData.expenses.reverse().map((expense: { expenseDate: string, expenseName: string, expenseId: string, category: string, oweAmount: Float32Array, whoOwes: string }, index) => (
                    <ExpenseCardNew expense={expense} />
                ))}

            </div>
        </FriendDetailWrapper>
    );
}

export default FriendDetail;
