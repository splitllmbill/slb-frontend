import { FC, useState, useEffect } from 'react';
import dataService from '../../../services/DataService';
import { formatDate, formatDateForTransactions, personalExpenseAdded, toTitleCase } from '../../../services/State';
import { AiOutlineDoubleRight } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import { TableLikeRow, TableLikeRowItem, PaginationContainer, PersonalExpenseListWrapper, H3 } from '../../../App.styled';
import { Col, Row } from 'react-bootstrap';
import DynamicFilter from '../../Filter/Filter';

interface PersonalExpenseListProps { }

const PersonalExpenseList: FC<PersonalExpenseListProps> = () => {
  const [filterOptions, setFilterOptions] = useState({})
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterInput, setFilterInput] = useState<FilterInput>({ filters: [] })
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const handleSetFilters = (Filters: FilterCriteria[]) => {
    const updatedFilterInput = {
      ...filterInput,
      filters: Filters
    }
    setFilterInput(updatedFilterInput)
  }
  const fetchData = async (filterInput: FilterInput) => {
    try {
      console.log("filterInput", filterInput)
      const data = await dataService.getExpensesForUser(filterInput);
      setExpenses(data);
    } catch (error) {
      // Handle errors if needed
    }
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
    console.log(filterOptions);
  }, [filterOptions])
  useEffect(() => {

    fetchFilterOptions();

    const subscription = personalExpenseAdded.subscribe(() => {
      console.log('List Reloaded');
      fetchData(filterInput); // Fetch data after a reload event
    });

    fetchData(filterInput); // Initial data fetch

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchData(filterInput);
  }, [filterInput])

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  return (
    <PersonalExpenseListWrapper>
      <Row className="align-items-center"> {/* This ensures vertical alignment */}
        <Col xs={10}> {/* Adjusted for centering text */}
          <H3>
            <h4>Personal Expenses</h4>
            <h6> Total expense: Rs.{expenses.reduce((acc, expense) => acc + expense.amount, 0)}</h6>
          </H3>
        </Col>
        <Col xs={2} className="text-end"> {/* Ensures the icon is in a separate column and centered */}
          <DynamicFilter applyFilter={handleSetFilters} filterOptions={filterOptions} />
        </Col>
      </Row>
      {expenses.slice(startIndex, endIndex).map((expense) => (
        <TableLikeRow key={expense.id}>
          <TableLikeRowItem>
            <AiOutlineDoubleRight style={{ fontSize: 'x-large' }} />
          </TableLikeRowItem>
          <div style={{ flex: '1' }}>
            <div>{formatDateForTransactions(formatDate(expense.date))}</div>
          </div>
          <div style={{ flex: '2' }}>
            {/* Details component */}
            <div><b>{toTitleCase(expense.expenseName)}</b></div>
            <div>{toTitleCase(expense.category)}</div>
          </div>
          <div style={{ marginLeft: '10px' }}><b>Rs. {expense.amount}</b></div>
        </TableLikeRow>
      ))}
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
  );
};

export default PersonalExpenseList;