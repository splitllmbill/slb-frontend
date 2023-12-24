import { FC } from 'react';
import { AppHeader, HeaderWrapper } from './Header.styled';
import { Stack } from 'react-bootstrap';
import logo from '../../assets/logo.png';

interface HeaderProps { }
const appName = 'SplitLLMBill';

const Header: FC<HeaderProps> = () => (
   <HeaderWrapper>
      <AppHeader>
         <Stack direction="horizontal" gap={2}>
            <img src={logo} height={50} width={50} />
            <h3><b>{appName}</b></h3>
         </Stack>
      </AppHeader>
   </HeaderWrapper>
);

export default Header;
