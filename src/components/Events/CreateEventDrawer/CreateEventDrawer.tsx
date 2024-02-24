import { FC, useState } from "react";
import { CreateEventWrapper } from "./CreateEventDrawer.styled";
import { Row } from "react-bootstrap";
import apiService from '../../../services/DataService';
import { Autocomplete, Button, Checkbox, Stack, TextField, ThemeProvider, createTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';



interface CreateEventDrawerProps { 
    toggleCreateEventButton:()=>void;
    users: User[]
}
 const CreateEventDrawer: FC<CreateEventDrawerProps> =({toggleCreateEventButton,users})=>{
    const currentUserId=localStorage.getItem('userId')
    const [eventName,setEventName] = useState('')
    const [selectedUsers,setSelectedUsers] = useState<User[]>([])

    const handleCreateEvent =async ()=>{
        const createEventObject={
            eventName:eventName,
            users:[`${localStorage.getItem('userId')}`,...(selectedUsers.map(selectedUser=>selectedUser.id!))],
        }
        try {
            const result = await apiService.createEvent(createEventObject as unknown as EventObject)
            if (result) {
                    setEventName('');
                    toggleCreateEventButton();
            }
         } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

         }
    };
    const theme = createTheme({
        components: {
            MuiButton:{
                styleOverrides: {
                    root:{
                        position:'absolute',
                    bottom:20,
                    },
                    
                }
            },
            MuiTextField: {
                styleOverrides: {
                  root: {
                    borderRadius:'15px',
                    backgroundColor:'white',
                    color:'black',
                  },
                },
            },
          MuiAutocomplete: {
          
            styleOverrides: {
                root:{
                    color:'black',
                    height:'40px',
                },
                listbox: {
                    // Styles applied to the listbox component
                    backgroundColor: '#f5f5f5', // Change the background color of the dropdown
                    borderRadius: '4px', 
                    // Round corners of the dropdown menu
                    },
                inputRoot:{
                    backgroundColor:'white',
                    borderRadius:'15px',
                    zIndex:2000,
                    color:'black',
                },
                popper: {
                    zIndex: 20000,
                    color:'black',
                    height:'40px',
                },
            },
          },
        },
      });

      const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
       
            <CreateEventWrapper >
            <Row className="d-flex justify-content-end align-items-center text-end">
                <CloseIcon onClick={toggleCreateEventButton} style={{paddingTop:'0px', fontSize: '50px',fill: 'white',paddingBottom:'0px' }}/>
            </Row>
            <ThemeProvider theme={theme}>
            <Stack spacing={2} useFlexGap direction="column">
                <h3>Add a New Event</h3>
                
                    <TextField type="name" placeholder="Event Name" onChange={(event) => setEventName(event.target.value)} value={eventName} name="name" required />
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={users.filter((user)=>user.id!=currentUserId)}
                        onChange={(_,value)=>setSelectedUsers(value)}
                        getOptionLabel={(option)=>option.name}
                        defaultValue={[]}
                        disableCloseOnSelect
                        limitTags={4}
                        // isOptionEqualToValue=
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.name}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField {...params}  placeholder="Add Users" />
                          )}
                    />
                    
                
            </Stack>
            <Button variant="contained" onClick={handleCreateEvent}>Add</Button>
            </ThemeProvider>
        </CreateEventWrapper>
      
        
    );
}

export default CreateEventDrawer;