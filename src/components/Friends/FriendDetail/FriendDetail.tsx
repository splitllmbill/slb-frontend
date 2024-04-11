import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataService from '../../../services/DataService';
import { FriendDetailWrapper } from './FriendDetail.styled';
import { IoMdArrowBack } from "react-icons/io";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { CircularProgress, List, Pagination, Typography } from '@mui/material';
import ExpenseCardNew from '../../Expenses/ExpenseCardNew/ExpenseCardNew';
import { Row, Col } from 'react-bootstrap';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import SettleExpenseModal from '../../Expenses/SettleExpenseModal/SettleExpenseModal';

function FriendDetail() {
    const [friendData, setFriendData] = useState({
        "uuid": "",
        "name": "",
        "overallOweAmount": 0,
        "overallWhoOwes": "",
        "expenses": [{
            "expenseId":""
        }]
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refetchData, setRefetchData] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const { friendId } = useParams<{ friendId: string }>();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const submitSettleUp = async () => {
        setIsModalOpen(false);
        if (friendId !== undefined) {
            try {
                await dataService.settleUpWithFriend(friendId).then((data) => {
                    alert(data.message);
                    setRefetchData(!refetchData);
                });
            } catch (error) {
                const errMsg = "Error while settling dues. Please try again later";
                console.error(errMsg, error);
                alert(errMsg);
            }
        }
    };

    useEffect(() => {
        if (friendId) {
            dataService.getFriendDetails(friendId)
                .then((data) => {
                    setFriendData(data);
                    setShowLoader(false);
                })
                .catch(error => console.error('Error fetching friend data:', error));
        }
    }, [refetchData, friendId]); // useEffect dependency

    const handleCreateExpense = () => {
        navigate(`/createExpense/friend/${friendId}`);
    };

    const handleRemoveFriend = async () => {
        await dataService.deleteFriend(friendData.uuid).then((data) => {
            alert(data.message);
            if (data.success === true)
                navigate(-1);
        });
    };

    const isMobile = window.innerWidth <= 500;

    // Calculate start and end indexes for the current page
    const indexOfLastExpense = currentPage * itemsPerPage;
    const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
    const currentExpenses = friendData.expenses.slice(indexOfFirstExpense, indexOfLastExpense);

    return (
        <FriendDetailWrapper>
            {isModalOpen && <SettleExpenseModal onClose={closeModal} friendSettleUp={submitSettleUp}  friendData={[{
                id:friendId!,
                name: friendData.name,
                due: friendData.overallOweAmount 
            }]}
            settleType='friend'
            />}
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
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {!showLoader && (
                <div>
                    <h2>{friendData.name}</h2>
                    <Row className="align-items-center">
                        <Col xs={6} md={9} className="d-flex align-items-center">
                            {(<Typography variant="h6">
                                Overall,
                                {friendData.overallWhoOwes === 'user' ? (
                                    'you owe '
                                ) : (
                                    ` ${friendData.name} owes you `
                                )}
                                Rs.{friendData.overallOweAmount}
                            </Typography>)}
                        </Col>
                        {(friendData.overallWhoOwes === 'user' && friendData.overallOweAmount !== 0) &&
                            <Col xs={6} md={3} className="d-flex align-items-center">
                                <Row className="align-items-center">
                                    <div> You have dues...
                                        <button className="w-100" onClick={()=>setIsModalOpen(true)}>
                                            <span>Settle Up!</span>
                                        </button>
                                    </div>
                                </Row>
                            </Col>}
                    </Row>
                    <br></br>
                    <List>
                        {currentExpenses.map((expense) => (
                            <div key={expense.expenseId}>
                                <ExpenseCardNew expense={expense} />
                            </div>
                        ))}
                    </List>
                    <Pagination count={Math.ceil(friendData.expenses.length / itemsPerPage)} page={currentPage} onChange={handleChangePage} />
                </div>
            )}
        </FriendDetailWrapper>
    );
}

export default FriendDetail;
