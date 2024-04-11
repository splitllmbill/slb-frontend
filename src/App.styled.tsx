import { styled } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Input = styled.input`
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

export const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
      background-color: #cccccc;
      color: #6c757d;
      cursor: not-allowed;
    }
`;

export const DashboardContainer = styled.div`
padding: 20px;
`;

export const Flex = styled.div`
    display: flex;
    gap: 10px;
`;

export const TableLikeRow = styled.div`
display: flex;
// gap: 10px;
padding: 20px;
`

export const TableLikeRowItem = styled.div`
margin-right: 10px;
`;

export const NoItemsWrapper = styled.div`
margin-top: 30px;
text-align: center;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

export const PersonalExpenseListWrapper = styled.div`
  background-color:white;
  border: 1px solid #ccc;
`;

export const PersonalExpenseListWrapper2 = styled.div`
background-color:white;
padding: 10px;
`

export const H3 = styled.h5`
padding: 15px;
border-bottom: 1px solid #ccc;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Align pagination to the right */
  margin: 10px; /* Adjust margin as needed */
`;