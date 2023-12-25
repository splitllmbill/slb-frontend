import styled from 'styled-components';

export const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const ChatbotWindow = styled.div`
  height: 400px;
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
  margin:5px;
`;

export const Button = styled.button`
  background-color: yellow;
`;

export const Table = styled.table`
  /* Your styling for the table */
`;