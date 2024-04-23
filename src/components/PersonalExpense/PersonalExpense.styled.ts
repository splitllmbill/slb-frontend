import styled from 'styled-components';
import DatePicker from "react-datepicker";

export const PersonalExpenseWrapper = styled.div`
  padding:10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px;
  margin: -2px 20px 10px 20px;
  background: #fff;
  border: 1px solid black;
  color: black;
`;

export const InputSmall = styled.input`
  flex: 1;
  padding: 8px;
  margin: -2px 20px 10px 20px;
  background: #fff;
  border: 1px solid black;
  color: black;
  height: 25px
`;

export const DatePickerSmall = styled(DatePicker)`
  width: 120px;
  border: 1px solid #ced4da;
  background: inherit;
  border-radius: 4px;
  padding: 15px;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-clip: padding-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;