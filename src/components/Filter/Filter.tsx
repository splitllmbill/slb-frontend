import React, { Fragment, useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Autocomplete, TextField, Checkbox, Typography } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { toTitleCase } from '../../services/State';

import {
  StyledButton,
  StyledMenu,
  StyledFormControl,
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
type mapStringToString = {
  [key: string]: string[]
}
interface DynamicFilterProps {
  applyFilter: (Filters: FilterCriteria[]) => void;
  filterOptions: mapStringToString;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({ applyFilter, filterOptions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilters = () => {
    const validFilters = filters.filter((filter) => {
      if (filter.operator === 'BTW') {
        if (filter.values[0] === '' && filter.values[1] === '') {
          return false;
        }
        if (filter.values[0] === '' || filter.values[1] === '') {
          if (filter.values[0] === '') filter.values[0] = 'MIN';
          if (filter.values[1] === '') filter.values[1] = 'MAX';
        }
      }
      if (filter.operator === 'IN' && filter.values.length == 0)
        return false;
      return true;
    })
    if (validFilters && validFilters.length != 0) {
      applyFilter(validFilters);
    }
    setAnchorEl(null);

  }

  useEffect(() => {
    const initialFilters = filterFields.map((filter) => ({
      field: filter.name,
      operator: filter.type == "dropdown" ? "IN" : "BTW",
      values: filter.type == "dropdown" ? [] : ['', '']
    }))
    setFilters(initialFilters)
  }, [])

  const convertToArray = (value: string | string[]): string[] => Array.isArray(value) ? value : [value];

  const handleDropdownChange = (index: number, selectedOptions: string[]) => {
    const updatedFilters = [...filters];
    updatedFilters[index].values = selectedOptions;
    setFilters(updatedFilters);
  };

  const handleRangeChange = (index: number, name: 'min' | 'max', value: string) => {
    const updatedFilters = [...filters];
    if (name == 'min') {
      updatedFilters[index].values[0] = value
    } else {
      updatedFilters[index].values[1] = value
    }
    setFilters(updatedFilters);

  };

  return (
    <Fragment >
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
            <Row sx={{ width: '250px' }}>
              <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {toTitleCase(filter.field)}
              </Typography>
              {filter.operator === 'IN' && (
                <StyledFormControl>
                  <Autocomplete
                    sx={{
                      marginRight: '20px',
                      marginTop: '5px',
                      marginLeft: '8px'
                    }}
                    multiple
                    options={filterOptions[filter.field]}
                    onChange={(_, option) => handleDropdownChange(index, convertToArray(option))}
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
                        {toTitleCase(option)}
                      </li>
                    )}
                    renderInput={(params) => {
                      return <TextField {...params} placeholder="Select Filters.." />
                    }}
                  />
                </StyledFormControl>
              )}
              {filter.operator === 'BTW' && (
                <Box sx={{ display: 'flex', marginRight: '20px' }}>
                  <StyledFormControl>
                    <OutlinedInput
                      sx={{ width: '100%' }}
                      type="number"
                      value={filter.values[0]}
                      onChange={(e) => handleRangeChange(index, 'min', e.target.value)}
                      placeholder="Min"
                    />
                  </StyledFormControl>
                  <StyledFormControl >
                    <OutlinedInput sx={{ width: '100%', marginRight: '20px' }}
                      type="number"
                      value={filter.values[1]}
                      onChange={(e) => handleRangeChange(index, 'max', e.target.value)}
                      placeholder="Max"
                    />
                  </StyledFormControl>
                </Box>
              )}
            </Row>
          </Box>

        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <StyledButton variant="contained" onClick={handleApplyFilters} sx={{ marginRight: '5px', width: '20px' }}>
            Apply
          </StyledButton>
        </div>
      </StyledMenu>
    </Fragment>
  );
};

export default DynamicFilter;
