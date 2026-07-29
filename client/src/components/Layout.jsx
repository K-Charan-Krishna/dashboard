import { useState } from 'react'
import { Box, Container } from '@mui/material'
import Sidebar from './Sidebar'
import AppBar from './AppBar'

const Layout = ({
    children,
    user = null,
    onLogout,
    title = 'Dashboard',
    activeItem = 'Dashboard'
}) => {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            {/* App Bar */}
            <AppBar
                user={user}
                onMenuClick={handleDrawerToggle}
                title={title}
            />

            {/* Sidebar for desktop */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Sidebar user={user} onLogout={onLogout} activeItem={activeItem} />
            </Box>

            {/* Sidebar for mobile (drawer) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Sidebar
                    user={user}
                    onLogout={onLogout}
                    activeItem={activeItem}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                />
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    ml: { sm: '260px' },
                    mt: '64px',
                    minHeight: '100vh',
                    width: { sm: 'calc(100% - 260px)' }
                }}
            >
                <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    )
}

export default Layout