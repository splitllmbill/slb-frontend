import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Row , Col } from "react-bootstrap";
import { CircularProgress, List } from "@mui/material";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { Flex, FriendList } from "./FriendsPage.styled";
import { TbFaceIdError } from "react-icons/tb";
import TextField from '@mui/material/TextField';
import dataService from "../../services/DataService";
import AddFriend from "./AddFriend/AddFriend";
import FriendCard from "./FriendCard/FriendCard";
import FriendLink from "../Common/FriendLink";
import { DashboardContainer, NoItemsWrapper } from "../../App.styled";

const FriendsPage = () => {
    const { friendId } = useParams();
    const navigate = useNavigate();
    const [friends, setFriends] = useState({
        "uuid": "",
        "overallYouOwe": "",
        "overallYouAreOwed": "",
        "friendsList": []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [enableSearch, setEnableSearch] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [friendsList, setFriendsList] = useState([]);

    const handleAddFriend = () => {
        setIsModalOpen(true);
    };

    const handleCloseAddFriend = () => {
        setIsModalOpen(false);
        if(location.pathname.startsWith('/add-friend')){
            navigate('/friends');
        }
        else {
            setShowLoader(true);
            fetchData();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value as string;
        setSearchInput(inputValue);
        const filteredArray = friends.friendsList.filter(item => {
            const name = item['name'] as string;
            const email = item['email'] as string;
            return name.toLowerCase().includes(inputValue.toLowerCase()) || email.toLowerCase().includes(inputValue.toLowerCase());
        });
        setFriendsList(filteredArray);
    };

    const handleSearch = () => {
        if(!enableSearch)
            setEnableSearch(true);
        else {
            setSearchInput('');
            setFriendsList(friends.friendsList);
            setEnableSearch(false);
        }
    }

    const fetchData = async () => {
        try {
            const data = await dataService.getFriendsList();
            setFriends(data);
            setFriendsList(data.friendsList)
            setShowLoader(false);
        } catch (error) {
            console.log("Error occurred");
            setShowLoader(false);
        }
    }

    useEffect(() => {
        fetchData();
        if(friendId)
            setIsModalOpen(true);
    }, []);
    
    return (
        <DashboardContainer>
            <Row>
                <Col xs={12} md={6}>
                    <button onClick={handleAddFriend}>Add Friend <AiOutlineUsergroupAdd style={{ fontSize: 'x-large' }} /></button>
                </Col>
                { !showLoader && 
                    <Col xs={12} md={6}>
                        <Flex style={{ justifyContent: 'flex-end' }}>
                            {
                                enableSearch && 
                                <TextField 
                                    id="standard-basic" 
                                    label="Search" 
                                    placeholder="Name or Email"
                                    variant="standard" 
                                    value={searchInput} 
                                    onChange={handleInputChange} 
                                />
                            }
                            <IoMdSearch onClick={handleSearch} style={{ fontSize: 'xx-large', marginTop: '15px' }} />
                        </Flex>
                    </Col> 
                }
            </Row>
            <br />
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {!showLoader && (
                <>
                    <Row>
                        <FriendLink friendCode={friends.uuid}/>
                    </Row>
                    {isModalOpen && <AddFriend friendId={ friendId || '' } onClose={handleCloseAddFriend} />}
                    <div>
                        {parseFloat(friends.overallYouOwe) !== 0.0 && (
                            <h4>Overall, you owe Rs. {parseFloat(friends.overallYouOwe).toFixed(2)}</h4>
                        )}

                        {parseFloat(friends.overallYouAreOwed) !== 0.0 && (
                            <h4>Overall, you are owed Rs. {parseFloat(friends.overallYouAreOwed).toFixed(2)}</h4>
                        )}
                    </div>
                    <FriendList>
                        {friendsList && friendsList.length == 0 && (
                            <NoItemsWrapper>
                                <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                                <h6>No friends yet!</h6>
                            </NoItemsWrapper>
                        )}
                        <List>
                            {friendsList.map((friend, index) => (
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
