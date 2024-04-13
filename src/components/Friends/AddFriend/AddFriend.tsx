import { useState } from 'react';
import { Button, Container, Input } from '../../../App.styled';
import { Box, Modal } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import { Col, Row } from 'react-bootstrap';
import dataService from '../../../services/DataService';

interface AddFriendProps {
    onClose: () => void;
    friendId: string;
}

const AddFriend: React.FC<AddFriendProps> = ({ onClose, friendId }) => {
    const [friendCode, setFriendCode] = useState(friendId);
    const [loading, setLoading] = useState(false);
    const handleAddFriend = async () => {
        setLoading(true);
        try {
            await dataService.addFriend(friendCode).then((data) => {
                alert(data.message)
                onClose();
            })
        } catch (error) {
            console.log("Error in adding friend!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="add-friend-modal-title"
                aria-describedby="add-friend-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', minWidth: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1 }}>
                    <div>
                        <Row>
                            <Col xs={10}>
                                <h2 id="add-friend-modal-title">Add Friend</h2>
                            </Col>
                            <Col xs={2} className="d-flex justify-content-end">
                                <IoMdClose onClick={onClose} style={{ fontSize: 'x-large' }} />
                            </Col>
                        </Row>
                        <p id="add-friend-modal-description">Enter your friend's unique friend code</p>
                        <Row>
                            <Input
                                type="text"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value)}
                                placeholder="Friend Code"
                            />
                        </Row>
                        <Row>
                            <Button onClick={handleAddFriend} disabled={loading}>Add Friend</Button>
                        </Row>
                    </div>
                </Box>
            </Modal>
        </Container >
    );
};

export default AddFriend;