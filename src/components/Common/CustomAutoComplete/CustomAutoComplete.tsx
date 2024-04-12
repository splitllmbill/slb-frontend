import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

interface CustomAutocompleteProps<T> {
  options: T[];
  onChange: (values: T[]) => void;
  value: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
}

const CustomAutocomplete = <T extends unknown>({
  options,
  onChange,
  value,
  getOptionLabel,
  isOptionEqualToValue = (option: T, value: T) => option === value
}: CustomAutocompleteProps<T>) => {
  const selectAllOption: T = { id: -1, name: 'Select All' } as any;
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    setSelectAllChecked(value.length === options.length);
  }, [options, value]);

  const handleSelectAll = (selected: boolean) => {
    const newValues = selected ? options : [];
    setSelectAllChecked(selected);
    onChange(newValues);
  };

  const handleOptionChange = (option: T, selected: boolean) => {
    if (getOptionLabel(option) === 'Select All') {
      handleSelectAll(selected);
    } else {
      const newValue = selected ? [...value, option] : value.filter(item => !isOptionEqualToValue(item, option));
      setSelectAllChecked(newValue.length === options.length);
      onChange(newValue.filter(val => !isOptionEqualToValue(val, selectAllOption)));
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={[selectAllOption, ...options]}
      getOptionLabel={getOptionLabel}
      value={value}
      onChange={(event, newValue: T[], reason) => {
        if (reason === 'clear') {
          handleSelectAll(false); // Deselect all if clear button is clicked
        } else {
          onChange(newValue.filter(val => !isOptionEqualToValue(val, selectAllOption)));
        }
      }}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={(props, option: T, { selected }) => (
        <li {...props}>
          <Checkbox
            checked={getOptionLabel(option) === 'Select All' ? selectAllChecked : selected}
            onChange={(event) => handleOptionChange(option, event.target.checked)}
          />
          {getOptionLabel(option)}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Select Options" variant="outlined" />}
      renderTags={(tagValue, getTagProps) =>
        tagValue.filter(option => getOptionLabel(option) !== 'Select All').map((option, index) => (
          <Chip
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default CustomAutocomplete;
