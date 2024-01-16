import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
