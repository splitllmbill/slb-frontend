import { FC, useEffect, useState } from 'react';
import { BottomNavWrapper, ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import Header from '../Header/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Homepage from '../Homepage/Homepage';
import FriendsPage from '../Friends/FriendsPage';
import CreateEventDrawer from '../Events/CreateEventDrawer/CreateEventDrawer';
import EventDetail from '../Events/EventDetail/EventDetail';
import Events from '../Events/Events';
import CreateExpenseDrawer from '../Expenses/CreateExpense/CreateExpense';
import ExpenseDetail from '../Expenses/ExpenseDetail/ExpenseDetail';
import ShareBill from '../Expenses/ShareBill/ShareBill';
import PersonalExpense from '../PersonalExpense/PersonalExpense';
import AccountPage from '../Account/AccountPage';
import SideNavBar from '../NavBars/SideNavBar/SideNavBar';
import BottomNavBar from '../NavBars/BottomNavBar/BottomNavBar';
import FriendDetail from '../Friends/FriendDetail/FriendDetail';
import { selectedContent } from '../../services/State';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const location = useLocation();

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

  const { eventId } = useParams<{ eventId: string }>();

  return (
    <>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>

      <DashboardWrapper>
        {!isSmallScreen && <SideNavBar />}
        <ContentArea>
          {location.pathname.startsWith('/friends') && <FriendsPage />}
          {location.pathname.startsWith('/friend/') && <FriendDetail />}
          {location.pathname.startsWith('/home') && <Homepage />}
          {location.pathname.startsWith('/create-event') && <CreateEventDrawer eventID='' />}
          {location.pathname.startsWith('/event/') && !location.pathname.endsWith('edit') && <EventDetail />}
          {location.pathname.startsWith('/event/') && location.pathname.endsWith('edit') && <CreateEventDrawer eventID={eventId || ""} />}
          {location.pathname.startsWith('/events') && <Events currentEventID='' />}
          {location.pathname.startsWith('/create-expense') && <CreateExpenseDrawer />}
          {location.pathname.startsWith('/expense/') && <ExpenseDetail />}
          {location.pathname.startsWith('/share-bill') && <ShareBill />}
          {location.pathname === '/personal-expenses' && <PersonalExpense />}
          {location.pathname === '/user-account' && <AccountPage />}
        </ContentArea>
      </DashboardWrapper>

      <BottomNavWrapper>
        {isSmallScreen && <BottomNavBar />}
      </BottomNavWrapper>
    </>
  );
};

export default Dashboard;
