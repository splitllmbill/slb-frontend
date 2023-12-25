import styled from 'styled-components';

export const SideNavBarWrapper = styled.div`
display: none;
width:20%;
@media (min-width: 500px) {
    display: block;
}
background-color: #370342;
`;

export const NavBar = styled.div`
display: flex;
flex-direction: column;
padding: 10px;
gap:10px;
}
`;