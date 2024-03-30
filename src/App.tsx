import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<Login />} />
        <Route path="home" element={<Dashboard />} />
        <Route path="friend/:friendId"  element={<Dashboard/>} />
        <Route path="createEvent"  element={<Dashboard/>} />
        <Route path="event/:eventId"  element={<Dashboard/>} />
        <Route path="event/:eventId/edit"  element={<Dashboard/>} />
        <Route path="createExpense/:type/:id"  element={<Dashboard/>} />
        <Route path="expense/:expenseId"  element={<Dashboard/>} />
        <Route path="shareBill/:expenseType"  element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
