import styled from 'styled-components';

export const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column; 
  margin-top: 1px;
  background-color:white;
`;

export const ChatbotWindow = styled.div`
  height: 60vh;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

export const Message = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
  display:flex;
  gap: 10px;
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px;
  margin: -2px 20px 10px 20px;
`;

export const Button = styled.button`
  background-color: darkgrey;
`;

export const Table = styled.table`
  /* Your styling for the table */
`;

export const TH = styled.th`
  padding:10px;
  border: 0.5px solid grey;
`;

export const TD = styled.td`
  padding:10px;
  border: 1px solid grey !important;
`;