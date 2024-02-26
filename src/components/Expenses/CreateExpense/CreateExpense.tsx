import { FC, useState } from "react";
import { Row } from "react-bootstrap";
import apiService from '../../../services/DataService';
import { Autocomplete, Button, Checkbox, Grid, Stack, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Events from "../../Events/Events";



interface CreateExpenseDrawerProps { 
    toggleCreateExpenseButton:()=>void;
    event: Partial<EventObject>
    users:User[]
}
 const CreateExpenseDrawer: FC<CreateExpenseDrawerProps> =({toggleCreateExpenseButton,event,users})=>{
    const currentUserId=localStorage.getItem('userId')
    const options = users.filter((user)=>event.users!.includes(user.id!))
    const currentUser=(options.filter((option)=>option.id==currentUserId))[0]
   
    const [expenseName,setExpenseName] = useState('')
    const [amount,setAmount] = useState(0)
    const[paidBy,setPaidBy] =useState<User>(currentUser)
    const [selectedUsers,setSelectedUsers] = useState<User[]>([])

    const handleCreateExpense =async ()=>{
        
        const shares=selectedUsers.map((selectedUser)=>{
            return {userId:selectedUser.id,amount:amount/(selectedUsers.length)}})
        const createExpenseObject={
            expenseName:expenseName,
            amount:amount,
            type:"group",
            paidBy:paidBy.id,
            eventId:event.id,
            category:"food",
            shares :shares,
        }
        try {
            const result = await apiService.createExpense(createExpenseObject as unknown as Expense)
            if (result) {
                    toggleCreateExpenseButton();
            }
         } catch (error) {
            // setAlertInfo({ open: true, severity: 'error', message: 'Unexpected error occured! Please try again.' });
            console.error('Unexpected error event creation:', error);

         }
    };
    const theme = createTheme({
        components: {
            MuiTypography:{
                styleOverrides:{
                    root:{
                        textTransform:'capitalize',
                    }
                }
            },
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
                inputRoot: {
                  // Ensure there's enough padding inside the input to accommodate the icon
                  paddingRight: '32px', // Adjust based on your icon size and desired spacing
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  color: 'black',
                  '&[class*="MuiInput-root"] .MuiAutocomplete-inputRoot': {
                    paddingRight: '32px', // This targets the actual input root inside the component
                  },
                },
                popper: {
                  zIndex: 20000,
                  color: 'black',
                },
              },
          },
        },
      });

      const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
       <div>
        <Row className="d-flex justify-content-end align-items-center text-end">
            <CloseIcon onClick={toggleCreateExpenseButton} style={{paddingTop:'0px', fontSize: '50px',fill: 'white',paddingBottom:'0px' }}/>
        </Row>
        <ThemeProvider theme={theme}>
        <Stack spacing={3} useFlexGap direction="column">
            <h3>Add a New Expense</h3>
            <TextField type="name" placeholder="Expense Name" onChange={(event) => setExpenseName(event.target.value)} value={expenseName} name="name" required />
            <Grid spacing={5} >
                    <Typography >Amount:</Typography>
                    <TextField type="number" placeholder="Expense Amount" onChange={(event) => setAmount(parseFloat(event.target.value))} value={amount} name="amount" required />
            </Grid>
            <Grid spacing={5} >
                    <Typography >Paid By:</Typography>
                    <Autocomplete
                    id="disable-clearable"
                    options={options}
                    onChange={(_,value)=>setPaidBy(value!)}
                    defaultValue={paidBy}
                    getOptionLabel={(option)=>option.name}
                    disableClearable
                    renderInput={(params) => (
                    <TextField {...params} placeholder="Enter the payee"/>
                    )}
                    />
            </Grid>
            <Grid spacing={5} >
            <Typography >Split equally among:</Typography>
            <Autocomplete
                multiple
                id="tags-outlined"
                options={options}
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
                    <TextField {...params}  placeholder="Add Users"/>
                    )}
            />    
            </Grid>
            
        </Stack>
        <Button variant="contained" onClick={handleCreateExpense}>Add</Button>
        </ThemeProvider>
        </div>
      
        
    );
}

export default CreateExpenseDrawer;