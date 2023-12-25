import { FC } from 'react';
import { PersonalExpenseWrapper } from './PersonalExpense.styled';
import PersonalExpenseChatBot from './ChatBot/ChatBot';



interface PersonalExpenseProps {}

const PersonalExpense: FC<PersonalExpenseProps> = () => (
 <PersonalExpenseWrapper>
   <PersonalExpenseChatBot></PersonalExpenseChatBot>
 </PersonalExpenseWrapper>
);

export default PersonalExpense;
