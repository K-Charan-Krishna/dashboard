import {
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

const AppBar = ({ user = null, onMenuClick, title = 'Dashboard' }) => {
    return (
        <MuiAppBar
            position="fixed"
            sx={{
                width: { sm: 'calc(100% - 260px)' },
                ml: { sm: '260px' },
                bgcolor: 'white',
                color: '#1a1a2e',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                borderBottom: '1px solid #f0f0f0',
                zIndex: 1300
            }}
        >
            <Toolbar sx={{ minHeight: 64 }}>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, fontSize: '20px' }}>
                    {title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 500,
                        color: '#4a4a4a'
                    }}>
                        {user?.name || 'User'}
                    </Typography>
                    <Avatar sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#e94560',
                        fontSize: '14px',
                        fontWeight: 600
                    }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                </Box>
            </Toolbar>
        </MuiAppBar>
    )
}

export default AppBar