import React, { Suspense, ComponentType, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { checkTokenValidity } from './components/Auth/auth';
import Login from './components/Login/Login';
import './App.css';

type ImportFunction<T> = () => Promise<{ default: ComponentType<T> }>;
type Props = Record<string, unknown>;
const LoadingFallback = () => <div className="d-flex justify-content-center align-items-center vh-100"><CircularProgress color="secondary" variant="indeterminate" /></div>;

const lazyComponent = <T extends Props>(importFunction: ImportFunction<T>) => {
  const LazyComponent = React.lazy(importFunction);
  return (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

const Dashboard = lazyComponent(() => import('./components/Dashboard/Dashboard'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    setIsAuthenticated(checkTokenValidity());
  }, [refresh]);

  const handleLogin = () => {
    setRefresh(!refresh);
  }

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Login loginRefresh={handleLogin} />} />
          <Route path="*" element={<Login loginRefresh={handleLogin} />} />
        {
          isAuthenticated ? (
          <>
            <Route path="home" element={<Dashboard />} />
            <Route path="events" element={<Dashboard />} />
            <Route path="friends" element={<Dashboard />} />
            <Route path="personal-expenses" element={<Dashboard />} />
            <Route path="user-account" element={<Dashboard />} />
            <Route path="friend/:friendId" element={<Dashboard />} />
            <Route path="create-event" element={<Dashboard />} />
            <Route path="event/:eventId" element={<Dashboard />} />
            <Route path="event/:eventId/edit" element={<Dashboard />} />
            <Route path="createExpense/:type/:id" element={<Dashboard />} />
            <Route path="expense/:expenseId" element={<Dashboard />} />
            <Route path="shareBill/:expenseType" element={<Dashboard />} />
          </>
        ) : null}
      </Routes>
    </BrowserRouter>
  );
}

export default App;