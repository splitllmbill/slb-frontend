import React, { FC, useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { TiHome, TiGroup } from 'react-icons/ti';
import { MdDashboard } from 'react-icons/md';
import { RiAccountBoxFill } from 'react-icons/ri';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { selectedContent } from '../../../services/State';
import { itemRoutes } from '../routes';
import { useNavigate } from 'react-router-dom';

interface BottomNavBarProps { }

const BottomNavBar: FC<BottomNavBarProps> = () => {

    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('');

    const handleNavigationChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
        setActiveItem(newValue);
        localStorage.setItem('selectedContent',newValue);
        selectedContent.next(newValue);
        navigate(itemRoutes[newValue])
    };

    useEffect(() => {
        const subscription = selectedContent.subscribe((content: string) => {
            setActiveItem(content);
        });

        return () => {
            subscription.unsubscribe();
        };
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
