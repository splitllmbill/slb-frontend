import { FC } from 'react';
import { ContentArea, DashboardWrapper, HeaderWrapper } from './Dashboard.styled';
import SideNavBar from '../SideNavBar/SideNavBar';
import Header from '../Header/Header';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
   return (
      <>
         <HeaderWrapper>
            <Header></Header>
         </HeaderWrapper>
         <DashboardWrapper>
            <SideNavBar></SideNavBar>
            <ContentArea>HI</ContentArea>
         </DashboardWrapper>
      </>
   );
}

export default Dashboard;
