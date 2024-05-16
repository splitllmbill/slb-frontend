import React, { FC, useState } from 'react';
import { PersonalExpenseWrapper } from './PersonalExpense.styled';
import PersonalExpenseChatBot from './ChatBot/ChatBot';
import PersonalExpenseList from './PersonalExpenseList/PersonalExpenseList';
import CustomSnackbar from '../Common/SnackBar/SnackBar';

interface PersonalExpenseProps { }

const PersonalExpense: FC<PersonalExpenseProps> = () => {
  const [snackBarState, setSnackBarState] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

  const handleClose = () => {
    setSnackBarState({ open: false, message: "" });
  };

  const handleMessageFromModal = (message: string) => {
    setSnackBarState({ open: true, message: message }); // Update the snackbar state with the message
  };

  return (
    <PersonalExpenseWrapper>
      <CustomSnackbar message={snackBarState.message} handleClose={handleClose} open={snackBarState.open} />
      <PersonalExpenseChatBot handleMessage={handleMessageFromModal} />
      <br />
      <PersonalExpenseList />
    </PersonalExpenseWrapper>
  );
};

export default PersonalExpense;
