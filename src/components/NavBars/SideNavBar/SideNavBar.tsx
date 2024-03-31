import { FC, useEffect, useState } from 'react';
import { NavBar, SideNavBarWrapper } from './SideNavBar.styled';
import './SideNavBar.css';
import { MdDashboard } from "react-icons/md";
import { TiGroup, TiHome } from "react-icons/ti";
import { RiAccountBoxFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { itemRoutes, routeItems } from '../routes';


interface SideNavBarProps { }

const SideNavBar: FC<SideNavBarProps> = () => {
   const [activeItem, setActiveItem] = useState('');
   const [isSmallScreen, setIsSmallScreen] = useState(false);

   const navigate = useNavigate();
   const handleItemClick = (itemName: string) => {
      navigate(itemRoutes[itemName]);
      setActiveItem(itemName);
   };

   useEffect(() => {
      const handleResize = () => {
         setIsSmallScreen(window.innerWidth <= 500);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      const url = location.pathname;
      let [,navItem] = Object.entries(routeItems).find(([key, _]) => url.startsWith(key)) || [];
      if(navItem){
         setActiveItem(navItem);
      }
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [activeItem]);

   return (
      <>
         <SideNavBarWrapper>
            <NavBar className={!isSmallScreen ? 'show' : ''}>

               <div
                  className={`nav-item ${activeItem === 'Home' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Home')}
               >
                  <TiHome style={{ fontSize: 'x-large', marginRight: '10px' }}></TiHome >
                  Home
               </div>
               <div
                  className={`nav-item ${activeItem === 'Events' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Events')}
               >
                  <MdDashboard style={{ fontSize: 'x-large', marginRight: '10px' }}></MdDashboard>
                  Events
               </div>
               <div
                  className={`nav-item ${activeItem === 'Friends' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Friends')}
               >
                  <TiGroup style={{ fontSize: 'x-large', marginRight: '10px' }}></TiGroup>
                  Friends
               </div>
               <div
                  className={`nav-item ${activeItem === 'Personal Expenses' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Personal Expenses')}
               >
                  <BiMoneyWithdraw style={{ fontSize: 'x-large', marginRight: '10px' }}></BiMoneyWithdraw>
                  Personal Expenses
               </div>
               <div
                  className={`nav-item ${activeItem === 'Account' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Account')}
               >
                  <RiAccountBoxFill style={{ fontSize: 'x-large', marginRight: '10px' }}></RiAccountBoxFill>
                  Account
               </div>
            </NavBar>
         </SideNavBarWrapper>
      </>
   );
};

export default SideNavBar;
