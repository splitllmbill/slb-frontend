import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {Autocomplete,TextField,Checkbox} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  StyledButton,
  StyledMenu,
  StyledMenuItem,
  StyledFormControl,
  StyledSelect,
} from './FilterMenuStyles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


// Define types for filter fields and filter criteria


// Mock data for filter fields
const filterFields: FilterField[] = [
  {
    name: 'category',
    type: 'dropdown',
  },
  {
    name: 'amount',
    type: 'range',
  },
  // You can add more fields as needed
];
type mapStringToString={
  [key: string]: string[]
}
interface DynamicFilterProps {
  applyFilter: (Filters:FilterCriteria[]) => void;
  filterOptions:mapStringToString;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({applyFilter,filterOptions}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const open = Boolean(anchorEl);

  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = () => {
    // Add a new filter criteria with default values
    setFilters([...filters, { field: '', operator: '', values: [] }]);
  };

  useEffect(()=>{
   let valid=true
    filters.map((filter)=>{
      if(filter.operator=="IN" && filter.values.length==0)
        valid=false
      else if (filter.operator=="BTW" && (filter.values[0]==''||filter.values[1]=='') )
        valid=false
    })
    if(valid){
      applyFilter(filters);
    }
   
  },[filters])

  const handleFieldChange = (index: number, fieldName: string) => {
    // Update the selected field for a specific filter criteria
    const updatedFilters = [...filters];
    const field = filterFields.find((field) => field.name === fieldName);
    if (field) {
      updatedFilters[index] = {
        ...updatedFilters[index],
        field: fieldName,
        operator: field.type=="dropdown"?"IN":"BTW",
        values: field.type === 'range' ? ['','']: [],
      };
      setFilters(updatedFilters);
    }
  };
  const convertToArray = (value: string | string[]): string[] => Array.isArray(value) ? value : [value];


  const handleDropdownChange = (index: number, selectedOptions: string[]) => {
    const updatedFilters = [...filters];
    updatedFilters[index].values = selectedOptions;
    setFilters(updatedFilters);
    
  };

  const handleRangeChange = (index: number, name: 'min' | 'max', value: string) => {
    const updatedFilters = [...filters];
    if(name=='min'){
        updatedFilters[index].values[0] = value
    }else{
        updatedFilters[index].values[1] =value 
    }
    setFilters(updatedFilters);
   
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  return (
    <Fragment>
      <StyledButton
        aria-controls="filter-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<FilterAltIcon />}
      >
      </StyledButton>
      <StyledMenu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
      >
      {filters.map((filter, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Row>
            <Col md={4}>
          <StyledFormControl fullWidth>
            <InputLabel id={`select-label-${index}`}>Select a field</InputLabel>
            <StyledSelect
              labelId={`select-label-${index}`}
              id={`select-${index}`}
              value={filter.field}
              label="Select a field"
              onChange={(e) => handleFieldChange(index, e.target.value as string)}
            >
              {filterFields.map((field) => (
                <StyledMenuItem key={field.name} value={field.name}>
                  {field.name}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </StyledFormControl>
          </Col>
          <Col md={7}>
          {filter.operator === 'IN' && (
            
            <StyledFormControl fullWidth>

              <Autocomplete
                        classes={{ endAdornment: 'MuiAutocomplete-endAdornment' }}
                        multiple
                        id="tags-outlined"
                        options={filterOptions[filter.field]}
                        onChange={(_,option) => handleDropdownChange(index,convertToArray(option))}
                        getOptionLabel={(option) => option}
                        disableCloseOnSelect
                        limitTags={1}
                        value={filter.values}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option}
                            </li>
                        )}
                        renderInput={(params) => {
                            console.log("params",params)
                            return <TextField {...params} placeholder="Select Filters.." />
                        }}
                    />
            </StyledFormControl>
            
          )}
          
          {filter.operator === 'BTW' && (
               <Box sx={{ display: 'flex' }}>
               <StyledFormControl fullWidth>
                 <OutlinedInput
                   type="number"
                   value={filter.values[0]}
                   onChange={(e) => handleRangeChange(index, 'min', e.target.value)}
                   placeholder="Min"
                 />
               </StyledFormControl>
               <StyledFormControl fullWidth>
                 <OutlinedInput
                   type="number"
                   value={filter.values[1]}
                   onChange={(e) => handleRangeChange(index, 'max', e.target.value)}
                   placeholder="Max"
                 />
               </StyledFormControl>
             </Box>
             )}
          
          </Col>
          <Col md={1}>
          <DeleteIcon onClick={() => handleRemoveFilter(index)} sx={{ mt: 2 }}/>
          </Col>
          </Row>
        </Box>
        
      ))}
      <StyledButton variant="contained" onClick={handleAddFilter} sx={{ mt: 2 }}>
        Add Filter
      </StyledButton>
      </StyledMenu>
    </Fragment>
  );
};

export default DynamicFilter;
