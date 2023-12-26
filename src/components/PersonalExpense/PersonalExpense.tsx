import { FC } from 'react';
import { PersonalExpenseWrapper } from './PersonalExpense.styled';
import PersonalExpenseChatBot from './ChatBot/ChatBot';
import PersonalExpenseList from './PersonalExpenseList/PersonalExpenseList';



interface PersonalExpenseProps { }

const PersonalExpense: FC<PersonalExpenseProps> = () => (
  <PersonalExpenseWrapper>
    <PersonalExpenseChatBot></PersonalExpenseChatBot>
    <br></br>
    <PersonalExpenseList></PersonalExpenseList>
  </PersonalExpenseWrapper>
);

export default PersonalExpense;
