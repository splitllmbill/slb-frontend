import { Avatar, List } from "@mui/material";
import { useState } from "react";
import { Header, FriendList, Friend, FriendDetails, FriendsContainer, Flex } from "./FriendsPage.styled";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import FriendCard from "./FriendCard/FriendCard";



const FriendsPage = () => {
    const [searchVisible, setSearchVisible] = useState(false);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const addFriend = () => {
        // Implement add friend functionality
    };

    const friends = [
        {
            name: 'Friend 1',
            totalIOwe: 100,
            totalTheyOwe: 50,
            overallWhoOwes: 'Me',
            overallOweAmount: 50
        },
        {
            name: 'Friend 2',
            totalIOwe: 150,
            totalTheyOwe: 75,
            overallWhoOwes: 'Friend',
            overallOweAmount: 75
        },
        // Add more friends as needed
    ];

    return (
        <FriendsContainer>
            <Flex>
                <button>Add Friend<AiOutlineUsergroupAdd style={{ fontSize: 'x-large' }}></AiOutlineUsergroupAdd></button><button >Logout <IoMdSearch style={{ fontSize: 'x-large' }}></IoMdSearch ></button>
            </Flex>
            <br></br>
            <Header>
                <h3>Overall, you owe ___</h3><MdFilterList style={{ fontSize: 'x-large' }}></MdFilterList>
            </Header>
            <FriendList>
                <List>
                    {friends.map((friend) => (
                        <FriendCard friend={friend}></FriendCard>
                    ))}
                </List>
                {/* Add more friends here */}
            </FriendList>
        </FriendsContainer>
    );
};

export default FriendsPage;