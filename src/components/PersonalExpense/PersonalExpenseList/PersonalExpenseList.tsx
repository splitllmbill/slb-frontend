import { FC, useState, useEffect } from 'react';
import dataService from '../../../services/DataService';
import { formatDate, formatDateForTransactions, personalExpenseAdded, toTitleCase } from '../../../services/State';
import { AiOutlineDoubleRight } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import { TableLikeRow, TableLikeRowItem, H3, PaginationContainer, PersonalExpenseListWrapper } from '../../../App.styled';

interface PersonalExpenseListProps { }

const PersonalExpenseList: FC<PersonalExpenseListProps> = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataService.getExpensesForUser();
        setExpenses(data);
      } catch (error) {
        // Handle errors if needed
      }
    };

    const subscription = personalExpenseAdded.subscribe(() => {
      console.log('List Reloaded');
      fetchData(); // Fetch data after a reload event
    });

    fetchData(); // Initial data fetch

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  return (
    <PersonalExpenseListWrapper>
      <H3>
        Personal Expenses
      </H3>
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
