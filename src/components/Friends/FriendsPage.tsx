import { useState, useEffect, Key } from "react";
import { Header, FriendList, FriendsContainer, Flex } from "./FriendsPage.styled";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import FriendCard from "./FriendCard/FriendCard";
import dataService from "../../services/DataService"; // Import your data service
import { Alert, Col, Row } from "react-bootstrap";
import { Box, Button, Input, List, Modal } from "@mui/material";
import { TbUserCode } from "react-icons/tb";
import AddFriend from "./AddFriend/AddFriend";


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
    const [variant, setVariant] = useState('light')
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFriend = () => {
        setIsModalOpen(true);
    };

    const handleCloseAddFriend = () => {
        setIsModalOpen(false);
    };

    const fetchData = () => {
        try {
            dataService.getFriendsList()
                .then(data => {
                    setFriends(data);
                    setLoadHeader(true);
                });
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

    const handleCopyToClipboard = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
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
            <Row>
                {alertInfo.open && (
                    <Alert key={variant} variant={variant} sx={{ width: '100%' }} dismissible>
                        Share this unique friend code <a href="#" onClick={() => handleCopyToClipboard(friends.uuid)}>{friends.uuid}</a> with friends who want to add you on SpliLLM!
                    </Alert>
                )}
            </Row>
            {isModalOpen && <AddFriend onClose={handleCloseAddFriend} />}

            {loadHeader && (<Header>
                {parseFloat(friends.overallYouOwe) !== 0.0 && (
                    <h3>Overall, you owe Rs.{friends.overallYouOwe}</h3>
                )}
                {parseFloat(friends.overallYouAreOwed) !== 0.0 && (
                    <h3>Overall, you are owed Rs.{friends.overallYouAreOwed}</h3>
                )}
                {/* <MdFilterList style={{ fontSize: 'x-large' }} /> */}
            </Header>)}
            <FriendList>
                <List>
                    {friends.friendsList.map((friend: { name: string, oweAmount: number, whoOwes: string }) => (
                        <FriendCard friend={friend} />
                    ))}
                </List>
            </FriendList>
        </FriendsContainer>
    );
};

export default FriendsPage;
