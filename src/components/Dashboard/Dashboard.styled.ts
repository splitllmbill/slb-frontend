import styled from 'styled-components';

export const DashboardWrapper = styled.div`
display:flex;
height:-webkit-fill-available;
padding-top: 70px;
`;

export const ContentArea = styled.div`
background-color: whitesmoke;
width:100%;
margin-right:0;
color: black;
overflow-y: auto;
height: webkit-fill-available;
`;

export const HeaderWrapper = styled.div`
background-color:white;
padding:10px;
color: #370342;
display: flex;
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 1000; /* Adjust z-index as needed */
`;

export const BottomNavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff; /* Add your background color */
  z-index: 1000; /* Adjust z-index as needed */
  /* Add other styling as needed */
`;

