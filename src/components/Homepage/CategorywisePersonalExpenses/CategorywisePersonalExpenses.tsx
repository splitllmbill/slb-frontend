import React, { useEffect, useState } from 'react';
import { H3, PaginationContainer, PersonalExpenseListWrapper2, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import Pagination from '@mui/material/Pagination';
import { toTitleCase } from '../../../services/State';
import { Avatar } from '@mui/material';
import { shades } from '../colors';
import { TbFaceIdError } from 'react-icons/tb';
import { NoExpensesWrapper } from '../../Expenses/ExpenseDetail/ExpenseDetails.styled';

interface Expense {
    cost: number;
    noOfTransactions: number;
    category: string;
    percent: number;
}

interface Props {
    expenses: Expense[];
}

const CategorywisePersonalExpenses: React.FC<Props> = ({ expenses }) => {

    const [page, setPage] = useState(1);
    const itemsPerPage = 4;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {

    }, []);




    return (
        <PersonalExpenseListWrapper2 style={{ borderRadius: '10px' }}>
            <H3><h5>Personal Expenses Summary </h5></H3><br></br>
            {expenses && expenses.length == 0 && (
                <>
                    <NoExpensesWrapper>
                        <TbFaceIdError style={{ fontSize: 'xx-large' }}></TbFaceIdError>
                        <h6>No records yet!</h6>
                    </NoExpensesWrapper>
                    <br />
                </>
            )}
            {expenses && expenses.length > 0 && (
                <>
                    {expenses.slice(startIndex, endIndex).map((expense, index) => (
                        <TableLikeRow style={{ padding: '10px' }} key={index}>
                            <TableLikeRowItem>
                                <Avatar sx={{ bgcolor: shades[startIndex + index] }}><p></p></Avatar>
                            </TableLikeRowItem>
                            <div style={{ flex: '2' }}>
                                <div><b>{toTitleCase(expense.category)}</b></div>
                                <div>{expense.noOfTransactions} transactions</div>
                            </div>
                            <div style={{ flex: '1' }}><b>{expense.percent.toFixed(2)}%</b></div>
                            <div style={{ flex: '1' }} className='text-end'><b>Rs. {expense.cost.toFixed(2)}</b></div>
                        </TableLikeRow>
                    ))}
                </>)}
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
