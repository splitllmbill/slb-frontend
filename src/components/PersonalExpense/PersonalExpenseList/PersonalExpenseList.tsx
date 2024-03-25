import { FC, useState, useEffect } from 'react';
import { H3, PersonalExpenseListWrapper } from './PersonalExpenseList.styled';
import dataService from '../../../services/DataService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { personalExpenseAdded } from '../../../services/State';

interface PersonalExpenseListProps { }

const PersonalExpenseList: FC<PersonalExpenseListProps> = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

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

  const columns: GridColDef[] = [
    { field: 'updatedAt', headerName: 'Date', flex: 1 },
    { field: 'expenseName', headerName: 'Expense Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'amount', headerName: 'Cost', flex: 1 },
  ];

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalRow = { id: 'total', updatedAt: 'Total', expenseName: '', category: '', amount: totalAmount };

  return (
    <PersonalExpenseListWrapper>
      <H3>Personal Expenses</H3>
      <div style={{ height: 400, width: '100%' }}> 
        <DataGrid rows={[...expenses, totalRow]} columns={columns} autoHeight />
      </div>
    </PersonalExpenseListWrapper>
  );
};

export default PersonalExpenseList;
