import { FC, useState, useEffect } from 'react';
import { PersonalExpenseListWrapper } from './PersonalExpenseList.styled';
import dataService from '../../../services/DataService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { personalExpenseAdded } from '../../../services/State'; 

interface PersonalExpenseListProps {}

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

  return (
    <PersonalExpenseListWrapper>
      <h3>Personal Expenses</h3>
      <DataGrid
        rows={expenses}
        columns={columns}
        autoHeight
      />
    </PersonalExpenseListWrapper>
  );
};

export default PersonalExpenseList;
