import { FC, useEffect, useState } from 'react';
import { NavBar, SideNavBarWrapper } from './SideNavBar.styled';
import './SideNavBar.css';

interface SideNavBarProps { }

const SideNavBar: FC<SideNavBarProps> = () => {
   const [activeItem, setActiveItem] = useState('Groups');
   const [isSmallScreen, setIsSmallScreen] = useState(false);

   const handleItemClick = (itemName: string) => {
      setActiveItem(itemName);
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
                  className={`nav-item ${activeItem === 'Groups' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Groups')}
               >
                  Groups
               </div>
               <div
                  className={`nav-item ${activeItem === 'Friends' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Friends')}
               >
                  Friends
               </div>
               <div
                  className={`nav-item ${activeItem === 'Personal Expenses' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Personal Expenses')}
               >
                  Personal Expenses
               </div>
               <div
                  className={`nav-item ${activeItem === 'Account' ? 'active' : ''}`}
                  onClick={() => handleItemClick('Account')}
               >
                  Account
               </div>
            </NavBar>
         </SideNavBarWrapper>
      </>
   );
};

export default SideNavBar;
