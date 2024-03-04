import React, { FC, useEffect, useState } from 'react';
import { BottomNavWrapper, ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import SideNavBar from '../SideNavBar/SideNavBar';
import Header from '../Header/Header';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { GrGroup } from 'react-icons/gr';
import { FaUserFriends } from 'react-icons/fa';
import { IoPersonCircle } from 'react-icons/io5';
import { BottomNavigation } from '@mui/material';
import { BottomNavigationAction } from '@mui/material';
import PersonalExpense from '../PersonalExpense/PersonalExpense';
import Events from '../Events/Events';
import Accountpage from '../Account/AccountPage';
import FriendsPage from '../Friends/FriendsPage';
import { useLocation } from 'react-router-dom';
import FriendDetail from '../Friends/FriendDetail/FriendDetail';

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
          {selectedContent === 'Events' && <Events currentEventID='' />}
          {(selectedContent === 'Friends'&& location.pathname.startsWith('/home')) && <FriendsPage />}
          {selectedContent === 'Personal Expenses' && <PersonalExpense />}
          {selectedContent === 'Account' && <Accountpage />}
        </ContentArea>
      </DashboardWrapper>

      <BottomNavWrapper>
        {isSmallScreen && (
          <BottomNavigation showLabels value={value} onChange={handleNavigationChange}>
            <BottomNavigationAction label="Events" icon={<GrGroup />} value="Events" />
            <BottomNavigationAction label="Friends" icon={<FaUserFriends />} value="Friends" />
            <BottomNavigationAction label="Personal Expenses" icon={<BiMoneyWithdraw />} value="Personal Expenses" />
            <BottomNavigationAction label="Account" icon={<IoPersonCircle />} value="Account" />
          </BottomNavigation>
        )}
      </BottomNavWrapper>
    </>
  );
};

export default Dashboard;
