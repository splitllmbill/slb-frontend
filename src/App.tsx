import React, { Suspense, ComponentType } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
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

const Login = lazyComponent(() => import('./components/Login/Login'));
const Dashboard = lazyComponent(() => import('./components/Dashboard/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<Login />} />
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
        <Route path="expense/:expenseId/edit"  element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
