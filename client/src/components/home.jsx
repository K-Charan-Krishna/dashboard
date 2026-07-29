import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Paper,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Button,
    Box
} from '@mui/material'
import {
    People as PeopleIcon,
    Verified as VerifiedIcon,
    Pending as PendingIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import Layout from './Layout'
import { getAccessToken, getUser } from '../utils/token'
import api from '../api/axios'

function Home() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()



    return (
        <Layout
            user={currentUser}
            onLogout={() => { }}
            title="Home"
            activeItem="Home"
        >
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                    Welcome to My App! 🚀
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: '16px' }}>
                    This is a modern authentication system built with React, Material-UI, and Express
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: '16px' }}>
                    Have a Grate Day
                </Typography>
            </Paper>
        </Layout>
    )
}

export default Home