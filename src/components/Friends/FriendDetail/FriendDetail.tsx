import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataService from '../../../services/DataService';
import { FriendDetailWrapper } from './FriendDetail.styled';
import { IoMdArrowBack } from "react-icons/io";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { Typography } from '@mui/material';
import ExpenseCardNew from '../../Expenses/ExpenseCardNew/ExpenseCardNew';
import { Row, Col } from 'react-bootstrap';
import { MdOutlinePlaylistAdd } from 'react-icons/md';

function FriendDetail() {
    const [friendData, setFriendData] = useState({
        "uuid": "",
        "name": "",
        "overallOweAmount": 0,
        "overallWhoOwes": "",
        "expenses": []
    });
    const [showData, setShowData] = useState(false);
    const { friendId } = useParams<{ friendId: string }>();

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    const handleSettleUpFriend =async()=>{
        if(friendId!=undefined){
            await dataService.settleUpWithFriend(friendId).then((data) => {
                alert(data.message)
            })
        }
    }

    useEffect(() => {
        if (friendId) { // Ensure friendId is not undefined
            dataService.getFriendDetails(friendId)
                .then((data) => {
                    setFriendData(data);
                    setShowData(true);
                })
                .catch(error => console.error('Error fetching friend data:', error));
        }
    }, [handleSettleUpFriend]); // useEffect dependency

    const handleCreateExpense = () => {
        navigate(`/createExpense/friend/${friendId}`);
    };

    const handleRemoveFriend = async () => {
        await dataService.deleteFriend(friendData.uuid).then((data) => {
            alert(data.message)
            if(data.success == true)
                navigate(-1)
        })
    }

    
   
    const isMobile = window.innerWidth <= 500;

    return (
        <FriendDetailWrapper>
            <Row>
                <Col xs={3} md={3}>
                    <button onClick={handleGoBack} className="w-100">
                        <IoMdArrowBack style={{ fontSize: 'x-large' }} />
                        {!isMobile && (<span> Go Back</span>)}
                    </button>
                </Col>
                <Col xs={3} md={3}></Col>
                <Col xs={3} md={3}>
                    <button className="w-100" onClick={handleCreateExpense}>
                        <MdOutlinePlaylistAdd style={{ fontSize: 'x-large' }} />
                        {!isMobile && (<span> Add Expense</span>)}
                    </button>
                </Col>
                <Col xs={3} md={3}>
                    <button onClick={handleRemoveFriend} className="w-100">
                        <IoPersonRemoveOutline style={{ fontSize: 'x-large' }} />
                        {!isMobile && (<span> Unfriend</span>)}
                    </button>
                </Col>
            </Row>
            <div>
                <h2>{friendData.name}</h2>
                <Row className="align-items-center">
                    <Col xs={6} md={9} className="d-flex align-items-center">
                        {showData && (<Typography variant="h6">
                            Overall,
                            {friendData.overallWhoOwes === 'user' ? (
                                'you owe '
                            ) : (
                                ` ${friendData.name} owes you `
                            )}
                            Rs.{friendData.overallOweAmount}
                        </Typography>)}
                    </Col>
                    { (friendData.overallWhoOwes === 'user'  && friendData.overallOweAmount!=0) &&
            <Col xs={6} md={3} className="d-flex align-items-center">
              <Row className="align-items-center">
                <div> You have unsetlled dues...
                    <button className="w-100" onClick={handleSettleUpFriend}>
                        <span>Settle Up!</span>
                    </button>
                </div>
              </Row>
            </Col>}
                </Row>
                <br></br>
                {friendData.expenses && friendData.expenses.reverse().map( (expense) => {
                    return (
                    <ExpenseCardNew expense={expense} />
                )})}

            </div>
        </FriendDetailWrapper>
    );
}

export default FriendDetail;
