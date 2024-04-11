import React, { FC, useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { TiHome, TiGroup } from 'react-icons/ti';
import { MdDashboard } from 'react-icons/md';
import { RiAccountBoxFill } from 'react-icons/ri';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { itemRoutes, routeItems } from '../routes';
import { useNavigate } from 'react-router-dom';
import './BottomNavBar.css';
import { selectedContent } from '../../../services/State';

interface BottomNavBarProps { }

const BottomNavBar: FC<BottomNavBarProps> = () => {

    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('');

    const handleNavigationChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
        navigate(itemRoutes[newValue]);
        setActiveItem(newValue);
        localStorage.setItem('selectedContent', newValue);
        if (Object.values(itemRoutes).includes(location.pathname))
            navigate(itemRoutes[newValue])
        selectedContent.next(newValue);
    };

    useEffect(() => {
        const url = location.pathname;
        let [, navItem] = Object.entries(routeItems).find(([key, _]) => url.startsWith(key)) || [];
        if (navItem) {
            setActiveItem(navItem);
        }

        selectedContent.pipe().subscribe((value: string) => {
            setActiveItem(value);
            localStorage.setItem('selectedContent', value);
         });
         
    }, [activeItem]);

    return (
        <BottomNavigation showLabels value={activeItem} onChange={handleNavigationChange}>
            <BottomNavigationAction label="Home" icon={<TiHome />} value="Home" />
            <BottomNavigationAction label="Events" icon={<MdDashboard />} value="Events" />
            <BottomNavigationAction label="Friends" icon={<TiGroup />} value="Friends" />
            <BottomNavigationAction label="Personal Expenses" icon={<BiMoneyWithdraw />} value="Personal Expenses" />
            <BottomNavigationAction label="Account" icon={<RiAccountBoxFill />} value="Account" />
        </BottomNavigation>
    );
};

export default BottomNavBar;
