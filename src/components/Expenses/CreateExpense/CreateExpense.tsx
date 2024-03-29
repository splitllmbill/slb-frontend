import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import apiService from '../../../services/DataService';
import { Button, FormControl, FormControlLabel, RadioGroup, Radio, Stack, TextField, Autocomplete, Checkbox } from "@mui/material";
import { LabelForm } from "./CreateExpense.styled";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import './CreateExpense.styles.css';
import { MdOutlineReceiptLong } from "react-icons/md";
import { DashboardContainer, Flex } from "../../../App.styled";

const CreateExpenseDrawer = () => {
    const [event, setEvent] = useState<Partial<EventObject>>({});
    const [users, setUsers] = useState<User[]>([]);
    const [expenseName, setExpenseName] = useState('');
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

    useEffect(() => {
        fetchData();
    }, []); 

    useEffect(() => {
        if (splitType == "unequally" && users.length > 0) {
            const initialShareDetails = users.map(user => ({ userId: user.id!, amount: 0 }));
            setShareDetails(initialShareDetails);
        } else if (splitType == "equally" && selectedUsers.length > 0) {
            const initialShareDetails = selectedUsers.map(user => ({ userId: user.id!, amount: 0 }));
            setShareDetails(initialShareDetails);
        }
    }, [selectedUsers, users, splitType]);

    const handleCreateExpense = async () => {
        if (splitType == 'unequally') {
            const totalShareAmount = shareDetails.reduce((total, share) => total + share.amount, 0);
            if (totalShareAmount !== amount) {
                alert("Sum of individual user shares must be equal to the expense amount!");
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
            category: "food",
            shares: shares,
            date: selectedDate.toDateString()
        };

        try {
            const result = await apiService.createExpense(createExpenseObject as unknown as Expense);
            if (result) {
                navigate(`/expense/${result.id}`)
            }
        } catch (error) {
            console.error('Unexpected error event creation:', error);
        }
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleShareBill = () => {
        navigate('/shareBill', { state: { "users": users, "type": typeToPass, "id": id } });
    }

    const handleSplitTypeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSplitType(event.target.value);
    };

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>, userId: string | undefined) => {
        const { value } = event.target;

        // Create a copy of the shareDetails array
        const updatedShareDetails = shareDetails.map(share => {
            if (share.userId === userId) {
                return {
                    ...share,
                    amount: parseFloat(value)
                };
            }
            return share;
        });

        // Update the shareDetails state with the modified array
        setShareDetails(updatedShareDetails);
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;


    return (
        <DashboardContainer>
            <Flex>
                <button onClick={handleGoBack}>
                    <IoMdArrowBack style={{ fontSize: 'x-large' }}></IoMdArrowBack> Go Back
                </button>
                <button onClick={handleShareBill} >
                    <MdOutlineReceiptLong style={{ fontSize: 'x-large' }}></MdOutlineReceiptLong> Share a bill
                </button>
            </Flex>
            <Stack spacing={2} useFlexGap direction="column">
                <h3>Add a New Expense</h3>
                <span><strong>Expense Name</strong></span>
                <TextField type="name" onChange={(event) => setExpenseName(event.target.value)} value={expenseName} name="name" required />
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
                        <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={users}
                            onChange={(_, value) => setSelectedUsers(value)}
                            getOptionLabel={(option) => option.name}
                            defaultValue={[]}
                            disableCloseOnSelect
                            limitTags={4}
                            // isOptionEqualToValue=
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Add Users" />
                            )}
                        />
                    </>)
                }
                {splitType === 'unequally' && showShareDetails && (
                    <>
                        <span ><strong>Split Unequally Among</strong></span>
                        {users.map((user, index) => (
                            <div key={user.id}>
                                <Row>
                                    <Col>
                                        <span>{user.name}</span>
                                    </Col>
                                    <Col>
                                        <input
                                            type="number"
                                            value={shareDetails[index] ? shareDetails[index].amount : 0}
                                            onChange={(e) => handleAmountChange(e, user.id)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </>
                )}
            </Stack>
            <br />
            <Button variant="contained" onClick={handleCreateExpense}>Add</Button>
        </DashboardContainer>
    );
}

export default CreateExpenseDrawer;
