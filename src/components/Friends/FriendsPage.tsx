import { useState, useEffect, Key } from "react";
import { List } from "@mui/material";
import { Header, FriendList, FriendsContainer, Flex } from "./FriendsPage.styled";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import FriendCard from "./FriendCard/FriendCard";
import dataService from "../../services/DataService"; // Import your data service

const FriendsPage = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [loadHeader, setLoadHeader] = useState(false);
    const [friends, setFriends] = useState({
        "overallYouOwe": "",
        "overallYouAreOwed": "",
        "friendsList": []
    });

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
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
    }, []); // Empty dependency array means this effect runs only once, after the initial render

    return (
        <FriendsContainer>
            <Flex>
                <button>Add Friend <AiOutlineUsergroupAdd style={{ fontSize: 'x-large' }} /></button>
                <button>Search <IoMdSearch style={{ fontSize: 'x-large' }} /></button>
            </Flex>
            <br />
            {loadHeader && (<Header>
                {parseFloat(friends.overallYouOwe) !== 0.0 && (
                    <h3>Overall, you owe ${friends.overallYouOwe}</h3>
                )}
                {parseFloat(friends.overallYouAreOwed) !== 0.0 && (
                    <h3>Overall, you are owed {friends.overallYouAreOwed}</h3>
                )}
                <MdFilterList style={{ fontSize: 'x-large' }} />
            </Header>)}
            <FriendList>
                <List>
                    {friends.friendsList.map((friend: { name: string, oweAmount: number, whoOwes: string }) => (
                        <FriendCard friend={friend} />
                    ))}
                </List>
                {/* Add more friends here */}
            </FriendList>
        </FriendsContainer>
    );
};

export default FriendsPage;
