import { FC, useState } from 'react';
import { FriendCardWrapper, MarginLeft } from './FriendCard.styled.ts';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import { Col, Row } from 'react-bootstrap';
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';


interface FriendCardProps {
    friend: any; // Adjust the type as per your EventObject structure
}

const FriendCard: FC<FriendCardProps> = ({ friend }) => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/friend/${friend.id}`);
    };

    return (
        <FriendCardWrapper onClick={handleClick}>
            <Card>
                <CardContent>
                    <Row>
                        <Col xs={2} md={2} className=" d-sm-block  justify-content-center align-items-center">
                            <RxAvatar style={{ fontSize: '50px' }}></RxAvatar>
                        </Col>
                        <Col className="d-flex ">
                            <MarginLeft className="text-left"> {/* Add text-left class for left alignment inside the div */}
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {toTitleCase(friend.name)}
                                </Typography>
                            </MarginLeft>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Typography variant="p" color="#785A53" sx={{ fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'right' }}>
                                {friend.whoOwes === 'You' ? (
                                    <div> You owe</div>
                                ) : (
                                    <div>{friend.name} owes</div>
                                )}
                                <div>${friend.oweAmount}</div>
                            </Typography>
                        </Col>
                    </Row>
                </CardContent>
            </Card>
        </FriendCardWrapper>
    );
};

export default FriendCard;
