import { FC, useState, useEffect } from 'react';
import dataService from '../../../services/DataService';
import { formatDate, formatDateForTransactions, personalExpenseAdded, toTitleCase } from '../../../services/State';
import { Input, InputSmall, DatePickerSmall } from '../PersonalExpense.styled';
import { AiOutlineDoubleRight } from "react-icons/ai";
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from "@mui/material";
import { TableLikeRow, TableLikeRowItem, PaginationContainer, PersonalExpenseListWrapper, H3 } from '../../../App.styled';
import { Col, Row } from 'react-bootstrap';
import DynamicFilter from '../../Filter/Filter';
import CustomSnackbar from '../../Common/SnackBar/SnackBar';
import { NoExpensesWrapper } from '../../Expenses/ExpenseDetail/ExpenseDetails.styled';
import { TbFaceIdError } from 'react-icons/tb';

interface PersonalExpenseListProps { }

const PersonalExpenseList: FC<PersonalExpenseListProps> = () => {
  const [filterOptions, setFilterOptions] = useState({})
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterInput, setFilterInput] = useState<FilterInput>({ filters: [] })
  const [page, setPage] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });
  const itemsPerPage = 5;
  const [isEditable, setIsEditable] = useState<number | null>(null);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  const handleSave = async (index: number) => {
    setIsEditable(null);
    setShowLoader(true);
    const expense = expenses[startIndex+index];
    const { id, expenseName, amount, type, category, date, paidBy } = expense;
    const lowerCaseCategory = category.toLowerCase();
    const updateExpenseObject = { id, expenseName, amount, type, category: lowerCaseCategory, date, paidBy };
    await dataService.editExpense(updateExpenseObject as unknown as Expense).then((data) => {
      setSnackBarState({ message: data.message, open: true });
      setFilterInput({ filters: [] });
    });
  };

  const setEditable = (index: number) => {
    setIsEditable(index);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newExpenses = [...expenses];
    newExpenses[startIndex+index].amount = parseInt(e.target.value);
    setExpenses(newExpenses);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newExpenses = [...expenses];
    newExpenses[startIndex+index].expenseName = e.target.value;
    setExpenses(newExpenses);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newExpenses = [...expenses];
    newExpenses[startIndex+index].category = e.target.value;
    setExpenses(newExpenses);
  };

  const handleDateChange = (date: Date, index: number) => {
    const newExpenses = [...expenses];
    newExpenses[startIndex+index].date = date.toDateString(); 
    setExpenses(newExpenses);
  };

  const handleDelete = async (index: number) => {
    setShowLoader(true);
    await dataService.deleteExpense(expenses[startIndex+index].id!).then((data) => {
      setSnackBarState({ message: data.message, open: true });
      setFilterInput({ filters: [] });
    });
  };

  const handleSetFilters = (Filters: FilterCriteria[]) => {
    const updatedFilterInput = {
      ...filterInput,
      filters: Filters
    }
    setFilterInput(updatedFilterInput)
  }

  const fetchData = async (filterInput: FilterInput) => {
    await dataService.getExpensesForUser(filterInput)
      .then((data) => {
        setExpenses(data);
        setPage(1);
        setShowLoader(false);
      })
      .catch((error : Error) => {
        // Handle errors if needed
        setExpenses([]);
        setShowLoader(false);
        setSnackBarState({ message: error.message, open: true });
      });
  };

  const fetchFilterOptions = async () => {
    try {
      const filterOptions = await dataService.getFilterOptions(["category"]);
      setFilterOptions(filterOptions);

    } catch (error) {
      // Handle errors if needed
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    const subscription = personalExpenseAdded.subscribe(() => {
      fetchData(filterInput);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setShowLoader(true);
    fetchData(filterInput);
  }, [filterInput])

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setIsEditable(null);
    setPage(newPage);
  };

  const handleClose = () => {
    setSnackBarState({ ...snackBarState, open: false });
};
  
  return (
    <>
      <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
      {
        showLoader ? <div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>
        : (
            <PersonalExpenseListWrapper>
            <H3>
              <Row className="align-items-center"> {/* This ensures vertical alignment */}
                <Col md={11} xs={8}> {/* Adjusted for centering text */} 
                    <h3>Personal Expenses</h3>
                    <h6>&nbsp;Total expense: Rs.{expenses.reduce((acc, expense) => acc + expense.amount, 0)}</h6>
                    <h6>&nbsp;No. of Transactions {expenses.length}</h6>
                </Col>
                <Col md={1} xs={4} > {/* Ensures the icon is in a separate column and centered */}
                  <DynamicFilter applyFilter={handleSetFilters} filterOptions={filterOptions} />
                </Col>
              </Row>
            </H3>
            {expenses.slice(startIndex, endIndex).map((expense, index) => (
              <TableLikeRow key={expense.id}>
                <TableLikeRowItem>
                  <AiOutlineDoubleRight style={{ fontSize: 'x-large' }} />
                </TableLikeRowItem>
                <div style={{ flex: '1' }}>
                  {isEditable !== index ?
                    (<div>{formatDateForTransactions(formatDate(expense.date))}</div>) :
                    (
                      <div>
                        <DatePickerSmall
                          selected={new Date(expense.date)}
                          onChange={(date: Date) => handleDateChange(date, index)}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    )
                  }
                </div>
                <div style={{ flex: '2' }}>
                  <InputSmall
                    value={isEditable !== index ? toTitleCase(expense.expenseName) : expense.expenseName}
                    onChange={(e) => handleNameChange(e, index)}
                    disabled={isEditable !== index}
                    style={isEditable !== index ? { border: '0', fontWeight: 'bold' } : undefined}
                  />
                  <InputSmall
                    value={isEditable !== index ? toTitleCase(expense.category) : expense.category}
                    onChange={(e) => handleCategoryChange(e, index)}
                    disabled={isEditable !== index}
                    style={isEditable !== index ? { border: '0' } : undefined}
                  />
                </div>
                <div style={{ flex: '3' }}>
                  {isEditable !== index ?
                    (<div style={{ marginLeft: '10px' }}><b>Rs. {expense.amount}</b></div>) :
                    (
                      <Input
                        value={expense.amount.toString()}
                        onChange={(e) => handleAmountChange(e, index)}
                        disabled={isEditable !== index}
                        style={isEditable !== index ? { border: '0' } : undefined}
                      />
                    )
                  }
                </div>
                <div style={{ flex: '1' }}>
                  {isEditable === index ? (
                    <>
                      <IconButton style={{ width: 'auto', height: 'auto' }} onClick={() => handleSave(index)}>
                        <SaveOutlinedIcon />
                      </IconButton>
                      <IconButton style={{ width: 'auto', height: 'auto' }} onClick={() => setIsEditable(null)}>
                        <CloseOutlinedIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton style={{ width: 'auto', height: 'auto' }} onClick={() => setEditable(index)}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton style={{ width: 'auto', height: 'auto' }} onClick={() => handleDelete(index)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </>
                  )}
                </div>
              </TableLikeRow>
            ))}
            { 
              expenses && expenses.length == 0 &&
              <NoExpensesWrapper>
                <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                <h6>No expenses yet!</h6>
              </NoExpensesWrapper>
            }
            
      
            <PaginationContainer>
              <Pagination
                count={Math.ceil(expenses.length / itemsPerPage)}
                page={page}
                onChange={handleChangePage}
                shape="rounded"
                size="large"
              />
            </PaginationContainer>
          </PersonalExpenseListWrapper>
        )
      }
    </>
  )
};

export default PersonalExpenseList;