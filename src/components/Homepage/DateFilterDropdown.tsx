import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const DateFilterDropdown: React.FC = () => {
    const [dateRange, setDateRange] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setDateRange(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Date</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dateRange}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={30}>Last month</MenuItem>
                    <MenuItem value={60}>Last 2 months</MenuItem>
                    <MenuItem value={90}>Last 3 months</MenuItem>
                    <MenuItem value={180}>Last 6 months</MenuItem>
                    <MenuItem value={360}>Last year</MenuItem>
                    <MenuItem value={0}>All</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default DateFilterDropdown;