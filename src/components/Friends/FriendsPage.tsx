import { useState, useEffect } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { CircularProgress, List } from "@mui/material";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { FriendList } from "./FriendsPage.styled";
import { TbFaceIdError, TbUserCode } from "react-icons/tb";
import dataService from "../../services/DataService";
import AddFriend from "./AddFriend/AddFriend";
import FriendCard from "./FriendCard/FriendCard";
import { DashboardContainer, Flex, NoItemsWrapper } from "../../App.styled";

const FriendsPage = () => {
    const [friends, setFriends] = useState({
        "uuid": "",
        "overallYouOwe": "",
        "overallYouAreOwed": "",
        "friendsList": []
    });
    const [alertInfo, setAlertInfo] = useState({
        open: true,
        severity: 'light'
    });
    const [variant] = useState('light')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    const handleAddFriend = () => {
        setIsModalOpen(true);
    };

    const handleCloseAddFriend = () => {
        setIsModalOpen(false);
        fetchData();
    };

    const fetchData = async () => {
        try {
            const data = await dataService.getFriendsList();
            setFriends(data);
            setShowLoader(false);
        } catch (error) {
            console.log("Error occurred");
            setShowLoader(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleAlertToggle = () => {
        setAlertInfo({ ...alertInfo, open: !alertInfo.open });
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <DashboardContainer>
            <Flex>
                <button onClick={handleAddFriend}>Add Friend <AiOutlineUsergroupAdd style={{ fontSize: 'x-large' }} /></button>
                <button>Search <IoMdSearch style={{ fontSize: 'x-large' }} /></button>
                <Col sm={1}>
                    <TbUserCode onClick={handleAlertToggle} style={{ fontSize: 'x-large', marginTop: '15px' }} />
                </Col>
            </Flex>
            <br />
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {!showLoader && (
                <>
                    <Row>
                        {alertInfo.open && (
                            <Alert key={variant} variant={variant} style={{ width: '100%' }} dismissible>
                                Share this unique friend code <a href="#" onClick={() => handleCopyToClipboard(friends.uuid)}>{friends.uuid}</a> with friends who want to add you on SplitLLM!
                            </Alert>
                        )}
                    </Row>
                    {isModalOpen && <AddFriend onClose={handleCloseAddFriend} />}
                    <div>
                        {parseFloat(friends.overallYouOwe) !== 0.0 && (
                            <h4>Overall, you owe Rs.{friends.overallYouOwe}</h4>
                        )}

                        {parseFloat(friends.overallYouAreOwed) !== 0.0 && (
                            <h4>Overall, you are owed Rs.{friends.overallYouAreOwed}</h4>
                        )}
                    </div>
                    <FriendList>
                        {friends && friends?.friendsList.length == 0 && (
                            <NoItemsWrapper>
                                <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                                <h6>No friends yet!</h6>
                            </NoItemsWrapper>
                        )}
                        <List>
                            {friends.friendsList.map((friend, index) => (
                                <FriendCard key={index} friend={friend} />
                            ))}
                        </List>
                    </FriendList>
                </>
            )}
        </DashboardContainer>
    );
};

export default FriendsPage;
