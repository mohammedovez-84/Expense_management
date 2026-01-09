import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Avatar,
    LinearProgress,
} from "@mui/material";

import {
    Dashboard as DashboardIcon,
    Receipt as ExpensesIcon,
    People as UsersIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Assessment as ReportsIcon,
    MonetizationOn,
    AccountBalanceWallet,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const AdminSidebar = ({
    open,
    onClose,
}) => {
    const dispatch = useDispatch();
    const { csrf, loading: logoutLoader, user } = useSelector((state) => state?.auth || {});
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeItem, setActiveItem] = useState("");
    const [hoveredItem, setHoveredItem] = useState(null);
    const [loadingItems, setLoadingItems] = useState({});

    // Menu items with Material UI icons
    const menuItems = [
        { 
            text: "Dashboard", 
            icon: <DashboardIcon />, 
            path: "/admin/dashboard",
            gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#3b82f6"
        },
        { 
            text: "Budgeting", 
            icon: <MonetizationOn />, 
            path: "/admin/budget",
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            color: "#8b5cf6"
        },
        { 
            text: "Expenses", 
            icon: <ExpensesIcon />, 
            path: "/admin/expenses",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#10b981"
        },
        { 
            text: "Reimbursement", 
            icon: <AccountBalanceWallet />, 
            path: "/admin/reimbursements",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#f59e0b"
        },
        { 
            text: "Reports", 
            icon: <ReportsIcon />, 
            path: "/admin/report",
            gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#ef4444"
        },
        { 
            text: "Users", 
            icon: <UsersIcon />, 
            path: "/admin/user",
            gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
            color: "#ec4899"
        },
        { 
            text: "Settings", 
            icon: <SettingsIcon />, 
            path: "/admin/settings",
            gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
            color: "#6b7280"
        }
    ];

    // Set active item based on current path
    useEffect(() => {
        const currentPath = location.pathname;
        const matchingItem = menuItems.find(item => currentPath.startsWith(item.path));
        if (matchingItem) {
            setActiveItem(matchingItem.path);
        } else {
            setActiveItem(currentPath);
        }
    }, [location.pathname]);

    const handleMenuItemClick = (path) => {
        setLoadingItems(prev => ({ ...prev, [path]: true }));
        
        setTimeout(() => {
            navigate(path);
            if (isMobile) onClose();
            setLoadingItems(prev => ({ ...prev, [path]: false }));
        }, 300);
    };

    const handleLogoutClick = async () => {
        await dispatch(logout(csrf));
    };

    // Logo Component
    const Logo = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: { xs: '10px 0', md: '20px 0 10px 0' },
            }}
        >
            <Box
                sx={{
                    width: { xs: '160px', md: '200px' },
                    height: { xs: '40px', md: '50px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <img
                    src="/image.png"
                    alt="DEMANDCURVE"
                    style={{
                        width: 'auto',
                        height: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                    }}
                    onError={(e) => {
                        e.target.src = "/image.svg";
                        e.target.onerror = () => {
                            e.target.src = "/vite.svg";
                            e.target.onerror = () => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.display = 'none';
                            };
                        };
                    }}
                />
            </Box>
        </Box>
    );

    // User Profile Component
    const UserProfile = () => (
        <Box
            sx={{
                p: { xs: 1.5, md: 2 },
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 2 },
                borderRadius: '12px',
                margin: { xs: '0 12px 12px', md: '0 16px 16px' },
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            }}
        >
            <Avatar
                sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                    }}
                >
                    {user?.name || 'Malik Muzammil'}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: '#6b7280',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: "'Poppins', sans-serif",
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.6rem', md: '0.7rem' },
                        letterSpacing: '0.5px',
                        fontWeight: 600,
                    }}
                >
                    {user?.role || 'superadmin'}
                </Typography>
            </Box>
        </Box>
    );

    const SidebarContent = () => (
        <Box 
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: '#ffffff',
                color: '#334155',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
                fontFamily: "'Poppins', sans-serif",
                width: '100%',
            }}
        >
            {/* Font import in global CSS is recommended, but here's local fallback */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                * {
                    font-family: 'Poppins', sans-serif;
                }
                `}
            </style>

            {/* Header */}
            <Box sx={{
                p: { xs: '15px 15px 8px 15px', md: '20px 20px 10px 20px' },
                position: 'relative',
                zIndex: 1,
                borderBottom: '1px solid #e5e7eb',
            }}>
                <Logo />
            </Box>

            {/* User Profile */}
            <UserProfile />

            <Divider sx={{ 
                mx: { xs: 1.5, md: 2 }, 
                mb: 1, 
                borderColor: '#e5e7eb' 
            }} />

            {/* Navigation Menu */}
            <List 
                sx={{
                    flex: 1,
                    px: { xs: 1.5, md: 2 },
                    py: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '2px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(59, 130, 246, 0.4)',
                    },
                }}
            >
                {menuItems.map((item) => {
                    const isActive = activeItem === item.path;
                    const isHovered = hoveredItem === item.path;
                    const isLoading = loadingItems[item.path];

                    return (
                        <ListItem
                            key={item.path}
                            onClick={() => handleMenuItemClick(item.path)}
                            onMouseEnter={() => setHoveredItem(item.path)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                borderRadius: '10px',
                                mb: 0.5,
                                px: { xs: 1.5, md: 2 },
                                py: { xs: 1, md: 1.25 },
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                background: isActive
                                    ? item.gradient
                                    : 'transparent',
                                border: isActive
                                    ? 'none'
                                    : '1px solid transparent',
                                '&:hover': {
                                    background: isActive ? item.gradient : 'rgba(59, 130, 246, 0.05)',
                                    borderColor: isActive ? 'transparent' : 'rgba(59, 130, 246, 0.2)',
                                    transform: 'translateX(2px)',
                                    '& .menu-icon': {
                                        color: isActive ? 'white' : item.color,
                                    }
                                },
                                '&:active': {
                                    transform: 'translateX(0)',
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive ? 'white' : '#6b7280',
                                    minWidth: { xs: '32px', md: '36px' },
                                    marginRight: { xs: 1.5, md: 2 },
                                    transition: 'all 0.2s ease',
                                }}
                                className="menu-icon"
                            >
                                {item.icon}
                            </ListItemIcon>
                            
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: isActive ? 600 : 500,
                                            color: isActive ? 'white' : '#374151',
                                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                                            transition: 'all 0.2s ease',
                                            fontFamily: "'Poppins', sans-serif",
                                            letterSpacing: '0.2px',
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                }
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontFamily: "'Poppins', sans-serif",
                                    }
                                }}
                            />
                            
                            {/* Loading indicator */}
                            {isLoading && (
                                <LinearProgress 
                                    sx={{ 
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: 'transparent',
                                        '& .MuiLinearProgress-bar': {
                                            background: item.gradient,
                                            animationDuration: '1.5s',
                                        }
                                    }} 
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Button */}
            <Box sx={{
                p: { xs: 1.5, md: 2 },
                pt: 0,
            }}>
                <ListItem
                    onClick={handleLogoutClick}
                    disabled={logoutLoader}
                    onMouseEnter={() => setHoveredItem('logout')}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                        borderRadius: '10px',
                        px: { xs: 1.5, md: 2 },
                        py: { xs: 1, md: 1.25 },
                        background: hoveredItem === 'logout'
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : 'transparent',
                        border: `1px solid ${hoveredItem === 'logout' 
                            ? '#ef4444' 
                            : 'rgba(239, 68, 68, 0.1)'}`,
                        color: hoveredItem === 'logout' ? 'white' : '#ef4444',
                        transition: 'all 0.2s ease',
                        cursor: logoutLoader ? 'not-allowed' : 'pointer',
                        '&:hover': {
                            background: !logoutLoader ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'transparent',
                            color: !logoutLoader ? 'white' : '#ef4444',
                            borderColor: !logoutLoader ? '#ef4444' : 'rgba(239, 68, 68, 0.1)',
                            transform: 'translateX(2px)',
                        },
                        '&:active': {
                            transform: 'translateX(0)',
                        },
                        '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed',
                            transform: 'none',
                        }
                    }}
                >
                    <ListItemIcon 
                        sx={{
                            color: 'inherit',
                            minWidth: { xs: '32px', md: '36px' },
                            marginRight: { xs: 1.5, md: 2 },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <LogoutIcon fontSize={isMobile ? "small" : "medium"} />
                    </ListItemIcon>
                    
                    <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                                    color: 'inherit',
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                {logoutLoader ? "Logging out..." : "Logout"}
                            </Typography>
                        }
                    />
                    
                    {logoutLoader && (
                        <Box 
                            sx={{
                                width: { xs: 14, md: 16 },
                                height: { xs: 14, md: 16 },
                                borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white',
                                animation: 'spin 1s linear infinite',
                                marginLeft: 1,
                            }} 
                        />
                    )}
                </ListItem>
            </Box>

            {/* Version Info */}
            <Box sx={{
                p: { xs: 1, md: 2 },
                textAlign: 'center',
                borderTop: '1px solid #e5e7eb',
            }}>
                <Typography 
                    variant="caption" 
                    sx={{
                        color: '#6b7280',
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        opacity: 0.7,
                        fontFamily: "'Poppins', sans-serif",
                        letterSpacing: '0.3px',
                    }}
                >
                    Admin Dashboard v2.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: 260, sm: 280 },
                        border: 'none',
                        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)',
                        fontFamily: "'Poppins', sans-serif",
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 1300,
                    }
                }}
            >
                <SidebarContent />
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: 280,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        border: 'none',
                        boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
                        position: 'fixed',
                        height: '100vh',
                        top: 0,
                        left: 0,
                        zIndex: 1200,
                        fontFamily: "'Poppins', sans-serif",
                        overflowX: 'hidden',
                    }
                }}
                open
            >
                <SidebarContent />
            </Drawer>
        </>
    );
};

export default AdminSidebar;