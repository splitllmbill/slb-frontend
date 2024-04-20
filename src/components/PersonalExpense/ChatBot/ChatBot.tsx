import { KeyboardEventHandler, SetStateAction, useState } from 'react';
import { ChatbotContainer, ChatbotWindow, Input, InputContainer, Message, ZoomOutTable, StyledDatePicker } from './ChatBot.styled';
import logo from '../../../assets/logo.png';
import { PiUserCircleThin } from 'react-icons/pi';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import dataService from '../../../services/DataService';
import { convertTimestampToISO, personalExpenseAdded } from '../../../services/State';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../../../App.styled';
import { IoMdArrowUp } from 'react-icons/io';

const Chatbot = () => {
   const [messages, setMessages] = useState<any[]>([
      { text: "Hi there! Please type your expense related details and I'll give you a structured format of the same which you can edit and add to your expenses!", sender: 'bot' },
   ]);
   const [input, setInput] = useState('');
   const [showTable, setShowTable] = useState(false);
   const [loading, setLoading] = useState(false);
   const [expenses, setExpenses] = useState<any[]>([]);
   const today = new Date();

   const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
      setInput(e.target.value);
   };

   const handleSendMessage = async () => {
      if (input.trim() === '') return;
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');
      setMessages([...newMessages, { text: 'Please wait while your request is being processed...', sender: 'bot' }]);
      try {
         const botResponse = await dataService.addPersonalExpenseViaLLM(input);
         setMessages([...newMessages, { text: 'Here is a simple table of the expenses listed by you. Please make corrections to the data if necessary and click OKAY to add the expense!', sender: 'bot' }]);
         const expensesWithDate = botResponse.llmoutput.map((item: any) => ({ ...item, date: new Date() }));
         setExpenses(expensesWithDate);
         setShowTable(true);
      } catch (error) {
         setMessages([...newMessages, { text: 'Unexpected error occured. Please try again later!', sender: 'bot' }]);
         console.error('Error handling chatbot response:', error);
      }
   };

   const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      const keyboardEvent = event as React.KeyboardEvent<HTMLInputElement>;
      const { key, currentTarget } = keyboardEvent;
      const inputTarget = currentTarget as HTMLInputElement;
      if (key === 'Enter' && document.activeElement === inputTarget) {
         handleSendMessage();
      }
   };

   const handleAddExpense = async () => {
      try {
         setLoading(true);
         for (const exp of expenses) {
            let expenseData = {
               expenseName: exp.name,
               amount: exp.amount,
               type: 'normal',
               paidBy: "",
               shares: [],
               createdAt: today,
               updatedAt: today,
               createdBy: "",
               updatedBy: "",
               category: exp.category || null,
               date: convertTimestampToISO(exp.date)
            } as Expense;
            const createdExpense = await dataService.createExpense(expenseData as Expense);
            console.log('Expense created successfully:', createdExpense);
         }
         personalExpenseAdded.next();
         setShowTable(false);
         setMessages([...messages, { text: 'Expense added ' + input, sender: 'bot' }]);
      } catch (error) {
         console.error('Error creating expense:', error);
         setShowTable(false);
         setMessages([...messages, { text: 'An error occured ', sender: 'bot' }]);
      } finally {
         setLoading(false);
      }
   };

   const handleTryAgain = () => {
      setShowTable(false);
      setMessages([messages[0]]);
   };

   const handleExpenseChange = (index: number, key: string, value: any) => {
      const updatedExpenses = [...expenses];
      updatedExpenses[index][key] = value;
      setExpenses(updatedExpenses);
   };

   const copyMessage = (text: string) => {
      setInput(text);
   }

   return (
      <ChatbotContainer>
         <ChatbotWindow>
            {messages.map((message, index) => (
               <Message key={index}>
                  {message.sender === 'bot' && <img src={logo} height={50} width={50} />}
                  {message.sender === 'user' && <PiUserCircleThin style={{ color: '#370342', fontSize: '53px' }} />}
                  {message.text}
                  {message.sender === 'user' && 
                     <Tooltip title="Copy to new message ">
                        <IconButton
                           size="small"
                           style={{ width: 'auto', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                           onClick={() => copyMessage(message.text)}
                        >
                           <ContentCopyOutlinedIcon style={{ color: 'black' }} />
                        </IconButton>
                     </Tooltip>
                  }
               </Message>
            ))}
            <div>
               {showTable && (
                  <Message key='-1'>
                     <img src={logo} height={50} width={50} />
                     <ZoomOutTable striped bordered hover>
                        <thead>
                           <tr>
                              <th><b>Expense</b></th>
                              <th><b>Cost</b></th>
                              <th><b>Category</b></th>
                              <th><b>Date</b></th>
                           </tr>
                        </thead>
                        <tbody>
                           {expenses.map((row, index) => (
                              <tr key={index}>
                                 <td>
                                    <Input
                                       type="text"
                                       value={row.name || row.Name}
                                       onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <Input
                                       type="text"
                                       value={row.amount || row.Amount}
                                       onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <Input
                                       type="text"
                                       value={row.category || row.Category}
                                       onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <StyledDatePicker
                                       selected={row.date ? new Date(row.date) : new Date()}
                                       onChange={(date) => handleExpenseChange(index, 'date', date)}
                                    />

                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </ZoomOutTable>
                  </Message>
               )}
               {showTable && (
                  <Message>
                     <Button onClick={handleAddExpense} disabled={loading}>Okay (Add Expense)</Button>
                     <Button onClick={handleTryAgain}>Try Again</Button>
                  </Message>
               )}
            </div>
         </ChatbotWindow>
         <InputContainer>
            <Input
               type="text"
               placeholder="Type your expenses.."
               value={input}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
               disabled={showTable} // Disable the input field when showTable is true
            />
            <IoMdArrowUp style={{ fontSize: "xx-large", marginRight: '15px', cursor: "pointer" }} onClick={handleSendMessage}></IoMdArrowUp >
         </InputContainer>
      </ChatbotContainer >
   );
};

export default Chatbot;
