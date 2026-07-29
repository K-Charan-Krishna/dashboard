import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    useTheme,
    IconButton
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import RefreshIcon from '@mui/icons-material/Refresh'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import VerifiedIcon from '@mui/icons-material/Verified'
import PendingIcon from '@mui/icons-material/Pending'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuIcon from '@mui/icons-material/Menu'
import api from '../api/axios'
import { getAccessToken, getUser, logout } from '../utils/token'

const drawerWidth = 280

function Dashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()

    useEffect(() => {
        const token = getAccessToken()
        if (!token) {
            navigate('/login')
        } else {
            const user = getUser()
            if (user) {
                setCurrentUser(user)
            }
        }
    }, [navigate])

    const fetchUsers = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/users')
            console.log('API Response:', response.data)

            if (Array.isArray(response.data)) {
                setUsers(response.data)
            } else if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data)
            } else if (response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users)
            } else {
                setError('Unexpected data format from server')
                console.error('Unexpected data format:', response.data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Session expired. Please login again.')
                    handleLogout()
                } else {
                    setError(error.response.data?.message || 'Failed to fetch users')
                }
            } else if (error.request) {
                setError('No response from server. Please check your connection.')
            } else {
                setError('Failed to fetch users. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const totalUsers = users.length
    const verifiedUsers = users.filter(user => user.isVerified).length
    const pendingUsers = totalUsers - verifiedUsers

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.primary.main, color: 'white' }}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        fontSize: 32
                    }}
                >
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentUser?.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {currentUser?.email || 'user@email.com'}
                </Typography>
            </Box>

            <Divider />

            <List sx={{ flex: 1 }}>
                <ListItem>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ py: 1.5 }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    zIndex: theme.zIndex.drawer + 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {currentUser?.name || 'User'}
                        </Typography>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px'
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                    {/* Get User Button and Stats in ONE HORIZONTAL LINE */}
                    <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                flexDirection: 'row', // Force horizontal
                                flexWrap: 'nowrap', // Prevent wrapping
                                gap: 2
                            }}
                        >
                            {/* Left side - Get User Button */}
                            <Button
                                variant="contained"
                                onClick={fetchUsers}
                                startIcon={<RefreshIcon />}
                                disabled={loading}
                                size="medium"
                                sx={{
                                    minWidth: '150px',
                                    flexShrink: 0 // Prevent shrinking
                                }}
                            >
                                {loading ? 'Loading...' : 'GET USER LIST'}
                            </Button>

                            {/* Right side - Stats in one horizontal line */}
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    gap: 4,
                                    flexWrap: 'nowrap', // Prevent wrapping
                                    flexShrink: 0 // Prevent shrinking
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PeopleIcon color="primary" fontSize="small" />
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                        <strong>Total:</strong> {totalUsers}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <VerifiedIcon color="success" fontSize="small" />
                                    <Typography variant="body2" color="success.main" sx={{ whiteSpace: 'nowrap' }}>
                                        <strong>Verified:</strong> {verifiedUsers}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PendingIcon color="warning" fontSize="small" />
                                    <Typography variant="body2" color="warning.main" sx={{ whiteSpace: 'nowrap' }}>
                                        <strong>Pending:</strong> {pendingUsers}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    <Paper elevation={3}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : users.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell><strong>#</strong></TableCell>
                                            <TableCell><strong>Name</strong></TableCell>
                                            <TableCell><strong>Email</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user, index) => (
                                            <TableRow key={user._id || user.id || index} hover>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <PersonIcon fontSize="small" color="action" />
                                                        {user.name || 'N/A'}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.isVerified ? 'Verified' : 'Pending'}
                                                        color={user.isVerified ? 'success' : 'warning'}
                                                        size="small"
                                                        icon={user.isVerified ? <VerifiedIcon /> : <PendingIcon />}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box p={4} textAlign="center">
                                <Typography variant="body1" color="textSecondary">
                                    Click the <strong>"Get User List"</strong> button to load users
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
        </Box>
    )
}

export default Dashboard