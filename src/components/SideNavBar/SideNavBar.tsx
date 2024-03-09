import { FC, useEffect, useState } from 'react';
import { NavBar, SideNavBarWrapper } from './SideNavBar.styled';
import './SideNavBar.css';
import { MdDashboard } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { RiAccountBoxFill } from "react-icons/ri";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


interface SideNavBarProps {
   onSelectContent: (content: string) => void;
}

const SideNavBar: FC<SideNavBarProps> = ({ onSelectContent }) => {
   const [activeItem, setActiveItem] = useState('Events');
   const [isSmallScreen, setIsSmallScreen] = useState(false);

   const navigate = useNavigate();
   const handleItemClick = (itemName: string) => {
      setActiveItem(itemName);
      onSelectContent(itemName);
      navigate('/home');
   };
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
         <SideNavBarWrapper>
            <NavBar className={!isSmallScreen ? 'show' : ''}>
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
                  <FaMoneyBill1Wave style={{ fontSize: 'x-large', marginRight: '10px' }}></FaMoneyBill1Wave>
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
