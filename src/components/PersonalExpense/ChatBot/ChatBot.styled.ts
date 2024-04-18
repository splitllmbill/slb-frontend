import styled from 'styled-components';
import { Table } from 'react-bootstrap'
import DatePicker from "react-datepicker";

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
  padding-top:10px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px;
  margin: -2px 20px 10px 20px;
  background: #fff;
  border: 1px solid black;
  color: black;
`;

export const StyledDatePicker = styled(DatePicker)`
  flex: 1;
  padding: 8px;
  margin: -2px 20px 10px 20px;
  background: #fff;
  border: 1px solid black;
  color: black;
`;

export const TH = styled.th`
  padding:10px;
  border: 0.5px solid grey;
`;

export const TD = styled.td`
  padding:10px;
  border: 1px solid grey !important;
`;

export const ZoomOutTable = styled(Table)`
  display: block; 
  overflow-x: auto; 
  white-space: nowrap; 
`;