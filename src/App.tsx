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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
