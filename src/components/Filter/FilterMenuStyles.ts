// FilterMenuStyles.ts
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const StyledButton = styled(Button)({
  color: '#fff', // Adjust the color to fit your theme
  backgroundColor: 'black', // Example color
  '&:hover': {
    backgroundColor: 'grey',
  },

});

export const StyledMenu = styled(Menu)`
& .MuiPaper-root {
  overflow: hidden;
  transform: translateX(10px);
  border-radius: 8px;
  margin-top: 8px;
  margin-right :20px;
  min-width: 300px; // Adjust for mobile devices
  max-width: 300px; // Adjust for mobile devices
  height:275px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    padding: 20px 20px 20px 20px;
  }
  & .MuiMenuItem-root {
    &:hover {
      background-color: #f4f4f4;
    }
  }
}r-root {
    min-width: 300px; // Adjust for mobile devices
    max-width: 300px; // Adjust for mobile devices
  }
}
`;

export const StyledMenuItem = styled(MenuItem)({
  // Add styles for menu items if needed
});

export const StyledFormControl = styled(FormControl)({
  marginRight: '8px', // Spacing around the form control // Minimum width of the form controls
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem', // Label font size
  },
  '& .MuiSelect-select': {
    fontSize: '0.875rem', // Select font size
  },
});

export const StyledSelect = styled(Select)({
  // Additional styling for selects if needed
});