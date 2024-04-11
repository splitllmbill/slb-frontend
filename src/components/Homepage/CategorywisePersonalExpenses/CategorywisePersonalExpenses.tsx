import React, { useEffect, useState } from 'react';
import { H3, PaginationContainer, PersonalExpenseListWrapper2, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import Pagination from '@mui/material/Pagination';
import { palette, toTitleCase } from '../../../services/State';
import { Avatar } from '@mui/material';

const CategorywisePersonalExpenses: React.FC = () => {

    const [page, setPage] = useState(1);
    const expenses = [
        { category: 'Food', cost: 100, percent: 30, noOfTransactions: 5 },
        { category: 'Transportation', cost: 50, percent: 15, noOfTransactions: 3 },
        { category: 'Entertainment', cost: 80, percent: 20, noOfTransactions: 4 },
    ];
    const [colors, setColors] = useState<string[]>([]);
    const itemsPerPage = 4;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        palette.pipe().subscribe((colors: string[]) => {
            setColors(colors);
        })
    }, []);




    return (
        <PersonalExpenseListWrapper2 style={{ borderRadius: '10px' }}>
            <H3><h5>Personal Expenses Summary </h5></H3><br></br>
            {expenses.slice(startIndex, endIndex).map((expense, index) => (
                <TableLikeRow style={{ padding: '10px' }}>
                    <TableLikeRowItem>
                        <Avatar sx={{ bgcolor: colors[index] }}><p></p></Avatar>
                    </TableLikeRowItem>
                    <div style={{ flex: '2' }}>
                        <div><b>{toTitleCase(expense.category)}</b></div>
                        <div>{expense.noOfTransactions} transactions</div>
                    </div>
                    <div style={{ flex: '1' }} className='text-end'><b>Rs. {expense.cost}</b></div>
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
