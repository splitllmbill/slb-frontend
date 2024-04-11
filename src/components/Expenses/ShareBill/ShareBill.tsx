import { ChangeEvent, SetStateAction, useRef, useState } from 'react';
import { DashboardContainer, Flex, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import { Row, Col, Button } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { Autocomplete, CardContent, Card, CircularProgress, TextField, Typography, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsDot } from "react-icons/bs";
import { IoMdArrowBack } from 'react-icons/io';
import { formatDate, formatDateForTransactions, toTitleCase } from '../../../services/State';

const ShareBill = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [showTable, setShowTable] = useState<boolean>(false);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [ocrOutput, setOcrOutput] = useState({
        items: [{ amount: 0, item_name: "", quantity: 1, slno: 1, total_amount: 0 }],
        tax: [{ amount: 0, percent: 0, type: "" }]
    });
    const [payer, setPayer] = useState<any>(null);
    const [sharedByUsers, setSharedByUsers] = useState<any[]>([]);
    const [showShares, setShowShares] = useState<boolean>(false);
    const [expenseToCreate, setExpenseToCreate] = useState<Expense>({
        expenseName: "", // Provide a name for the expense if necessary
        amount: 0,
        type: "",
        paidBy: "",
        shares: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "",
        updatedBy: "",
        category: "",
        date: ""
    });
    const location = useLocation();
    const users: User[] = location.state?.users || [];
    const type: string = location.state?.type;
    const id: string = location.state?.id;
    const [expenseName, setExpenseName] = useState('');
    const userSharesMap = useRef<{ [key: string]: Share }>({});

    const handleExpenseNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setExpenseName(event.target.value);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setShowLoader(true);
            setShowTable(false);
            try {
                const data = await dataService.fileUpload(selectedFile);
                setShowLoader(false);
                setOcrOutput(data.ocroutput);
                setShowTable(true);
            } catch (error) {
                console.error('Error uploading file:', error);
                setShowLoader(false);
            }
        } else {
            alert("Invalid file!");
        }
    };

    const handleSharedByChange = (index: number, newValue: any[]) => {
        setSharedByUsers(prevSharedByUsers => {
            const updatedSharedByUsers = [...prevSharedByUsers];
            updatedSharedByUsers[index] = newValue;
            return updatedSharedByUsers;
        });
    };

    const calculateShares = () => {
        userSharesMap.current = {};
        if (type && id && payer) {
            let totalAmount = ocrOutput.items.reduce((total, item) => total + item.total_amount, 0);
            totalAmount += ocrOutput.tax.reduce((total, item) => total + item.amount, 0);

            if (sharedByUsers.length !== ocrOutput.items.length || !type || !payer) {
                alert("Please fill all required fields!");
            } else {
                ocrOutput.items.forEach((item, index) => {
                    if (sharedByUsers[index] && sharedByUsers[index].length > 0) {
                        const itemShareAmount = item.total_amount / sharedByUsers[index].length;

                        sharedByUsers[index].forEach((user: { id: any, name: string }) => {
                            const { id: userId } = user;
                            if (!userSharesMap.current[userId]) {
                                userSharesMap.current[userId] = {
                                    amount: itemShareAmount,
                                    name: user.name,
                                    userId
                                };
                            } else {
                                userSharesMap.current[userId].amount += itemShareAmount;
                            }
                        });
                    }
                });

                ocrOutput.tax.forEach((item) => {
                    const itemShareAmount = item.amount / users.length;
                    users.forEach((user: any) => {
                        const { id: userId } = user;
                        if (!userSharesMap.current[userId]) {
                            userSharesMap.current[userId] = {
                                amount: itemShareAmount,
                                name: user.name,
                                userId
                            };
                        } else {
                            userSharesMap.current[userId].amount += itemShareAmount;
                        }
                    });
                });

                const expense: Expense = {
                    expenseName,
                    amount: totalAmount,
                    type,
                    paidBy: payer.id,
                    shares: Object.values(userSharesMap.current).map(({ userId, amount }) => ({
                        userId,
                        amount
                    })),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: "",
                    updatedBy: "",
                    category: "Bill",
                    date: new Date().toISOString().slice(0, 10)
                };

                if (type === 'group' && id) {
                    expense.eventId = id;
                }
                console.log(userSharesMap);

                console.log(expense);
                if (expense) {
                    setExpenseToCreate(expense);
                    setShowShares(true);
                }
            }
        } else {
            alert("Please fill all required fields!");
        }
    };

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddExpense = async () => {
        try {
            const result = await dataService.createExpense(expenseToCreate as unknown as Expense);
            if (result) {
                navigate(`/expense/${result.id}`)
            }
        } catch (error) {
            console.error('Unexpected error event creation:', error);
        }
    }

    return (
        <DashboardContainer>
            <Flex>
                <button onClick={handleGoBack}>
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </button>
            </Flex>
            <h2>Share a bill</h2>
            <p>Upload receipts, split expenses, and track shared costs effortlessly!</p>
            <br />
            <Row className="align-items-center">
                <Col xs={12} md={6}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Col>
                {window.innerWidth <= 650 && (<><br /><br /></>)}
                <Col xs={12} md={6}>
                    <Button variant="secondary" onClick={handleUpload}>Upload</Button>
                </Col>
            </Row>
            <br />
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {
                showTable && (
                    <>
                        <p><b>Help us with some details! </b></p>
                        <Flex>
                            <BsDot style={{ fontSize: 'xx-large', marginTop: '15px' }}></BsDot>
                            <TextField style={{ width: '200px' }}
                                required
                                id="standard-basic"
                                label="Expense Name"
                                variant="standard"
                                value={expenseName} // Assign the value of the input field
                                onChange={handleExpenseNameChange} // Call the handleExpenseNameChange function on input change
                            />
                        </Flex>
                        <Flex>
                            <BsDot style={{ fontSize: 'xx-large', marginTop: '15px' }}></BsDot>
                            <Autocomplete style={{ width: '200px' }}
                                id="payer-autocomplete"
                                options={users}
                                getOptionLabel={(option) => option.name}
                                onChange={(_event, newValue) => setPayer(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        {...params}
                                        variant="standard"
                                        label="Paid by"
                                    />
                                )}
                            />
                        </Flex>
                        <br />
                        {ocrOutput.items.map((item, index) => (
                            <TableLikeRow key={index}>
                                <TableLikeRowItem>
                                    <AiOutlineDoubleRight style={{ fontSize: window.innerWidth <= 650 ? 'large' : 'x-large' }} />
                                </TableLikeRowItem>
                                <div style={{ flex: '2' }}>
                                    <TableLikeRowItem>
                                        <div><b>Item Name:</b> {item.item_name}</div>
                                        <div><b>Quantity:</b> {item.quantity}</div>
                                        <div><Typography variant="body1" style={{ color: 'green' }}><b> Rs. {item.total_amount}</b></Typography></div>
                                    </TableLikeRowItem>
                                </div>
                                <div style={{ flex: '2' }}>
                                    <Autocomplete
                                        multiple
                                        id={`shared-by-autocomplete-${index}`}
                                        options={users}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(_event, newValue) => handleSharedByChange(index, newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Shared by"
                                                required
                                            />
                                        )}
                                    />
                                </div>
                            </TableLikeRow>
                        ))}
                        {ocrOutput.tax.map((item, index) => (
                            <TableLikeRow key={index}>
                                <TableLikeRowItem>
                                    <AiOutlineDoubleRight style={{ fontSize: window.innerWidth <= 650 ? 'large' : 'x-large' }} />
                                </TableLikeRowItem>
                                <div style={{ flex: '2' }}>
                                    <TableLikeRowItem>
                                        <div><b>Tax Type:</b> {item.type}</div>
                                        <div><b>Percentage:</b> {item.percent}</div>
                                        <div><Typography variant="body1" style={{ color: 'green' }}><b> Rs. {item.amount}</b></Typography></div>
                                    </TableLikeRowItem>
                                </div>
                                <div style={{ flex: '2' }}>
                                    <Autocomplete
                                        multiple
                                        id={`shared-by-autocomplete-${index}`}
                                        options={users}
                                        defaultValue={users} // Set defaultValue to all users
                                        getOptionLabel={(option) => option.name}
                                        onChange={(_event, newValue) => handleSharedByChange(index, newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Shared by"
                                                required
                                                disabled />
                                        )}
                                    />
                                </div>
                            </TableLikeRow>
                        ))}
                        <Button variant="primary" onClick={calculateShares}>Calculate Shares</Button>
                        <br></br>
                        {showShares && (
                            <>
                                <Card>
                                    <CardContent>
                                        <h4>Expense Details</h4>
                                        <br />
                                        <TableLikeRow style={{ background: 'beige' }}>
                                            {window.innerWidth > 650 && (
                                                <TableLikeRowItem>
                                                    <AiOutlineDoubleRight style={{ fontSize: 'x-large' }} />
                                                </TableLikeRowItem>
                                            )}
                                            <div style={{ flex: '1' }}>
                                                <div>{formatDateForTransactions(formatDate(expenseToCreate.date))}</div>
                                            </div>
                                            <div style={{ flex: '2' }}>
                                                <div><b>{toTitleCase(expenseToCreate.expenseName)}</b></div>
                                                <div>Paid by: {toTitleCase(userSharesMap.current[expenseToCreate.paidBy]?.name || '')}</div>
                                                <div style={{ marginLeft: '10px' }}><b>Rs. {expenseToCreate.amount.toFixed(2)}</b></div>
                                            </div>
                                        </TableLikeRow>
                                        <br></br>
                                        <p><strong>Shares (Owed to {toTitleCase(userSharesMap.current[expenseToCreate.paidBy]?.name || '')}):</strong></p>
                                        {Object.values(userSharesMap.current).map((share) => (
                                            <div style={{ marginLeft: '10px' }}>
                                                <Flex>
                                                    <Avatar>{share.name ? share.name[0].toUpperCase() : '--'}</Avatar>
                                                    <div>
                                                        <b>{toTitleCase(share.name || '')}</b><br />
                                                        Rs.{share.amount.toFixed(2)}
                                                    </div>
                                                </Flex>
                                                <br />
                                            </div>
                                        ))}
                                        <Button variant="secondary" onClick={handleAddExpense}>Add Expense</Button>
                                    </CardContent>
                                </Card>
                            </>

                        )}
                    </>
                )}
        </DashboardContainer >
    );
};

export default ShareBill;
