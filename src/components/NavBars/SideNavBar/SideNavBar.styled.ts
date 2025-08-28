import styled from 'styled-components';

export const SideNavBarWrapper = styled.div`
  display: none;
  width: 280px;
  height: 100vh;
  background: #dce3ee;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  @media (min-width: 500px) {
    display: block;
  }
`;

export const NavBar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 10px;
`;
