import { KeyboardEventHandler, SetStateAction, useState } from 'react';
import { Button, ChatbotContainer, ChatbotWindow, Input, InputContainer, Message, ZoomOutTable } from './ChatBot.styled';
import logo from '../../../assets/logo.png';
import { PiUserCircleThin } from 'react-icons/pi';
import dataService from '../../../services/DataService';
import { convertTimestampToISO, personalExpenseAdded } from '../../../services/State';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Chatbot = () => {
   const [messages, setMessages] = useState<any[]>([
      { text: "Hi there! Please type your expense related details and I'll give you a structured format of the same which you can edit and add to your expenses!", sender: 'bot' },
   ]);
   const [input, setInput] = useState('');
   const [showTable, setShowTable] = useState(false);
   const [expenses, setExpenses] = useState<any[]>([]);
   const today = new Date();
   // const formattedDate = today.toLocaleDateString(); // Adjust the format as needed

   const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
      setInput(e.target.value);
   };

   const handleSendMessage = async () => {
      if (input.trim() === '') return;

      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      try {
         const botResponse = await dataService.addPersonalExpenseViaLLM(input);
         setMessages([...newMessages, { text: 'Here is a simple table of the expenses listed by you. Please make corrections to the data if necessary and click OKAY to add the expense!', sender: 'bot' }]);
         setExpenses(botResponse.llmoutput);
         setShowTable(true);
      } catch (error) {
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
            console.log("expenseData", expenseData);
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
      }
   };

   const handleTryAgain = () => {
      setShowTable(false);
      setMessages([messages[0]]);
   };

   const handleExpenseChange = (index: number, key: string, value: string) => {
      const updatedExpenses = [...expenses];
      updatedExpenses[index][key] = value;
      setExpenses(updatedExpenses);
      console.log(updatedExpenses);
   };

   return (
      <ChatbotContainer>
         <ChatbotWindow>
            {messages.map((message, index) => (
               <Message key={index}>
                  {message.sender === 'bot' && <img src={logo} height={50} width={50} />}
                  {message.sender === 'user' && <PiUserCircleThin style={{ color: '#370342', fontSize: '53px' }} />}
                  {message.text}
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
                                    <input
                                       type="text"
                                       className="small-input"
                                       value={row.name || row.Name}
                                       onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <input
                                       type="text"
                                       className="small-input"
                                       value={row.amount || row.Amount}
                                       onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <input
                                       type="text"
                                       className="small-input"
                                       value={row.category || row.Category}
                                       onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
                                    />
                                 </td>
                                 <td>
                                    <DatePicker
                                       selected={row.date ? new Date(row.date) : new Date()}
                                       onChange={(date: any) => handleExpenseChange(index, 'date', date)}
                                       className="small-input"
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
                     <Button onClick={handleAddExpense}>Okay (Add Expense)</Button>
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
         </InputContainer>
      </ChatbotContainer >
   );
};

export default Chatbot;
