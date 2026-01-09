import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, fetchAllUsers, resetUserPassword } from '../../store/authSlice';
import { useToastMessage } from '../../hooks/useToast';

// Material-UI Components
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    InputAdornment,
    FormControl,
    Select,
    Avatar,
    Stack,
    Tooltip,
    CircularProgress,
    InputLabel,
    Pagination,
    keyframes,
    styled,
    GlobalStyles,
    alpha
} from '@mui/material';

// Material-UI Icons
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    LockReset as LockResetIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Key as KeyIcon,
    Email as EmailIcon,
    FilterList,
    Download,
    Group,
    Security,
    VerifiedUser,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromRight = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components with Poppins font
const GlassCard = styled(Card)(({ theme, cardcolor }) => ({
    background: `linear-gradient(135deg, 
    ${alpha(cardcolor || theme.palette.primary.main, 0.1)} 0%, 
    ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(cardcolor || theme.palette.primary.main, 0.1)}`,
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 20px 40px ${alpha(cardcolor || theme.palette.primary.main, 0.15)}`,
        border: `1px solid ${alpha(cardcolor || theme.palette.primary.main, 0.3)}`,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${cardcolor || theme.palette.primary.main}, ${alpha(cardcolor || theme.palette.primary.main, 0.5)})`,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `conic-gradient(transparent, ${alpha(cardcolor || theme.palette.primary.main, 0.1)}, transparent 30%)`,
        animation: `${gradientAnimation} 3s linear infinite`,
        pointerEvents: 'none',
    }
}));

const PoppinsTypography = styled(Typography)({
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
});

const GlassDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: '24px',
        boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.2)}`,
        maxWidth: '90vw',
        width: '100%',
        margin: { xs: '16px', sm: '32px' }
    },
    '& .MuiDialogContent-root': {
        padding: { xs: '16px', sm: '24px' }
    },
    '& .MuiDialogTitle-root': {
        padding: { xs: '16px 24px', sm: '20px 24px' }
    },
    '& .MuiDialogActions-root': {
        padding: { xs: '16px', sm: '20px 24px' }
    }
}));

const GlassTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        fontFamily: '"Poppins", sans-serif',
        '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.3),
            background: alpha(theme.palette.background.paper, 0.9),
        },
        '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.95),
        }
    },
    '& .MuiInputLabel-root': {
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 500,
    },
    '& .MuiInputBase-input': {
        fontFamily: '"Poppins", sans-serif',
    }
}));

const GlassSelect = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        fontFamily: '"Poppins", sans-serif',
        '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.3),
            background: alpha(theme.palette.background.paper, 0.9),
        },
        '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.95),
        }
    },
    '& .MuiInputLabel-root': {
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 500,
    }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    borderRadius: '12px',
    padding: { xs: '8px 16px', sm: '10px 24px' },
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    fontSize: { xs: '0.875rem', sm: '1rem' },
    minHeight: { xs: '36px', sm: '40px' },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '&:disabled': {
        background: alpha(theme.palette.primary.main, 0.5),
    }
}));

const StatCard = React.memo(({ stat, index }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [hovered, setHovered] = useState(false);

    return (
        <GlassCard
            cardcolor={stat.color}
            sx={{
                animation: `${slideInFromLeft} 0.5s ease forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                height: '100%',
                minHeight: { xs: '120px', sm: '140px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <CardContent sx={{
                p: { xs: 1.5, sm: 2.5, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: { xs: 1, sm: 2 },
                    gap: 1
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <PoppinsTypography
                            variant="subtitle2"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                mb: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '0.7rem', sm: '0.813rem', md: '0.875rem' },
                                letterSpacing: '0.3px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {stat.title}
                        </PoppinsTypography>
                        <PoppinsTypography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: stat.color,
                                mb: { xs: 0.5, sm: 1 },
                                fontSize: { 
                                    xs: '1rem', 
                                    sm: '1.25rem', 
                                    md: '1.5rem',
                                    lg: '1.75rem' 
                                },
                                letterSpacing: '-0.5px',
                                lineHeight: 1.2,
                                wordBreak: 'break-all'
                            }}
                        >
                            {stat.value}
                        </PoppinsTypography>
                        <PoppinsTypography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                fontWeight: 400,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: alpha(stat.color, 0.5),
                                    flexShrink: 0
                                }}
                            />
                            <Box sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {stat.subtitle}
                            </Box>
                        </PoppinsTypography>
                    </Box>

                    <Box sx={{
                        width: { xs: 36, sm: 44, md: 52 },
                        height: { xs: 36, sm: 44, md: 52 },
                        borderRadius: { xs: '10px', sm: '14px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: stat.bgGradient || `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                        color: 'white',
                        animation: hovered ? `${floatAnimation} 2s ease-in-out infinite` : 'none',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 4px 20px ${alpha(stat.color, 0.3)}`,
                        flexShrink: 0,
                    }}>
                        {React.cloneElement(stat.icon, { 
                            sx: { fontSize: { xs: 18, sm: 22, md: 26 } } 
                        })}
                    </Box>
                </Box>
            </CardContent>
        </GlassCard>
    );
});

const UserDashboard = () => {
    const departments = [
        { value: 'GENERAL', label: 'General', color: '#3b82f6' },
        { value: 'HR', label: 'HR', color: '#ef4444' },
        { value: 'IT', label: 'IT', color: '#10b981' },
        { value: 'DATA', label: 'Data', color: '#8b5cf6' },
        { value: 'SALES', label: 'Sales', color: '#f59e0b' }
    ];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State management
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.auth);
    const { success, error } = useToastMessage();

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const [newUser, setNewUser] = useState({
        name: '',
        password: '',
        department: departments[0].value
    });

    const [passwordVisible, setPasswordVisible] = useState({
        createPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [resetPasswordModal, setResetPasswordModal] = useState({
        isOpen: false,
        userId: null,
        userName: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setPasswordVisible(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Handle adding a new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(createUser(newUser));

            if (createUser.fulfilled.match(res)) {
                success("User has been created successfully!");
                dispatch(fetchAllUsers());
                // Reset form
                setNewUser({
                    name: '',
                    password: '',
                    department: departments[0].value
                });
            } else {
                error("Error in creating the user");
            }
        } catch (err) {
            console.log(err);
            error("Error in creating the user");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Handle reset password modal input changes
    const handleResetPasswordInputChange = (e) => {
        const { name, value } = e.target;
        setResetPasswordModal(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Open reset password modal
    const openResetPasswordModal = (userId, userName) => {
        setResetPasswordModal({
            isOpen: true,
            userId: userId,
            userName: userName,
            newPassword: '',
            confirmPassword: ''
        });
    };

    // Close reset password modal
    const closeResetPasswordModal = () => {
        setResetPasswordModal({
            isOpen: false,
            userId: null,
            userName: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    // Handle reset password submission
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (resetPasswordModal.newPassword !== resetPasswordModal.confirmPassword) {
            error("New password and confirm password do not match!");
            return;
        }

        if (resetPasswordModal.newPassword.length < 6) {
            error("Password must be at least 6 characters long!");
            return;
        }

        try {
            await dispatch(resetUserPassword({
                userId: resetPasswordModal.userId,
                password: resetPasswordModal.newPassword
            })).unwrap();

            success("Password has been updated successfully!");
            closeResetPasswordModal();
        } catch (err) {
            const errorMessage = err?.message || err?.toString() || "Failed to update password. Please try again.";
            error(errorMessage);
        }
    };

    // Format last login date
    const formatLastLogin = (user) => {
        if (!user?.sessions?.length) return '-';

        const lastSession = user.sessions[user.sessions.length - 1];
        return new Date(lastSession?.lastLogin).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
        });
    };

    // Filter users based on search term
    const filteredUsers = users?.filter(user =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.department?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Pagination logic
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Get department color
    const getDepartmentColor = (department) => {
        const dept = departments.find(d => d.value === department);
        return dept?.color || '#6b7280';
    };

    // Stats data
    const stats = [
        {
            title: "Total Users",
            value: users?.length || 0,
            color: "#3b82f6",
            icon: <Group />,
            subtitle: "Active users in system",
            bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            trend: "+12.5%",
            trendColor: "#10b981"
        },
        {
            title: "Active Sessions",
            value: users?.filter(u => u?.sessions?.length > 0).length || 0,
            color: "#10b981",
            icon: <VerifiedUser />,
            subtitle: "Currently logged in",
            bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            trend: "+8.3%",
            trendColor: "#10b981"
        },
        {
            title: "IT Department",
            value: users?.filter(u => u?.department === 'IT').length || 0,
            color: "#8b5cf6",
            icon: <BusinessIcon />,
            subtitle: "IT team members",
            bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            trend: "+5.2%",
            trendColor: "#8b5cf6"
        },
        {
            title: "Admin Privileges",
            value: users?.filter(u => u?.isAdmin).length || 0,
            color: "#f59e0b",
            icon: <Security />,
            subtitle: "Administrative users",
            bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            trend: "+2.1%",
            trendColor: "#f59e0b"
        },
    ];

    return (
        <>
            <GlobalStyles styles={{
                '@import': 'url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap")',
                'body': {
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                },
                '::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px'
                },
                '::-webkit-scrollbar-track': {
                    background: 'linear-gradient(180deg, #f1f1f1 0%, #e1e1e1 100%)',
                    borderRadius: '10px'
                },
                '::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    }
                },
            }} />

            <Box sx={{
                p: { xs: 1, sm: 2, md: 3 },
                minHeight: "100vh",
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Poppins", sans-serif',
            }}>
                {/* Header Section */}
                <Box sx={{
                    mb: { xs: 3, sm: 4 },
                    animation: `${fadeIn} 0.6s ease forwards`
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <PoppinsTypography variant="h4" sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                fontSize: { 
                                    xs: '1.25rem', 
                                    sm: '1.5rem', 
                                    md: '1.75rem',
                                    lg: '2.125rem' 
                                },
                                letterSpacing: '-0.5px',
                                lineHeight: 1.2
                            }}>
                                User Management Dashboard
                            </PoppinsTypography>
                            <PoppinsTypography variant="body1" sx={{
                                color: 'text.secondary',
                                maxWidth: '600px',
                                fontWeight: 400,
                                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                                lineHeight: 1.5
                            }}>
                                Manage users, permissions, and access across your organization
                            </PoppinsTypography>
                        </Box>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Box sx={{
                    mb: { xs: 3, sm: 4 },
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)'
                    },
                    gap: { xs: 2, sm: 3 }
                }}>
                    {stats.map((stat, index) => (
                        <Box
                            key={index}
                            sx={{
                                animation: `${slideInFromLeft} 0.5s ease forwards`,
                                animationDelay: `${index * 0.1}s`,
                                opacity: 0
                            }}
                        >
                            <StatCard stat={stat} index={index} />
                        </Box>
                    ))}
                </Box>

                {/* Add New User Section */}
                <GlassCard sx={{ mb: { xs: 3, sm: 4 } }}>
                    <CardContent sx={{ 
                        p: { xs: 1.5, sm: 2, md: 3 },
                        '&:last-child': {
                            pb: { xs: 1.5, sm: 2, md: 3 }
                        }
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: { xs: 2, sm: 3 }, 
                            flexWrap: 'wrap', 
                            gap: 1 
                        }}>
                            <Box sx={{ minWidth: 0 }}>
                                <PoppinsTypography variant="h6" sx={{ 
                                    fontWeight: 600, 
                                    mb: 0.5, 
                                    fontSize: { 
                                        xs: '0.95rem', 
                                        sm: '1rem', 
                                        md: '1.1rem' 
                                    } 
                                }}>
                                    <AddIcon sx={{ 
                                        mr: 1, 
                                        verticalAlign: 'middle',
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }} />
                                    Add New User
                                </PoppinsTypography>
                                <PoppinsTypography variant="body2" sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 400, 
                                    fontSize: { 
                                        xs: '0.75rem', 
                                        sm: '0.8rem', 
                                        md: '0.875rem' 
                                    } 
                                }}>
                                    Create new user accounts with specific permissions
                                </PoppinsTypography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: { xs: 1, sm: 2 } }} component="form" onSubmit={handleAddUser}>
                            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                <Grid item xs={12} md={4}>
                                    <GlassTextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter full name"
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <GlassTextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={passwordVisible.createPassword ? "text" : "password"}
                                        value={newUser.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter password"
                                        inputProps={{ minLength: 6 }}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => togglePasswordVisibility('createPassword')}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {passwordVisible.createPassword ?
                                                            <VisibilityOffIcon fontSize="small" /> :
                                                            <VisibilityIcon fontSize="small" />
                                                        }
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <GlassSelect fullWidth size="small">
                                        <InputLabel sx={{ 
                                            fontFamily: '"Poppins", sans-serif',
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}>
                                            Department
                                        </InputLabel>
                                        <Select
                                            MenuProps={{ 
                                                disableScrollLock: true,
                                                PaperProps: {
                                                    sx: {
                                                        maxHeight: { xs: 200, sm: 300 },
                                                        borderRadius: '12px',
                                                        marginTop: '4px'
                                                    }
                                                }
                                            }}
                                            label="Department"
                                            name="department"
                                            value={newUser.department || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {departments.map((dept) => (
                                                <MenuItem 
                                                    key={dept.value} 
                                                    value={dept.value} 
                                                    sx={{ 
                                                        fontFamily: '"Poppins", sans-serif',
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: dept.color,
                                                            flexShrink: 0
                                                        }} />
                                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {dept.label}
                                                        </span>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </GlassSelect>
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <PrimaryButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{ 
                                            height: { xs: '36px', sm: '40px' },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {isSmallMobile ? 'Add' : 'Add User'}
                                    </PrimaryButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </GlassCard>

                {/* Users List Section */}
                <GlassCard>
                    <CardContent sx={{ 
                        p: { xs: 1.5, sm: 2, md: 3 },
                        '&:last-child': {
                            pb: { xs: 1.5, sm: 2, md: 3 }
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: { xs: 2, sm: 3 },
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Box sx={{ minWidth: 0 }}>
                                <PoppinsTypography variant="h6" sx={{
                                    fontWeight: 600,
                                    mb: 0.5,
                                    fontSize: { 
                                        xs: '0.95rem', 
                                        sm: '1rem', 
                                        md: '1.1rem' 
                                    }
                                }}>
                                    Users List
                                </PoppinsTypography>
                                <PoppinsTypography variant="body2" sx={{
                                    color: 'text.secondary',
                                    fontWeight: 400,
                                    fontSize: { 
                                        xs: '0.75rem', 
                                        sm: '0.8rem', 
                                        md: '0.875rem' 
                                    }
                                }}>
                                    Manage and review all user accounts
                                </PoppinsTypography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 2 },
                                flexWrap: 'wrap',
                                flexShrink: 0,
                                width: { xs: '100%', sm: 'auto' }
                            }}>
                                <GlassTextField
                                    size="small"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ 
                                        width: { xs: '100%', sm: 200 },
                                        '& .MuiInputBase-root': {
                                            height: { xs: '36px', sm: '40px' }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress size={isMobile ? 32 : 40} />
                            </Box>
                        ) : filteredUsers?.length === 0 ? (
                            <Box sx={{
                                height: { xs: 200, sm: 300 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{
                                    width: { xs: 60, sm: 80 },
                                    height: { xs: 60, sm: 80 },
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: `${floatAnimation} 3s ease-in-out infinite`
                                }}>
                                    <SearchIcon sx={{ 
                                        fontSize: { xs: 28, sm: 40 }, 
                                        color: alpha(theme.palette.primary.main, 0.5) 
                                    }} />
                                </Box>
                                <PoppinsTypography 
                                    variant="h6" 
                                    color="text.secondary" 
                                    align="center"
                                    sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
                                >
                                    No users found
                                </PoppinsTypography>
                                <PoppinsTypography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    align="center"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Try adjusting your search criteria
                                </PoppinsTypography>
                            </Box>
                        ) : isMobile ? (
                            // Mobile Card View
                            <Stack spacing={2}>
                                {currentUsers?.map((user) => (
                                    <GlassCard key={user?._id}>
                                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                            <Stack spacing={2}>
                                                {/* User Info */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(getDepartmentColor(user?.department), 0.1),
                                                            color: getDepartmentColor(user?.department),
                                                            width: { xs: 40, sm: 48 },
                                                            height: { xs: 40, sm: 48 },
                                                            fontWeight: 600,
                                                            fontFamily: '"Poppins", sans-serif',
                                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                                        }}
                                                    >
                                                        {user?.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <PoppinsTypography 
                                                            variant="subtitle1" 
                                                            fontWeight="600" 
                                                            noWrap
                                                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                                        >
                                                            {user?.name}
                                                        </PoppinsTypography>
                                                        <PoppinsTypography
                                                            variant="body2"
                                                            color="primary"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                mt: 0.5,
                                                                minWidth: 0,
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                            }}
                                                            noWrap
                                                        >
                                                            <EmailIcon fontSize="small" sx={{ mr: 0.5, flexShrink: 0 }} />
                                                            <Box component="span" sx={{ 
                                                                overflow: 'hidden', 
                                                                textOverflow: 'ellipsis', 
                                                                whiteSpace: 'nowrap' 
                                                            }}>
                                                                {user?.email}
                                                            </Box>
                                                        </PoppinsTypography>
                                                    </Box>
                                                </Box>

                                                {/* Department & Status */}
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 1
                                                }}>
                                                    <Chip
                                                        icon={<BusinessIcon fontSize="small" />}
                                                        label={user?.department}
                                                        size="small"
                                                        sx={{
                                                            background: alpha(getDepartmentColor(user?.department), 0.1),
                                                            color: getDepartmentColor(user?.department),
                                                            border: `1px solid ${alpha(getDepartmentColor(user?.department), 0.2)}`,
                                                            fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                                        }}
                                                    />
                                                    <Chip
                                                        icon={<CheckCircleIcon fontSize="small" />}
                                                        label={user?.isAdmin ? "Admin" : "User"}
                                                        color={user?.isAdmin ? "success" : "default"}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                                                    />
                                                </Box>

                                                {/* Last Login */}
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                >
                                                    <strong>Last Login:</strong> {formatLastLogin(user)}
                                                </Typography>

                                                {/* Action Button */}
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<LockResetIcon />}
                                                    onClick={() => openResetPasswordModal(user?._id, user?.name)}
                                                    size={isSmallMobile ? "small" : "medium"}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                        '&:hover': {
                                                            borderColor: theme.palette.primary.main,
                                                            background: alpha(theme.palette.primary.main, 0.04)
                                                        }
                                                    }}
                                                >
                                                    Reset Password
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </GlassCard>
                                ))}
                            </Stack>
                        ) : (
                            // Desktop Table View
                            <>
                                <TableContainer
                                    sx={{
                                        maxWidth: '100%',
                                        overflowX: 'auto',
                                        borderRadius: '12px',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        '& .MuiTableCell-root': {
                                            py: { xs: 1, sm: 1.5, md: 2 },
                                            px: { xs: 1, sm: 1.5, md: 2 },
                                            borderColor: alpha(theme.palette.divider, 0.1)
                                        }
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{
                                                background: alpha(theme.palette.primary.main, 0.05),
                                                '& th': {
                                                    fontWeight: 600,
                                                    fontFamily: '"Poppins", sans-serif',
                                                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                                    color: theme.palette.text.primary,
                                                    whiteSpace: 'nowrap'
                                                }
                                            }}>
                                                <TableCell>User</TableCell>
                                                <TableCell>Department</TableCell>
                                                <TableCell>Last Login</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentUsers?.map((user) => (
                                                <TableRow
                                                    key={user?._id}
                                                    hover
                                                    sx={{
                                                        '&:hover': {
                                                            background: alpha(theme.palette.primary.main, 0.03),
                                                        },
                                                        '&:last-child td': { border: 0 }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: alpha(getDepartmentColor(user?.department), 0.1),
                                                                    color: getDepartmentColor(user?.department),
                                                                    width: { xs: 32, sm: 36, md: 40 },
                                                                    height: { xs: 32, sm: 36, md: 40 },
                                                                    fontWeight: 600,
                                                                    fontFamily: '"Poppins", sans-serif',
                                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                                }}
                                                            >
                                                                {user?.name?.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box sx={{ minWidth: 0 }}>
                                                                <PoppinsTypography 
                                                                    variant="subtitle2" 
                                                                    fontWeight="600" 
                                                                    noWrap
                                                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                                >
                                                                    {user?.name}
                                                                </PoppinsTypography>
                                                                <PoppinsTypography
                                                                    variant="caption"
                                                                    color="primary"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        fontWeight: 500,
                                                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                                                    }}
                                                                    noWrap
                                                                >
                                                                    <EmailIcon fontSize="small" sx={{ mr: 0.5, flexShrink: 0 }} />
                                                                    {user?.email}
                                                                </PoppinsTypography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={<BusinessIcon fontSize="small" />}
                                                            label={user?.department}
                                                            size="small"
                                                            sx={{
                                                                background: alpha(getDepartmentColor(user?.department), 0.1),
                                                                color: getDepartmentColor(user?.department),
                                                                border: `1px solid ${alpha(getDepartmentColor(user?.department), 0.2)}`,
                                                                fontFamily: '"Poppins", sans-serif',
                                                                fontWeight: 500,
                                                                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <PoppinsTypography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontWeight: 400, 
                                                                color: 'text.secondary',
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                            }}
                                                        >
                                                            {formatLastLogin(user)}
                                                        </PoppinsTypography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={<CheckCircleIcon fontSize="small" />}
                                                            label={user?.isAdmin ? "Administrator" : "Standard User"}
                                                            color={user?.isAdmin ? "success" : "default"}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                fontFamily: '"Poppins", sans-serif', 
                                                                fontWeight: 500,
                                                                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Reset Password">
                                                            <IconButton
                                                                onClick={() => openResetPasswordModal(user?._id, user?.name)}
                                                                sx={{
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: theme.palette.primary.main,
                                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                                    borderRadius: 2,
                                                                    width: { xs: 32, sm: 36, md: 40 },
                                                                    height: { xs: 32, sm: 36, md: 40 },
                                                                    '&:hover': {
                                                                        backgroundColor: theme.palette.primary.main,
                                                                        color: 'white',
                                                                        transform: 'scale(1.05)',
                                                                    },
                                                                    transition: 'all 0.2s ease-in-out',
                                                                    animation: `${pulseAnimation} 2s infinite`
                                                                }}
                                                            >
                                                                <LockResetIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box
                                        sx={{
                                            mt: { xs: 2, sm: 3 },
                                            pt: { xs: 2, sm: 3 },
                                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            width: '100%',
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            spacing={{ xs: 1, sm: 2 }}
                                        >
                                            <PoppinsTypography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{
                                                    fontWeight: 400,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            >
                                                Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                                            </PoppinsTypography>

                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                showFirstButton={!isSmallMobile}
                                                showLastButton={!isSmallMobile}
                                                siblingCount={isSmallMobile ? 0 : 1}
                                                boundaryCount={isSmallMobile ? 1 : 1}
                                                sx={{
                                                    '& .MuiPaginationItem-root': {
                                                        borderRadius: 2,
                                                        minWidth: { xs: 24, sm: 32 },
                                                        height: { xs: 24, sm: 32 },
                                                        fontFamily: '"Poppins", sans-serif',
                                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                        margin: { xs: '0 2px', sm: '0 4px' }
                                                    },
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                )}
                            </>
                        )}
                    </CardContent>
                </GlassCard>

                {/* Reset Password Modal */}
                <GlassDialog
                    open={resetPasswordModal.isOpen}
                    onClose={closeResetPasswordModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        pb: 2,
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        <LockResetIcon sx={{ 
                            mr: 1, 
                            color: 'primary.main',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }} />
                        Reset Password
                        <IconButton
                            aria-label="close"
                            onClick={closeResetPasswordModal}
                            sx={{
                                position: 'absolute',
                                right: { xs: 8, sm: 12 },
                                top: { xs: 8, sm: 12 },
                                color: 'text.secondary',
                                padding: { xs: '4px', sm: '8px' }
                            }}
                            size="small"
                        >
                            <CloseIcon fontSize={isSmallMobile ? "small" : "medium"} />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ 
                        mt: { xs: 2, sm: 3 },
                        '&.MuiDialogContent-root': {
                            overflowY: 'visible'
                        }
                    }}>
                        {/* User Info */}
                        <GlassCard sx={{ mb: 3 }}>
                            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                <Stack spacing={1}>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            fontFamily: '"Poppins", sans-serif',
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                        <strong>User:</strong> &nbsp;{resetPasswordModal.userName}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            fontFamily: '"Poppins", sans-serif',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                        }}
                                    >
                                        <KeyIcon fontSize="small" sx={{ mr: 1 }} />
                                        Please enter the new password for this user
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </GlassCard>

                        <Box component="form" onSubmit={handleResetPassword}>
                            <Stack spacing={{ xs: 2, sm: 3 }}>
                                {/* New Password Field */}
                                <GlassTextField
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    type={passwordVisible.newPassword ? "text" : "password"}
                                    value={resetPasswordModal.newPassword}
                                    onChange={handleResetPasswordInputChange}
                                    required
                                    placeholder="Enter new password"
                                    inputProps={{ minLength: 6 }}
                                    size={isSmallMobile ? "small" : "medium"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon fontSize={isSmallMobile ? "small" : "medium"} color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('newPassword')}
                                                    edge="end"
                                                    size={isSmallMobile ? "small" : "medium"}
                                                >
                                                    {passwordVisible.newPassword ? 
                                                        <VisibilityOffIcon fontSize={isSmallMobile ? "small" : "medium"} /> : 
                                                        <VisibilityIcon fontSize={isSmallMobile ? "small" : "medium"} />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* Confirm Password Field */}
                                <GlassTextField
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={passwordVisible.confirmPassword ? "text" : "password"}
                                    value={resetPasswordModal.confirmPassword}
                                    onChange={handleResetPasswordInputChange}
                                    required
                                    placeholder="Confirm new password"
                                    inputProps={{ minLength: 6 }}
                                    size={isSmallMobile ? "small" : "medium"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CheckCircleIcon fontSize={isSmallMobile ? "small" : "medium"} color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                                    edge="end"
                                                    size={isSmallMobile ? "small" : "medium"}
                                                >
                                                    {passwordVisible.confirmPassword ? 
                                                        <VisibilityOffIcon fontSize={isSmallMobile ? "small" : "medium"} /> : 
                                                        <VisibilityIcon fontSize={isSmallMobile ? "small" : "medium"} />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ 
                        p: { xs: 2, sm: 3 }, 
                        pt: 0, 
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` 
                    }}>
                        <Button
                            onClick={closeResetPasswordModal}
                            size={isSmallMobile ? "small" : "large"}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                        >
                            Cancel
                        </Button>
                        <PrimaryButton
                            onClick={handleResetPassword}
                            variant="contained"
                            size={isSmallMobile ? "small" : "large"}
                            startIcon={<LockResetIcon />}
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                        >
                            Reset Password
                        </PrimaryButton>
                    </DialogActions>
                </GlassDialog>
            </Box>
        </>
    );
};

export default UserDashboard;