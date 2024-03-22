import React, { FC, useEffect, useState } from 'react';
import { BottomNavWrapper, ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import SideNavBar from '../SideNavBar/SideNavBar';
import Header from '../Header/Header';
import { BottomNavigation } from '@mui/material';
import { BottomNavigationAction } from '@mui/material';
import PersonalExpense from '../PersonalExpense/PersonalExpense';
import Events from '../Events/Events';
import Accountpage from '../Account/AccountPage';
import FriendsPage from '../Friends/FriendsPage';
import { useLocation } from 'react-router-dom';
import FriendDetail from '../Friends/FriendDetail/FriendDetail';
import CreateEventDrawer from '../Events/CreateEventDrawer/CreateEventDrawer';
import EventDetail from '../Events/EventDetail/EventDetail';
import CreateExpenseDrawer from '../Expenses/CreateExpense/CreateExpense';
import ExpenseDetail from '../Expenses/ExpenseDetail/ExpenseDetail';
import { MdDashboard } from 'react-icons/md';
import { BiMoneyWithdraw } from "react-icons/bi";
import { RiAccountBoxFill } from 'react-icons/ri';
import { TiGroup } from 'react-icons/ti';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('Events'); // Initial selected content
  const [value, setValue] = useState('Events');

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    if (location.pathname.startsWith('/friend')) {
      setSelectedContent('Friends');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigationChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
    setSelectedContent(newValue);
  };

  return (
    <>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>

      <DashboardWrapper>
        {!isSmallScreen && <SideNavBar onSelectContent={setSelectedContent} />}
        <ContentArea>
          {(selectedContent === 'Friends' && location.pathname.startsWith('/friend')) && <FriendDetail />}
          {(selectedContent === 'Friends' && location.pathname.startsWith('/home')) && <FriendsPage />}

          {(selectedContent === 'Events' && location.pathname.startsWith('/createEvent')) && <CreateEventDrawer />}
          {(selectedContent === 'Events' && location.pathname.startsWith('/event')) && <EventDetail />}
          {(selectedContent === 'Events' && location.pathname.startsWith('/home')) && <Events currentEventID='' />}

          {(location.pathname.startsWith('/createExpense')) && <CreateExpenseDrawer />}
          {(location.pathname.startsWith('/expense/')) && <ExpenseDetail />}

          {selectedContent === 'Personal Expenses' && <PersonalExpense />}
          {selectedContent === 'Account' && <Accountpage />}
        </ContentArea>
      </DashboardWrapper>

      <BottomNavWrapper>
        {isSmallScreen && (
          <BottomNavigation showLabels value={value} onChange={handleNavigationChange}>
            <BottomNavigationAction label="Events" icon={<MdDashboard />} value="Events" />
            <BottomNavigationAction label="Friends" icon={<TiGroup />} value="Friends" />
            <BottomNavigationAction label="Personal Expenses" icon={<BiMoneyWithdraw />} value="Personal Expenses" />
            <BottomNavigationAction label="Account" icon={<RiAccountBoxFill />} value="Account" />
          </BottomNavigation>
        )}
      </BottomNavWrapper>
    </>
  );
};

export default Dashboard;
