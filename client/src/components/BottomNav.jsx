import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Paper,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material'

const BottomNav = ({ onLogout }) => {
    const [value, setValue] = useState(0)
    const navigate = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue)
        if (newValue === 0) navigate('/')
        else if (newValue === 1) navigate('/users')
        else if (newValue === 2) navigate('/settings')
        else if (newValue === 3) onLogout()
    }

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: 'flex', sm: 'none' },
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderRadius: 0,
                bgcolor: 'white',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}
            elevation={0}
        >
            <BottomNavigation
                value={value}
                onChange={handleChange}
                showLabels={false}
                sx={{ height: 60, bgcolor: 'transparent' }}
            >
                <BottomNavigationAction
                    label="Dashboard"
                    icon={<DashboardIcon />}
                    sx={{ '&.Mui-selected': { color: '#6366f1' } }}
                />
                <BottomNavigationAction
                    label="Users"
                    icon={<PeopleIcon />}
                    sx={{ '&.Mui-selected': { color: '#6366f1' } }}
                />
                <BottomNavigationAction
                    label="Settings"
                    icon={<SettingsIcon />}
                    sx={{ '&.Mui-selected': { color: '#6366f1' } }}
                />
                <BottomNavigationAction
                    label="Logout"
                    icon={<LogoutIcon />}
                    sx={{
                        color: '#e94560',
                        '&.Mui-selected': { color: '#e94560' }
                    }}
                />
            </BottomNavigation>
        </Paper>
    )
}

export default BottomNav