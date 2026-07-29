import { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import api from '../api/axios'

function LogoutModal({
    open,
    onClose,
    onSuccess,
    isAllDevices = false,
    onToggleAllDevices
}) {
    const [localLoading, setLocalLoading] = useState(false)
    const [localError, setLocalError] = useState('')

    const handleConfirm = async () => {
        setLocalLoading(true)
        setLocalError('')

        try {
            // Direct API call to /auth/logout
            const response = await api.post('/auth/logout', null, {
                params: {
                    isAll: isAllDevices
                }
            })

            // Close modal
            onClose()

            // Call success callback if provided
            if (onSuccess) {
                onSuccess(response.data)
            }

        } catch (error) {
            console.error('Logout error:', error)
            const errorMessage = error.response?.data?.message || 'Failed to logout. Please try again.'
            setLocalError(errorMessage)
            setLocalLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={!localLoading ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pb: 1
            }}>
                <LogoutIcon sx={{ color: '#ef4444' }} />
                <Typography variant="h6" component="span" fontWeight={600}>
                    Confirm Logout
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to logout?
                </DialogContentText>

                {/* Option to logout from all devices */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2,
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: isAllDevices ? '2px solid #6366f1' : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: '#f1f5f9'
                        }
                    }}
                    onClick={onToggleAllDevices}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                            Logout from all devices
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            This will end all active sessions
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '2px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isAllDevices ? '#6366f1' : 'transparent',
                            borderColor: isAllDevices ? '#6366f1' : '#cbd5e1',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isAllDevices && (
                            <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                        )}
                    </Box>
                </Box>

                {localError && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                        {localError}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={localLoading}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        flex: 1
                    }}
                >
                    No
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={localLoading}
                    variant="contained"
                    color="error"
                    startIcon={localLoading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        flex: 1,
                        bgcolor: '#ef4444',
                        '&:hover': {
                            bgcolor: '#dc2626'
                        }
                    }}
                >
                    {localLoading ? 'Logging out...' : 'Yes, Logout'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default LogoutModal