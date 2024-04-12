import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SmallBox } from './Homepage.styled';
import { Row } from 'react-bootstrap';
import Popper from '@mui/material/Popper';

const DateFilterDropdown: React.FC<{ setDateRange: React.Dispatch<React.SetStateAction<{ startDate: Date | null; endDate: Date | null; }>> }> = ({ setDateRange }) => {
    const [selectedValue, setSelectedValue] = useState('0');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const popperRef = useRef<HTMLDivElement>(null);

    const currentDate = new Date();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
                setShowCustomRange(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCustomRangeChange = (type: 'start' | 'end', value: Date | null) => {
        if (type === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value.toString();
        setSelectedValue(newValue);
        switch (newValue) {
            case '0': {
                setShowCustomRange(false);
                setStartDate(null);
                setEndDate(null);
                setDateRange({ "startDate": null, "endDate": null });
                break;
            }
            case '30': {
                setShowCustomRange(false);
                const lastMonth = new Date(currentDate);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                setStartDate(lastMonth);
                setEndDate(currentDate);
                setDateRange({ "startDate": lastMonth, "endDate": currentDate });
                break;
            }
            case '60': {
                setShowCustomRange(false);
                const last2Months = new Date(currentDate);
                last2Months.setMonth(last2Months.getMonth() - 2);
                setStartDate(last2Months);
                setEndDate(currentDate);
                setDateRange({ "startDate": last2Months, "endDate": currentDate });
                break;
            }
            case '90': {
                setShowCustomRange(false);
                const last3Months = new Date(currentDate);
                last3Months.setMonth(last3Months.getMonth() - 3);
                setStartDate(last3Months);
                setEndDate(currentDate);
                setDateRange({ "startDate": last3Months, "endDate": currentDate });
                break;
            }
            case '180': {
                setShowCustomRange(false);
                const last6Months = new Date(currentDate);
                last6Months.setMonth(last6Months.getMonth() - 6);
                setStartDate(last6Months);
                setEndDate(currentDate);
                setDateRange({ "startDate": last6Months, "endDate": currentDate });
                break;
            }
            case '360': {
                setShowCustomRange(false);
                const lastYear = new Date(currentDate);
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                setStartDate(lastYear);
                setEndDate(currentDate);
                setDateRange({ "startDate": lastYear, "endDate": currentDate });
                break;
            }
            case '-1': {
                setShowCustomRange(true);
                setDateRange({ "startDate": startDate, "endDate": endDate });
                break;
            }
            default: {
                break;
            }
        }
    };

    const handleApplyCustomRange = () => {
        setShowCustomRange(false);
        setDateRange({ "startDate": startDate, "endDate": endDate });
    };

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Date</InputLabel>
                <Select
                    ref={selectRef}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    label="Date"
                    onChange={handleChange}
                >
                    <MenuItem value={'0'}>All</MenuItem>
                    <MenuItem value={'30'}>Last month</MenuItem>
                    <MenuItem value={'60'}>Last 2 months</MenuItem>
                    <MenuItem value={'90'}>Last 3 months</MenuItem>
                    <MenuItem value={'180'}>Last 6 months</MenuItem>
                    <MenuItem value={'360'}>Last year</MenuItem>
                    <MenuItem value={'-1'} onClick={() => { setShowCustomRange(true) }}>Custom</MenuItem>
                </Select>
            </FormControl>
            <Popper
                open={showCustomRange}
                anchorEl={selectRef.current}
                placement="bottom-start"
                ref={popperRef}
            >
                <SmallBox>
                    <Box sx={{ p: 3 }}>
                        <Row>
                            <label>Start Date </label>
                        </Row>
                        <Row>
                            <DatePicker
                                className="custom-datepicker"
                                selected={startDate}
                                onChange={(date: Date | null) => handleCustomRangeChange('start', date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="MM/dd/yyyy"
                            />
                        </Row>
                        <Row>
                            <label>End Date </label>
                        </Row>
                        <Row>
                            <DatePicker
                                className="custom-datepicker"
                                selected={endDate}
                                onChange={(date: Date | null) => handleCustomRangeChange('end', date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="MM/dd/yyyy"
                            />
                        </Row>
                        <Button onClick={handleApplyCustomRange} color="primary">Apply</Button>
                    </Box>
                </SmallBox>
            </Popper>
        </Box >
    );
}

export default DateFilterDropdown;
