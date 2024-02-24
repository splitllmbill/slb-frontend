import styled from "styled-components";

export const CreateEventWrapper = styled.div`
margin: 0vh;
color: white;
width: 400px;
position:absolute;
font-size: larger;
right: 0;
top:0;
bottom:0;
background-color: #370342;
border:3px solid black;
border-radius: 8px;
padding-top:5px;
padding-left:10px;
padding-right:10px;
z-index:10000;
components: {
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          zIndex: 20000,
        },
      },
    },
  };
`;