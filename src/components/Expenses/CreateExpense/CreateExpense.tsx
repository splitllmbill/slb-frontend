import { ChangeEvent, FC, SetStateAction, useEffect, useState } from "react";
import apiService from '../../../services/DataService';
import { FormControl, FormControlLabel, RadioGroup, Radio, Stack, TextField, Autocomplete } from "@mui/material";
import { LabelForm } from "./CreateExpense.styled";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineReceiptLong } from "react-icons/md";
import { DashboardContainer, Flex, Button } from "../../../App.styled";
import CustomAutocomplete from "../../Common/CustomAutoComplete/CustomAutoComplete";
import CustomSnackbar from "../../Common/SnackBar/SnackBar";

interface CreateExpenseDrawerProps {
    expenseId: string;
}
const CreateExpenseDrawer: FC<CreateExpenseDrawerProps> = ({ expenseId }) => {
    const [event, setEvent] = useState<Partial<EventObject>>({});
    const [users, setUsers] = useState<User[]>([]);
    const [expenseName, setExpenseName] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);
    const [paidBy, setPaidBy] = useState<User>({ name: "", email: "" });
    const [showShareDetails, setShowShareDetails] = useState<boolean>(false);
    const [splitType, setSplitType] = useState('equally');
    const [shareDetails, setShareDetails] = useState<{ userId: string; amount: number }[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [typeToPass, setTypeToPass] = useState<string>("");
    const { id } = useParams<{ id: string }>();
    const { type } = useParams<{ type: string }>();
    const [mapUserIdToShareDetails, setMapUserIdToShareDetails] = useState<Map<string, { userId: string; amount: number }>>(new Map());
    const [eventId, setEventId] = useState<string>("");
    const [eventType, setEventType] = useState<string>("");
    const queryParams = new URLSearchParams(location.search);
    const friendId = queryParams.get('friendId');
    const [loading, setLoading] = useState(false);
    const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

    const handleClose = () => {
        setSnackBarState({ ...snackBarState, open: false });
    };

    const fetchData = () => {
        if (type) {
            switch (type) {
                case 'event':
                    setTypeToPass('group');
                    break;
                case 'friend':
                    setTypeToPass('friend');
                    break;
            }
        }
        if (id && type) {
            if (type == 'event') {
                apiService.getEvent(id).then(data => {
                    setEvent(data);
                });
            }
            apiService.getPossibleUsersForExpense(id, type).then(data => {
                setUsers(data);
                setShowShareDetails(true);
            });

        }
    };

    const fetchData2 = () => {
        if (expenseId) {
            apiService.getExpenseById(expenseId).then(data => {
                setExpenseName(data.expenseName);
                setCategory(data.category);
                setAmount(data.amount);
                setSelectedDate(new Date(data.date));
                const paidByDetail: { name: string; email: string; id: string } = { name: data.paidBy, email: "", id: data.paidById }
                setPaidBy(paidByDetail);
                console.log("paid by value", data.paidById);
                let splitTypeString: string = 'equally';
                let t = -1;
                const users: User[] = [];
                const shareDetailsData: { userId: string; amount: number }[] = [];
                for (const share of data.shares) {
                    const user: User = {
                        id: share.userId,
                        email: " ",
                        name: share.name
                    };
                    const shareDetail = {
                        userId: share.userId,
                        amount: share.amount
                    };
                    users.push(user);
                    mapUserIdToShareDetails.set(share.userId, shareDetail);
                    console.log("printing mappppp 1: ", mapUserIdToShareDetails.get(share.userId)?.amount)
                    shareDetailsData.push(shareDetail);
                    if (t == -1) {
                        t = share.amount;
                    } else {
                        if (t != share.amount) {
                            splitTypeString = 'unequally';
                        }
                    }
                }
                setEventId(data.eventId)
                console.log("setting event id", eventId, data.eventId)
                setEventType(data.type)
                console.log("setting event type", eventType, data.type)
                setSplitType(splitTypeString);
                setSelectedUsers(users);
                setShareDetails(shareDetailsData);
                setMapUserIdToShareDetails(mapUserIdToShareDetails)
                console.log("printing event type", eventType)

            });
        }
    };

    useEffect(() => {
        fetchData();
        fetchData2();
    }, []);
    useEffect(() => {
        if (splitType == "equally" && selectedUsers.length > 0) {
            const updatedShareDetails = selectedUsers.map(user => ({ userId: user.id!, amount: amount / (selectedUsers.length) }));
            setShareDetails(updatedShareDetails)
        }
    }, [selectedUsers])

    useEffect(() => {
        if (expenseId) {
            if (eventType == "friend") {
                console.log("inside friend", friendId, eventType)
                apiService.getPossibleUsersForExpense(friendId!, eventType!).then(data => {
                    setUsers(data);
                    setShowShareDetails(true);
                });
            } else {
                console.log("inside non friend", eventId, eventType)
                apiService.getPossibleUsersForExpense(eventId!, "event").then(data => {
                    setUsers(data);
                    setShowShareDetails(true);
                });
            }
        }
    }, [eventType]);


    useEffect(() => {
        if (splitType == "unequally" && users.length > 0 && expenseId == "") {
            const initialShareDetails = users.map(user => {
                const shareDetailsObj = { userId: user.id!, amount: 0 };
                mapUserIdToShareDetails.set(user.id!, shareDetailsObj);
                return shareDetailsObj
            }
            );
            setShareDetails(initialShareDetails);
            setMapUserIdToShareDetails(mapUserIdToShareDetails)
        } else if (splitType == "equally" && selectedUsers.length > 0 && expenseId == "") {
            const initialShareDetails = selectedUsers.map(user => ({ userId: user.id!, amount: 0 }));
            setShareDetails(initialShareDetails);
        }
    }, [selectedUsers, users, splitType]);

    const handleCreateExpense = async () => {
        setLoading(true);
        if (splitType == 'unequally') {
            const totalShareAmount = shareDetails.reduce((total, share) => total + share.amount, 0);
            if (totalShareAmount !== amount) {
                setSnackBarState({ message: "Sum of individual user shares must be equal to the expense amount!", open: true });
                return;
            }
        }
        const shares = shareDetails.map(share => ({
            userId: share.userId,
            amount: splitType == 'equally' ? amount / (selectedUsers.length) : share.amount
        }));
        const createExpenseObject = {
            expenseName: expenseName,
            amount: amount,
            type: typeToPass,
            paidBy: paidBy.id,
            eventId: event.id,
            category: category,
            shares: shares,
            date: selectedDate.toDateString()
        };

        try {
            const result = await apiService.createExpense(createExpenseObject as unknown as Expense);
            setSnackBarState({message:result.message, open:true});
            if (result.success == "true") {
                navigate(`/expense/${result.data.id}`)
            }
        } catch (error) {
            console.error('Unexpected error event creation:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEditExpense = async () => {
        setLoading(true);
        if (splitType == 'unequally') {
            const totalShareAmount = shareDetails.reduce((total, share) => total + share.amount, 0);
            if (totalShareAmount !== amount) {
                setSnackBarState({ message: "Sum of individual user shares must be equal to the expense amount!", open: true });
                return;
            }
        }
        const shares = shareDetails.map(share => ({
            userId: share.userId,
            amount: splitType == 'equally' ? amount / (selectedUsers.length) : share.amount
        }));
        let typeToPass;
        switch (type) {
            case 'event':
                typeToPass = 'group';
                break;
            case 'friend':
                typeToPass = 'friend';
                break;
        }
        const updateExpenseObject = {
            id: expenseId,
            expenseName: expenseName,
            amount: amount,
            type: typeToPass,
            paidBy: paidBy.id,
            category: category,
            shares: shares,
            date: selectedDate.toDateString()
        };

        try {
            const result = await apiService.editExpense(updateExpenseObject as unknown as Expense);
            setSnackBarState({message:result.message, open:true});
            if (result.success == "true") {
                if (friendId) {
                    navigate(`/expense/${expenseId}?friendId=${friendId}`)
                } else {
                    navigate(`/expense/${expenseId}`)
                }
            }
        } catch (error) {
            console.error('Unexpected error event creation:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleShareBill = () => {
        navigate(`/shareBill/${typeToPass}`, { state: { "users": users, "type": typeToPass, "id": id } });
    }

    const handleSplitTypeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSplitType(event.target.value);
    };

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>, userId: string | undefined) => {
        const { value } = event.target;

        // Create a copy of the shareDetails array
        const updatedShareDetails = shareDetails.map(share => {
            if (share.userId === userId) {
                mapUserIdToShareDetails.set(share.userId!, {
                    ...share,
                    amount: parseFloat(value)
                });
                return {
                    ...share,
                    amount: parseFloat(value)
                };
            }
            return share;
        });

        setMapUserIdToShareDetails(mapUserIdToShareDetails)

        // Update the shareDetails state with the modified array
        setShareDetails(updatedShareDetails);
    };

    return (
        <DashboardContainer>
            <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
            <Flex>
                <Button onClick={handleGoBack}>
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </Button>
                <Button onClick={handleShareBill} >
                    <MdOutlineReceiptLong style={{ fontSize: 'x-large' }}></MdOutlineReceiptLong> Share a bill
                </Button>
            </Flex>
            <Stack spacing={2} useFlexGap direction="column">
                <h3>{expenseId == "" ? "Add a New Expense" : "Edit Expense"}</h3>
                <span><strong>Expense Name</strong></span>
                <TextField type="name" onChange={(event) => setExpenseName(event.target.value)} value={expenseName} name="name" required />
                <span><strong>Category</strong></span>
                <TextField type="name" onChange={(event) => setCategory(event.target.value)} value={category} name="category" required />
                <span><strong>Date </strong></span>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    className="custom-datepicker"
                />
                <span><strong>Expense Amount</strong></span>
                <TextField type="number" onChange={(event) => setAmount(parseFloat(event.target.value))} value={amount} name="amount" required />
                <span><strong>Paid By</strong></span>
                <Autocomplete
                    id="disable-clearable"
                    options={users}
                    onChange={(_, value) => setPaidBy(value!)}
                    defaultValue={paidBy}
                    getOptionLabel={(option) => option.name}
                    disableClearable
                    renderInput={(params) => (
                        <TextField {...params} placeholder="Enter the payee" />
                    )}
                    value={paidBy}
                />
                <FormControl>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group"
                        value={splitType} onChange={handleSplitTypeChange}>
                        <LabelForm><strong>Split</strong></LabelForm>
                        <span><FormControlLabel value="equally" control={<Radio />} label="Equally" /></span>
                        <FormControlLabel value="unequally" control={<Radio />} label="Unequally" />
                    </RadioGroup>
                </FormControl>
                {splitType === 'equally' && (
                    <>
                        <span ><strong>Split Equally Among</strong></span>
                        <CustomAutocomplete
                            options={users}
                            onChange={(value) => setSelectedUsers(value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(option) => option.name}
                            value={selectedUsers}
                        />
                    </>)
                }
                {splitType === 'unequally' && showShareDetails && (
                    <>
                        <span ><strong>Split Unequally Among</strong></span>
                        {users.map((user) => {
                            console.log("printing mapp ahain", mapUserIdToShareDetails.get(user.id!))
                            return (
                                <div key={user.id}>
                                    <Row>
                                        <Col>
                                            <span>{user.name}</span>
                                        </Col>
                                        <Col>
                                            <input
                                                type="number"
                                                value={mapUserIdToShareDetails.has(user.id!) ? mapUserIdToShareDetails.get(user.id!)?.amount : 0}
                                                onChange={(e) => handleAmountChange(e, user.id)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })}
                    </>
                )}
            </Stack>
            <br />
            <Button disabled={loading} onClick={expenseId == "" ? handleCreateExpense : handleEditExpense}>{expenseId == "" ? "Add" : "Edit"}</Button>
        </DashboardContainer>
    );
}

export default CreateExpenseDrawer;
