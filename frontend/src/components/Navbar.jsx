import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Box,
    FormControl,
    Select,
    useMediaQuery,
    useTheme,
    Avatar,
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    Menu as MenuIcon,
    Business as BusinessIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logout } from "../store/authSlice";
import { useLocation } from "../contexts/LocationContext";

const Navbar = ({
    onMenuClick,
}) => {
    const { user } = useSelector((state) => state.auth)
    const { csrf } = useSelector((state) => state?.auth)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { currentLoc, setCurrentLoc } = useLocation()

    React.useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = async () => {
        await dispatch(logout(csrf))
    };

    // Enhanced locations array
    const locations = [
        { id: "overall", name: "Overall", value: "OVERALL", color: "#28be5dff" },
        { id: "bangalore", name: "Bangalore", value: "BENGALURU", color: "#3f51b5" },
        { id: "mumbai", name: "Mumbai", value: "MUMBAI", color: "#f44336" },
    ];

    // Helper function to get location name
    const getLocationName = (locationValue) => {
        const location = locations.find(loc => loc.value === locationValue);
        return location ? location.name : "Overall";
    };

    // Helper function to get location color
    const getLocationColor = (locationValue) => {
        const location = locations.find(loc => loc.value === locationValue);
        return location ? location.color : "#28be5dff";
    };

    // Handle location change for desktop dropdown
    const handleDesktopLocationChange = (event) => {
        const newLocation = event.target.value;
        setCurrentLoc(newLocation);
    };

    // Handle location change for mobile dropdown
    const handleMobileLocationChange = (event) => {
        const newLocation = event.target.value;
        setCurrentLoc(newLocation);
    };

    const menuId = 'primary-search-account-menu';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: (theme) => theme.zIndex.drawer + 100,
                height: '64px'
            }}
        >
            <Toolbar sx={{
                minHeight: '64px',
                px: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}>
                {/* Hamburger Menu for Mobile */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{
                        mr: 2,
                        display: { md: 'none' },
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Right side controls */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    ml: 'auto',
                }}>
                    {/* Company State Dropdown for Desktop */}
                    {!isMobile && user?.role === "superadmin" && (
                        <FormControl size="small" sx={{ minWidth: 140, mr: 1 }}>
                            <Select
                                value={currentLoc || "OVERALL"}
                                onChange={handleDesktopLocationChange}
                                displayEmpty
                                sx={{
                                    height: 36,
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                }}
                                renderValue={(selected) => {
                                    const location = locations.find(loc => loc.value === selected);
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <BusinessIcon
                                                sx={{
                                                    mr: 1,
                                                    fontSize: 16,
                                                    color: location?.color || "#28be5dff"
                                                }}
                                            />
                                            <Box component="span" sx={{ fontSize: '0.875rem' }}>
                                                {location?.name || "Overall"}
                                            </Box>
                                        </Box>
                                    );
                                }}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <BusinessIcon
                                                sx={{
                                                    mr: 1.5,
                                                    fontSize: 16,
                                                    color: location.color
                                                }}
                                            />
                                            <Box component="span" sx={{ fontSize: '0.875rem' }}>
                                                {location.name}
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {/* Three dots menu */}
                    <IconButton
                        edge="end"
                        aria-label="show more"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ p: 0.5 }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    id={menuId}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            minWidth: 200,
                            borderRadius: 1,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    {/* Location Selector for Mobile */}
                    {isMobile && user?.role === "superadmin" && (
                        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                            <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1, display: 'block' }}>
                                Select Location
                            </Box>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={currentLoc || "OVERALL"}
                                    onChange={handleMobileLocationChange}
                                    displayEmpty
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    {locations.map((location) => (
                                        <MenuItem key={location.id} value={location.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BusinessIcon
                                                    sx={{
                                                        mr: 1.5,
                                                        fontSize: 16,
                                                        color: location.color
                                                    }}
                                                />
                                                <Box component="span" sx={{ fontSize: '0.875rem' }}>
                                                    {location.name}
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    {/* Current Location Display */}
                    {user?.role === "superadmin" && (
                        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon
                                    sx={{
                                        mr: 1.5,
                                        fontSize: 16,
                                        color: getLocationColor(currentLoc)
                                    }}
                                />
                                <Box>
                                    <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, display: 'block' }}>
                                        Current Location
                                    </Box>
                                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                        {getLocationName(currentLoc)}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* User Info */}
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                            src={user?.avatarUrl || ''}
                        >
                            {!user?.avatarUrl && user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : 'U'}
                        </Avatar>
                        <Box>
                            <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, display: 'block' }}>
                                {user?.name || 'User'}
                            </Box>
                            <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                {user?.role || 'Member'}
                            </Box>
                        </Box>
                    </Box>

                    {/* Logout Option */}
                    <MenuItem onClick={handleLogoutClick} sx={{ fontSize: '0.875rem' }}>
                        <LogoutIcon sx={{ mr: 2, fontSize: 18 }} />
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;