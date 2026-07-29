import { useNavigate, useLocation } from 'react-router-dom'
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Typography,
    Button,
    Drawer
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    TrendingUp as TrendingUpIcon,
    Logout as LogoutIcon,
    Home as HomeIcon
} from '@mui/icons-material'

const Sidebar = ({
    user = null,
    onLogout,
    activeItem = 'Dashboard',
    variant = 'permanent',
    open = false,
    onClose = () => { }
}) => {
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Users', icon: <PeopleIcon />, path: '/users' },
        { text: 'Analytics', icon: <TrendingUpIcon />, path: '/analytics' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ]

    const handleNavigation = (path) => {
        navigate(path)
        if (variant === 'temporary') {
            onClose()
        }
    }

    const sidebarContent = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#1a1a2e',
            width: 260
        }}>
            {/* User Profile Section */}
            <Box sx={{ p: 3, textAlign: 'center', pt: 4 }}>
                <Avatar
                    sx={{
                        width: 72,
                        height: 72,
                        mx: 'auto',
                        mb: 1.5,
                        bgcolor: '#e94560',
                        fontSize: 28,
                        fontWeight: 'bold',
                        border: '3px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                    onClick={() => handleNavigation('/profile')}
                >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>
                    {user?.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                    {user?.email || 'user@email.com'}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

            {/* Navigation Menu */}
            <List sx={{ flex: 1, pt: 2, px: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path === '/' && location.pathname === '/')
                    return (
                        <ListItem
                            key={item.text}
                            button
                            onClick={() => handleNavigation(item.path)}
                            selected={isActive}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                py: 1.2,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(233, 69, 96, 0.15)',
                                    '&:hover': { bgcolor: 'rgba(233, 69, 96, 0.25)' },
                                    '& .MuiListItemIcon-root': {
                                        color: '#e94560'
                                    },
                                    '& .MuiListItemText-primary': {
                                        color: 'white',
                                        fontWeight: 600
                                    }
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                color: isActive ? '#e94560' : 'rgba(255,255,255,0.5)',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '14px'
                                    }
                                }}
                            />
                        </ListItem>
                    )
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

            {/* Logout Button */}
            <Box sx={{ p: 2, pb: 3 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                        bgcolor: '#e94560',
                        '&:hover': { bgcolor: '#c73652' },
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '14px'
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    )

    // For mobile (temporary drawer)
    if (variant === 'temporary') {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 260
                    }
                }}
            >
                {sidebarContent}
            </Drawer>
        )
    }

    // For desktop (permanent sidebar)
    return (
        <Box sx={{
            display: { xs: 'none', sm: 'block' },
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: 260,
            zIndex: 1200
        }}>
            {sidebarContent}
        </Box>
    )
}

export default Sidebar