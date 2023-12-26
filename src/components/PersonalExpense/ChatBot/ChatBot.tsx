import React, { SetStateAction, useState } from 'react';
import { Button, ChatbotContainer, ChatbotWindow, Input, InputContainer, Message, Table } from './ChatBot.styled';
import logo from '../../../assets/logo.png';
import { PiUserCircleThin } from 'react-icons/pi';

const Chatbot = () => {
   const [messages, setMessages] = useState<any[]>([
      { text: "Hi there! Please type your expense related details and I'll give you a structured format of the same which you can edit and add to your expenses!", sender: 'bot' },
   ]);
   const [input, setInput] = useState('');
   const [showTable, setShowTable] = useState(false);

   const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
      setInput(e.target.value);
   };

   const handleSendMessage = () => {
      if (input.trim() === '') return;

      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      // Simulate a response from the chatbot
      setTimeout(() => {
         const botResponse = { text: 'You said: ' + input, sender: 'bot' };
         setMessages([...newMessages, botResponse]);
         setShowTable(true);
      }, 500);
   };

   const handleKeyDown = (e: { key: string; target: Element | null }) => {
      if (e.key === 'Enter' && document.activeElement === e.target) {
         // Check if the Enter key is pressed and the input has focus
         handleSendMessage();
      }
   };

   const handleAddExpense = () => {
      // Add logic to handle adding expense to your data structure
      console.log('Expense added:', input);

      // Optionally, reset the table and showTable state
      setShowTable(false);
      setMessages([...messages, { text: 'Expense added ' + input, sender: 'bot' }]);
   };

   const handleTryAgain = () => {
      setShowTable(false);
      // You may want to reset the input or other relevant state here
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
                     <Table contentEditable="true">
                        <thead>
                           <tr>
                              <TH contentEditable="false"><b>Expense</b></TH>
                              <TH contentEditable="false"><b>Cost</b></TH>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <TD contentEditable="true">Type your expense</TD>
                              <TD contentEditable="true">Type the cost</TD>
                           </tr>
                        </tbody>
                     </Table>
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
               placeholder="Type your message..."
               value={input}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
            />
         </InputContainer>
      </ChatbotContainer>
   );
};

export default Chatbot;
