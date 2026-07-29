import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
    Card,
    CardContent,
    Grid,
    Snackbar,
    Avatar
} from '@mui/material'
import {
    Refresh as RefreshIcon,
    People as PeopleIcon,
    Verified as VerifiedIcon,
    Pending as PendingIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import Layout from './Layout'
import LogoutModal from './logout'
import api from '../api/axios'
import { getAccessToken, getUser, removeAccessToken } from '../utils/token'

function Dashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)
    const [isAllDevices, setIsAllDevices] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const navigate = useNavigate()

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
            if (Array.isArray(response.data)) {
                setUsers(response.data)
            } else if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data)
            } else if (response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users)
            } else {
                setError('Unexpected data format from server')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Session expired. Please login again.')
                    handleLogoutSuccess()
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

    const handleLogoutClick = () => {
        setLogoutModalOpen(true)
        setIsAllDevices(false)
    }

    const handleLogoutSuccess = () => {
        removeAccessToken()
        localStorage.removeItem('user')

        setSnackbar({
            open: true,
            message: isAllDevices ? 'Logged out from all devices' : 'Logged out successfully',
            severity: 'success'
        })

        setLogoutModalOpen(false)

        setTimeout(() => {
            navigate('/login')
        }, 500)
    }

    const handleLogoutCancel = () => {
        setLogoutModalOpen(false)
        setIsAllDevices(false)
    }

    const handleToggleAllDevices = () => {
        setIsAllDevices(!isAllDevices)
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    const totalUsers = users.length
    const verifiedUsers = users.filter(user => user.isVerified).length
    const pendingUsers = totalUsers - verifiedUsers

    return (
        <Layout
            user={currentUser}
            onLogout={handleLogoutClick}
            title="Dashboard"
            activeItem="Dashboard"
        >
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Total Users
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, fontSize: '28px' }}>
                                        {totalUsers}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', width: 48, height: 48 }}>
                                    <PeopleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Verified
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#22c55e', fontSize: '28px' }}>
                                        {verifiedUsers}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', width: 48, height: 48 }}>
                                    <VerifiedIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Pending
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#eab308', fontSize: '28px' }}>
                                        {pendingUsers}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', width: 48, height: 48 }}>
                                    <PendingIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" variant="caption" sx={{ fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Active
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#8b5cf6', fontSize: '28px' }}>
                                        {verifiedUsers}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 48, height: 48 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Action Bar */}
            <Paper elevation={0} sx={{
                p: 2,
                mb: 4,
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0'
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Button
                        variant="contained"
                        onClick={fetchUsers}
                        startIcon={<RefreshIcon />}
                        disabled={loading}
                        sx={{
                            bgcolor: '#6366f1',
                            '&:hover': { bgcolor: '#4f46e5' },
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        {loading ? 'Loading...' : 'Get User List'}
                    </Button>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{totalUsers}</span> users found
                    </Typography>
                </Box>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Users Table */}
            <Paper elevation={0} sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0'
            }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={6}>
                        <CircularProgress />
                    </Box>
                ) : users.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow
                                        key={user._id || user.id || index}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ color: '#94a3b8', fontSize: '14px' }}>{index + 1}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1', fontSize: '12px', fontWeight: 600 }}>
                                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '14px' }}>
                                                    {user.name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '14px' }}>
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isVerified ? 'Verified' : 'Pending'}
                                                color={user.isVerified ? 'success' : 'warning'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '12px',
                                                    '& .MuiChip-label': { px: 2 }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box p={6} textAlign="center">
                        <Typography variant="body1" color="textSecondary" sx={{ fontSize: '15px' }}>
                            Click the <strong style={{ color: '#6366f1' }}>"Get User List"</strong> button to load users
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Logout Modal */}
            <LogoutModal
                open={logoutModalOpen}
                onClose={handleLogoutCancel}
                onSuccess={handleLogoutSuccess}
                isAllDevices={isAllDevices}
                onToggleAllDevices={handleToggleAllDevices}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    )
}

export default Dashboard