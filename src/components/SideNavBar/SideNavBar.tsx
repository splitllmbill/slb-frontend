import { FC, useState } from 'react';
import { SideNavBarWrapper } from './SideNavBar.styled';
interface SideNavBarProps { }

const SideNavBar: FC<SideNavBarProps> = () => {
   const [activeItem, setActiveItem] = useState('Home');

   const handleItemClick = (itemName: string) => {
      setActiveItem(itemName);
      // You can add additional logic here when an item is clicked
   };

   return (
      <SideNavBarWrapper>
         HIIII
      </SideNavBarWrapper>
   );
};

export default SideNavBar;
