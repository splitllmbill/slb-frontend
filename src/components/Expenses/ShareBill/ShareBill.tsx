import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { DashboardContainer, Flex, TableLikeRow, TableLikeRowItem, Button } from '../../../App.styled';
import { Row, Col } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { Autocomplete, CardContent, Card, CircularProgress, TextField, Typography, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsDot } from "react-icons/bs";
import { IoMdArrowBack } from 'react-icons/io';
import { formatDate, formatDateForTransactions, toTitleCase } from '../../../services/State';
import { MdOutlineEdit } from "react-icons/md";
import { FaCheck } from 'react-icons/fa';
import CustomSnackbar from '../../Common/SnackBar/SnackBar';

const ShareBill = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [showTable, setShowTable] = useState<boolean>(false);
    const [isEditOnList, setIsEditOnList] = useState<boolean[]>([]);
    const [isEditOnTaxList, setIsEditOnTaxList] = useState<boolean[]>([]);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [ocrOutput, setOcrOutput] = useState({
        items: [{ amount: 0, item_name: "", quantity: 1, slno: 1, total_amount: 0 }],
        tax: [{ amount: 0, percent: 0, type: "" }]
    });
    const [payer, setPayer] = useState<any>(null);
    const [sharedByUsers, setSharedByUsers] = useState<any[]>([]);
    const [sharedByUsersTax, setSharedByUsersTax] = useState<any[]>([]);
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
    const [editableItems, setEditableItems] = useState<any[]>([]);
    const [editableTaxItems, setEditableTaxItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

    const handleClose = () => {
        setSnackBarState({ ...snackBarState, open: false });
    };

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
            setLoading(true);
            setShowTable(false);
            try {
                const data = await dataService.fileUpload(selectedFile);
                setShowLoader(false);
                setOcrOutput(data.ocroutput);
                if (data.ocroutput.tax.length > 0) {
                    const initialSharedByUsersTax: any[] = [];
                    for (let i = 0; i < data.ocroutput.tax.length; i++) {
                        initialSharedByUsersTax.push(users);
                    }
                    setSharedByUsersTax(initialSharedByUsersTax);
                }
                setShowTable(true);
            } catch (error) {
                console.error('Error uploading file:', error);
                setShowLoader(false);
            } finally {
                setLoading(false);
            }
        } else {
            setSnackBarState({ message: "Invalid file!", open: true });
        }
    };

    const handleSharedByChange = (index: number, newValue: any[]) => {
        setSharedByUsers(prevSharedByUsers => {
            const updatedSharedByUsers = [...prevSharedByUsers];
            updatedSharedByUsers[index] = newValue;
            return updatedSharedByUsers;
        });
    };

    const handleTaxSharedByChange = (index: number, newValue: any[]) => {
        setSharedByUsersTax(prevSharedByUsersTax => {
            const updatedSharedByUsersTax = [...prevSharedByUsersTax];
            updatedSharedByUsersTax[index] = newValue;
            return updatedSharedByUsersTax;
        });
    };

    const calculateShares = () => {
        userSharesMap.current = {};
        if (type && id && payer) {
            let totalAmount = ocrOutput.items.reduce((total, item) => total + item.total_amount, 0);
            totalAmount += ocrOutput.tax.reduce((total, item) => total + item.amount, 0);

            if (sharedByUsers.length !== ocrOutput.items.length || sharedByUsersTax.length != ocrOutput.tax.length || !type || !payer) {
                setSnackBarState({ message: "Please fill all required fields!", open: true });
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

                ocrOutput.tax.forEach((item, index) => {
                    if (sharedByUsersTax[index] && sharedByUsersTax[index].length > 0) {
                        const itemShareAmount = item.amount / sharedByUsersTax[index].length;

                        sharedByUsersTax[index].forEach((user: { id: any, name: string }) => {
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
            setSnackBarState({ message: "Please fill all required fields!", open: true });
        }
    };

    useEffect(() => {
        const allItemsEdited = editableItems.every(item => item !== undefined);
        const allTaxItemsEdited = editableTaxItems.every(item => item !== undefined);
        if (allItemsEdited && allTaxItemsEdited) {
            updateOcrOutput();
        }
    }, [editableItems, editableTaxItems]);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            const result = await dataService.createExpense(expenseToCreate as unknown as Expense);
            setSnackBarState({ message: result.message, open: true });
            if (result.success == "true") {
                navigate(`/expense/${result.data.id}`)
            }
        } catch (error) {
            console.error('Unexpected error event creation:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleItemFieldChange = (index: number, field: string, value: string | number) => {
        setEditableItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };
            return updatedItems;
        });
    };

    const handleTaxItemFieldChange = (index: number, field: string, value: string | number) => {
        setEditableTaxItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };
            return updatedItems;
        });
    };

    const handleTickClick = (index: number) => {
        const editedItem = editableItems[index];
        if (editedItem) {
            setEditableItems(prevEditableItems => {
                const updatedItems = [...prevEditableItems];
                updatedItems[index] = {
                    ...updatedItems[index],
                    ...editedItem
                };
                return updatedItems;
            });
        }

        setIsEditOnList(prev => {
            const newList = [...prev];
            newList[index] = false; // Turn off edit mode for the current entry
            return newList;
        });
    };

    const handleTaxTickClick = (index: number) => {
        const editedTaxItem = editableTaxItems[index];
        if (editedTaxItem) {
            setEditableTaxItems(prevEditableItems => {
                const updatedTaxItems = [...prevEditableItems];
                updatedTaxItems[index] = {
                    ...updatedTaxItems[index],
                    ...editedTaxItem
                };
                return updatedTaxItems;
            });
        }

        setIsEditOnTaxList(prev => {
            const newList = [...prev];
            newList[index] = false; // Turn off edit mode for the current tax item
            return newList;
        });
    };

    const updateOcrOutput = () => {
        setOcrOutput(prevOcrOutput => {
            const updatedItems = prevOcrOutput.items.map((item, idx) => {
                return {
                    ...item,
                    ...editableItems[idx]
                };
            });

            const updatedTaxItems = prevOcrOutput.tax.map((item, idx) => {
                return {
                    ...item,
                    ...editableTaxItems[idx]
                };
            });

            return {
                ...prevOcrOutput,
                items: updatedItems,
                tax: updatedTaxItems
            };
        });
    };


    const toggleTaxEdit = (index: number) => {
        setIsEditOnTaxList(prev => {
            const newList = [...prev];
            newList[index] = !newList[index];
            return newList;
        });
    };


    const toggleEdit = (index: number) => {
        setIsEditOnList(prev => {
            const newList = [...prev];
            newList[index] = !newList[index];
            return newList;
        });
    };

    return (
        <DashboardContainer>
            <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
            <Flex>
                <Button onClick={handleGoBack}>
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </Button>
            </Flex>
            <h2>Share a bill</h2>
            <p>Upload receipts, split expenses, and track shared costs effortlessly!</p>
            <br />
            <Row className="align-items-center">
                <Col xs={6} md={6}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Col>
                {window.innerWidth <= 650 && (<><br /><br /></>)}
                <Col xs={6} md={6}>
                    <Button disabled={loading} onClick={handleUpload}>Upload</Button>
                    {/* <FaFileUpload style={{ fontSize: 'xx-large' }} onClick={handleUpload} /> */}
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
                                        <Row>
                                            {!isEditOnList[index] && (
                                                <Col xs={6}>
                                                    <div><b>Item Name:</b> {item.item_name}</div>
                                                    <div><b>Quantity:</b> {item.quantity}</div>
                                                    <div><Typography variant="body1" style={{ color: 'green' }}><b> Rs. {item.total_amount.toFixed(2)}</b></Typography></div>
                                                </Col>
                                            )}
                                            {isEditOnList[index] && (
                                                <Col xs={6}>
                                                    <TextField
                                                        label="Item Name"
                                                        value={editableItems[index]?.item_name || item.item_name}
                                                        onChange={(e) => handleItemFieldChange(index, 'item_name', e.target.value)}
                                                    />
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        value={editableItems[index]?.quantity || item.quantity}
                                                        onChange={(e) => handleItemFieldChange(index, 'quantity', parseInt(e.target.value))}
                                                    />
                                                    <TextField
                                                        label="Total Amount"
                                                        type="number"
                                                        value={editableItems[index]?.total_amount || item.total_amount}
                                                        onChange={(e) => handleItemFieldChange(index, 'total_amount', parseFloat(e.target.value))}
                                                    />
                                                </Col>
                                            )}
                                            <Col xs={2}>
                                                {isEditOnList[index] ? (
                                                    <FaCheck
                                                        style={{ fontSize: 'x-large', cursor: 'pointer' }}
                                                        onClick={() => handleTickClick(index)} // Pass the index to handleTickClick
                                                    />
                                                ) : (
                                                    <MdOutlineEdit
                                                        style={{ fontSize: 'x-large', cursor: 'pointer' }}
                                                        onClick={() => toggleEdit(index)}
                                                    />
                                                )}
                                            </Col>
                                        </Row>
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
                                        <Row>
                                            {!isEditOnTaxList[index] && (
                                                <Col xs={6}>
                                                    <div><b>Tax Type:</b> {item.type}</div>
                                                    <div><b>Percentage:</b> {item.percent}</div>
                                                    <div><Typography variant="body1" style={{ color: 'green' }}><b> Rs. {item.amount.toFixed(2)}</b></Typography></div>
                                                </Col>)}
                                            {isEditOnTaxList[index] && (
                                                <Col xs={6}>
                                                    <TextField
                                                        label="Tax Type"
                                                        value={editableTaxItems[index]?.type || item.type}
                                                        onChange={(e) => handleTaxItemFieldChange(index, 'type', e.target.value)}
                                                    />
                                                    <TextField
                                                        label="Percentage"
                                                        value={editableTaxItems[index]?.percent || item.percent}
                                                        onChange={(e) => handleTaxItemFieldChange(index, 'percent', parseFloat(e.target.value))}
                                                    />
                                                    <TextField
                                                        label="Amount"
                                                        value={editableTaxItems[index]?.amount || item.amount}
                                                        onChange={(e) => handleTaxItemFieldChange(index, 'amount', parseFloat(e.target.value))}
                                                    />
                                                </Col>)}
                                            <Col xs={2}>
                                                {isEditOnTaxList[index] ? (
                                                    <FaCheck
                                                        style={{ fontSize: 'x-large', cursor: 'pointer' }}
                                                        onClick={() => handleTaxTickClick(index)} // Pass the index to handleTickClick
                                                    />
                                                ) : (
                                                    <MdOutlineEdit
                                                        style={{ fontSize: 'x-large', cursor: 'pointer' }}
                                                        onClick={() => toggleTaxEdit(index)}
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                    </TableLikeRowItem>
                                </div>
                                <div style={{ flex: '2' }}>
                                    <Autocomplete
                                        multiple
                                        id={`shared-by-autocomplete-${index}`}
                                        options={users}
                                        defaultValue={users} // Set defaultValue to all users
                                        getOptionLabel={(option) => option.name}
                                        onChange={(_event, newValue) => handleTaxSharedByChange(index, newValue)}
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
                        <Button onClick={calculateShares}>Calculate Shares</Button>
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
                                        <Button disabled={loading} onClick={handleAddExpense}>Add Expense</Button>
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
