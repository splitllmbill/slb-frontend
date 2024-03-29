import { useState, useEffect } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { List } from "@mui/material";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { FriendsContainer, Flex, Header, FriendList } from "./FriendsPage.styled";
import { TbUserCode } from "react-icons/tb";
import dataService from "../../services/DataService";
import AddFriend from "./AddFriend/AddFriend";
import FriendCard from "./FriendCard/FriendCard";

const FriendsPage = () => {
    const [loadHeader, setLoadHeader] = useState(false);
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
            setLoadHeader(true);
        } catch (error) {
            console.log("Error occurred");
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
        <FriendsContainer>
            <Flex>
                <button onClick={handleAddFriend}>Add Friend <AiOutlineUsergroupAdd style={{ fontSize: 'x-large' }} /></button>
                <button>Search <IoMdSearch style={{ fontSize: 'x-large' }} /></button>
                <Col sm={1}>
                    <TbUserCode onClick={handleAlertToggle} style={{ fontSize: 'x-large', marginTop: '15px' }} />
                </Col>
            </Flex>
            <br />

            {loadHeader && (
                <>
                    <Row>
                        {alertInfo.open && (
                            <Alert key={variant} variant={variant} style={{ width: '100%' }} dismissible>
                                Share this unique friend code <a href="#" onClick={() => handleCopyToClipboard(friends.uuid)}>{friends.uuid}</a> with friends who want to add you on SplitLLM!
                            </Alert>
                        )}
                    </Row>
                    {isModalOpen && <AddFriend onClose={handleCloseAddFriend} />}
                    <Header>
                        {parseFloat(friends.overallYouOwe) !== 0.0 && (
                            <h3>Overall, you owe Rs.{friends.overallYouOwe}</h3>
                        )}
                        {parseFloat(friends.overallYouAreOwed) !== 0.0 && (
                            <h3>Overall, you are owed Rs.{friends.overallYouAreOwed}</h3>
                        )}
                        {/* <MdFilterList style={{ fontSize: 'x-large' }} /> */}
                    </Header>
                    <FriendList>
                        <List>
                            {friends.friendsList.map((friend, index) => (
                                <FriendCard key={index} friend={friend} />
                            ))}
                        </List>
                    </FriendList>
                </>
            )}
        </FriendsContainer>
    );
};

export default FriendsPage;
