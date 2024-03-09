import { FC } from 'react';
import { AppHeader, AppName, HeaderWrapper } from './Header.styled';
import { Stack } from 'react-bootstrap';
import logo from '../../assets/logo.png';

interface HeaderProps { }
const appName = 'splitLLM';

const Header: FC<HeaderProps> = () => (
   <HeaderWrapper>
      <AppHeader>
         <Stack direction="horizontal" gap={2}>
            <img src={logo} height={50} width={50} />
            <AppName>
               <b>{appName}</b>
            </AppName>

         </Stack>
      </AppHeader>
   </HeaderWrapper>
);

export default Header;
