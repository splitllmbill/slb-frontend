import React, { FC, useEffect, useState } from 'react';
import { BottomNavWrapper, ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import SideNavBar from '../SideNavBar/SideNavBar';
import Header from '../Header/Header';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import PersonalExpense from '../PersonalExpense/PersonalExpense';
import Events from '../Events/Events';
import AccountPage from '../Account/AccountPage';
import FriendsPage from '../Friends/FriendsPage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FriendDetail from '../Friends/FriendDetail/FriendDetail';
import CreateEventDrawer from '../Events/CreateEventDrawer/CreateEventDrawer';
import EventDetail from '../Events/EventDetail/EventDetail';
import CreateExpenseDrawer from '../Expenses/CreateExpense/CreateExpense';
import ExpenseDetail from '../Expenses/ExpenseDetail/ExpenseDetail';
import { MdDashboard } from 'react-icons/md';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { RiAccountBoxFill } from 'react-icons/ri';
import { TiGroup } from 'react-icons/ti';
import ShareBill from '../Expenses/ShareBill/ShareBill';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>(() => localStorage.getItem('selectedContent') || 'Events');
  const [value, setValue] = useState(selectedContent);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedContent', selectedContent);
    setValue(selectedContent); // Ensure value is updated along with selectedContent
  }, [selectedContent]);

  const handleNavigationChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedContent(newValue);
    navigate('/home');
  };

  const { eventId } = useParams<{ eventId: string }>();

  const { expenseId } = useParams<{ expenseId: string }>();
  // const queryParams = new URLSearchParams(window.location.search);
  // queryParams.set('friendId', friendId!);
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
          {(selectedContent === 'Events' && location.pathname.startsWith('/createEvent')) && <CreateEventDrawer eventID='' />}

          {(selectedContent === 'Events' && location.pathname.startsWith('/event') && location.pathname.endsWith('edit')) && !location.pathname.includes('expense') && <CreateEventDrawer eventID={eventId == undefined ? "" : eventId} />}
          {(selectedContent === 'Events' && location.pathname.startsWith('/event')) && !location.pathname.endsWith('edit') && <EventDetail />}
          {(selectedContent === 'Events' && location.pathname.startsWith('/home')) && <Events currentEventID='' />}
          {(selectedContent === 'Events' || selectedContent === 'Friends') && (location.pathname.startsWith('/createExpense')) && <CreateExpenseDrawer expenseId='' />}
          {location.pathname.startsWith('/expense/')  &&  location.pathname.endsWith('edit')  && <CreateExpenseDrawer expenseId={expenseId == undefined ? "" : expenseId} />}
          {(location.pathname.startsWith('/expense/')) && !location.pathname.endsWith('edit') && <ExpenseDetail />}
          {(selectedContent === 'Events' || selectedContent === 'Friends') && location.pathname.startsWith('/shareBill') && <ShareBill />}
          {selectedContent === 'Personal Expenses' && <PersonalExpense />}
          {selectedContent === 'Account' && <AccountPage />}
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
