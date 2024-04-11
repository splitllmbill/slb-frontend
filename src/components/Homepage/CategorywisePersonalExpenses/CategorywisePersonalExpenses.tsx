import React, { useState } from 'react';
import { H3, PaginationContainer, PersonalExpenseListWrapper2, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import Pagination from '@mui/material/Pagination';
import { toTitleCase } from '../../../services/State';
import { Avatar } from '@mui/material';

const CategorywisePersonalExpenses: React.FC = () => {

    const [page, setPage] = useState(1);
    const expenses = [
        { category: 'Food', cost: 100, percent: 30, noOfTransactions: 5 },
        { category: 'Transportation', cost: 50, percent: 15, noOfTransactions: 3 },
        { category: 'Entertainment', cost: 80, percent: 20, noOfTransactions: 4 },
        { category: 'Utilities', cost: 70, percent: 21, noOfTransactions: 2 },
        { category: 'Others', cost: 30, percent: 9, noOfTransactions: 1 }
    ];

    const itemsPerPage = 4;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
      };

    return (
        <PersonalExpenseListWrapper2 style={{borderRadius:'10px'}}>
            <H3>Personal Expenses Summary </H3>
            {expenses.slice(startIndex, endIndex).map((expense) => (
                <TableLikeRow style={{padding:'10px'}}>
                    <TableLikeRowItem>
                        <Avatar>s</Avatar>
                    </TableLikeRowItem>
                    <div style={{ flex: '2' }}>
                        <div><b>{toTitleCase(expense.category)}</b></div>
                        <div>{expense.noOfTransactions} transactions</div>
                    </div>
                    <div style={{flex:'1'}} className='text-end'><b>Rs. {expense.cost}</b></div>
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
        </PersonalExpenseListWrapper2>
    );
}

export default CategorywisePersonalExpenses;
