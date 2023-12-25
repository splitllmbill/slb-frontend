import { FC, useEffect, useState } from 'react';
import { BottomNavWrapper, ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import SideNavBar from '../SideNavBar/SideNavBar';
import Header from '../Header/Header';
import { BiMoneyWithdraw } from "react-icons/bi";
import { GrGroup } from "react-icons/gr";
import { FaUserFriends } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { BottomNavigation } from '@mui/material';
import { BottomNavigationAction } from '@mui/material';


interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
   const [isSmallScreen, setIsSmallScreen] = useState(false);
   const [value, setValue] = useState('Groups');

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

   return (
      <>
         <HeaderWrapper>
            <Header></Header>
         </HeaderWrapper>

         <DashboardWrapper>
            {!isSmallScreen && <SideNavBar />}
            <ContentArea isSmallScreen={isSmallScreen}>

            </ContentArea>
         </DashboardWrapper>
         <BottomNavWrapper>
            {isSmallScreen && <BottomNavigation
               showLabels
               value={value}
               onChange={(_event, newValue) => {
                  setValue(newValue);
               }}
            >
               <BottomNavigationAction label="Groups" icon={<GrGroup />} />
               <BottomNavigationAction label="Friends" icon={<FaUserFriends />} />
               <BottomNavigationAction label="Personal" icon={<BiMoneyWithdraw />} />
               <BottomNavigationAction label="Account" icon={<IoPersonCircle />} />
            </BottomNavigation>}
         </BottomNavWrapper>
      </>
   );
}

export default Dashboard;
