import styled from 'styled-components';

export const PersonalExpenseListWrapper = styled.div`
  background-color:white;
  border: 1px solid #ccc;
`;

export const H3 = styled.h3`
padding: 15px;
border-bottom: 1px solid #ccc;
`;

export const ExpenseRow = styled.div`
display: flex;
alignItems: center;
padding: 20px;
`

export const ExpenseRowItem = styled.div`
margin-right: 10px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Align pagination to the right */
  margin: 10px; /* Adjust margin as needed */
`;