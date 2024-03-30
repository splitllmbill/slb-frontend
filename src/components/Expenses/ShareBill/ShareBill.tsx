import { ChangeEvent, useState } from 'react';
import { DashboardContainer, Flex, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import { Row, Col, Button } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { Autocomplete, CardContent, Card, CircularProgress, Input, Popper, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

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
    const [expenseName, setExpenseName] = useState(''); // State for storing expense name

    const handleExpenseNameChange = (event) => {
        setExpenseName(event.target.value); // Update the expenseName state with the input value
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
        if (type && id && payer) {
            const totalAmount = ocrOutput.items.reduce((total, item) => total + item.total_amount, 0);
            const userSharesMap: { [key: string]: Share } = {};
            ocrOutput.items.forEach((item, index) => {
                const itemShareAmount = item.total_amount / (sharedByUsers[index].length);

                sharedByUsers[index].forEach((user: { id: any; }) => {
                    const userId = user.id;
                    if (!userSharesMap[userId]) {
                        userSharesMap[userId] = {
                            amount: itemShareAmount,
                            userId: userId,
                        };
                    }
                    else userSharesMap[userId].amount += itemShareAmount;
                });

            });
            const shares = Object.values(userSharesMap);
            const expense: Expense = {
                expenseName: "", // Provide a name for the expense if necessary
                amount: totalAmount,
                type: type,
                paidBy: payer,
                shares: shares,
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
            if (expense) {
                console.log(expense);
                setExpenseToCreate(expense)
                setShowShares(true);
            }
        }
    };


    return (
        <DashboardContainer>
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
                {window.innerWidth <= 600 && (<><br /><br /></>)}
                <Col xs={12} md={6}>
                    <Button variant="secondary" onClick={handleUpload}>Upload</Button>
                </Col>
            </Row>
            <br />
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {
                showTable && (
                    <>
                        <Flex>
                            <TextField
                                id="standard-basic"
                                label="Expense Name"
                                variant="standard"
                                style={{ background: 'whitesmoke' }}
                                value={expenseName} // Assign the value of the input field
                                onChange={handleExpenseNameChange} // Call the handleExpenseNameChange function on input change
                            />
                            <Autocomplete style={{ width: '100%' }}
                                id="payer-autocomplete"
                                options={users}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => setPayer(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Paid by"
                                    />
                                )}
                            />
                        </Flex>
                        {ocrOutput.items.map((item, index) => (
                            <TableLikeRow key={index}>
                                <TableLikeRowItem>
                                    <AiOutlineDoubleRight style={{ fontSize: window.innerWidth <= 500 ? 'large' : 'x-large' }} />
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
                                        onChange={(event, newValue) => handleSharedByChange(index, newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Shared by"
                                            />
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
                                        <h2>Expense Details</h2>
                                        <p><strong>Expense Name:</strong> {expenseName}</p>
                                        <p><strong>Total Amount:</strong> {expenseToCreate.amount}</p>
                                        <p><strong>Date:</strong> {expenseToCreate.date}</p>
                                        <p><strong>Paid By:</strong> {expenseToCreate.paidBy.name}</p>
                                        <p><strong>Shares:</strong></p>
                                        <ul>
                                            {expenseToCreate.shares.map((share, index) => (
                                                <li key={index}>
                                                    User ID: {share.userId}, Amount: {share.amount}
                                                </li>
                                            ))}
                                        </ul>
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
