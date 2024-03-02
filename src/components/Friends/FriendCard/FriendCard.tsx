import { FC } from 'react';
import { FriendCardWrapper } from './FriendCard.styled.ts';
import { Card, CardContent, Typography } from '@mui/material';
import { toTitleCase } from '../../../services/State';
import { Col, Row } from 'react-bootstrap';
import group from '../../../assets/group.png';
import { RxAvatar } from "react-icons/rx";


interface FriendCardProps {
    friend: any; // Adjust the type as per your EventObject structure
}

const FriendCard: FC<FriendCardProps> = ({ friend }) => {

    return (
        <FriendCardWrapper>
            <Card>
                <CardContent>
                    <Row>
                        <Col xs={2} ms={1} className="d-none d-sm-block  justify-content-center align-items-center">
                            <RxAvatar style={{ fontSize: '50px' }}></RxAvatar>
                        </Col>
                        <Col className="d-flex ">
                            <div className="text-left"> {/* Add text-left class for left alignment inside the div */}
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {toTitleCase(friend.name)}
                                </Typography>
                                <ul>
                                    <li>
                                        {friend.totalTheyOwe > 0 && (
                                            <>
                                                <Typography variant="p" color="text.secondary">
                                                    {friend.name} owes you {friend && friend.totalTheyOwe}
                                                </Typography>
                                            </>
                                        )}
                                    </li>
                                    <li>
                                        {friend.totalIOwe > 0 && (
                                            <>
                                                <Typography variant="p" color="text.secondary" >
                                                    You owe {friend.name} {friend && friend.totalIOwe}
                                                </Typography>
                                            </>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Typography variant="p" color="#785A53" sx={{ fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'right' }}>
                                {friend.overallWhoOwes === 'Me' ? (
                                    <div> You owe</div>
                                ) : (
                                    <div>{friend.name} owes</div>
                                )}
                                <div>${friend.overallOweAmount}</div>
                            </Typography>
                        </Col>
                    </Row>
                </CardContent>
            </Card>
        </FriendCardWrapper>
    );
};

export default FriendCard;
