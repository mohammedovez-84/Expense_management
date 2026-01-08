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
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PieChartIcon from "@mui/icons-material/PieChart";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const UserSidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { csrf, loading: authLoading } = useSelector((state) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Menu Items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/user/dashboard" },
    { text: "Budgeting", icon: <PieChartIcon />, path: "/user/budgeting" },
    { text: "Expenses", icon: <AttachMoneyIcon />, path: "/user/expenses" },
    { text: "Settings", icon: <SettingsIcon />, path: "/user/settings" },
  ];

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleMenuItemClick = (path) => {
    navigate(path);
    setActiveItem(path);
    if (isMobile) onClose();
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await dispatch(logout(csrf)).unwrap();
      // Navigation will be handled by the logout thunk or useEffect in App
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (show toast, etc.)
    } finally {
      setLogoutLoading(false);
      if (isMobile) onClose();
    }
  };

  // Logo Component
  const Logo = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: isSmallMobile ? "4px 0" : "6px 0",
      }}
    >
      <Box
        sx={{
          width: isSmallMobile ? "180px" : isMobile ? "250px" : "320px",
          height: isSmallMobile ? "80px" : "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "4px",
        }}
      >
        <img
          src="/image.png"
          alt="Company Logo"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );

  // Mobile Header with Hamburger Menu
  const MobileHeader = () => (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Logo />
      <IconButton onClick={onClose} size="large">
        <CloseIcon />
      </IconButton>
    </Box>
  );

  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#333333",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Mobile Header (only on mobile) */}
      {isMobile && <MobileHeader />}

      {/* Desktop Header (only on desktop) */}
      {!isMobile && (
        <Box
          sx={{
            p: isSmallMobile ? 0 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isSmallMobile ? "55px" : "97px",
            background: "rgba(255,255,255,0.9)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Logo />
        </Box>
      )}

      <Divider sx={{ my: 1, mx: isSmallMobile ? 1 : 2 }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: isSmallMobile ? 1 : 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.path;
          const isHovered = hoveredItem === item.path;

          return (
            <ListItem
              key={item.path}
              component="button"
              onClick={() => handleMenuItemClick(item.path)}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: isSmallMobile ? 0 : 0.5,
                px: isSmallMobile ? 1.5 : 2,
                py: isSmallMobile ? 1 : 1.25,
                cursor: "pointer",
                background:
                  isActive || isHovered
                    ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                    : "transparent",
                border: isActive
                  ? "1px solid #3b82f6"
                  : "1px solid transparent",
                color: isActive || isHovered ? "white" : "#374151",
                transition: "all 0.3s ease",
                transform: isHovered ? "translateX(8px)" : "none",
                boxShadow:
                  isActive || isHovered
                    ? "0 4px 15px rgba(59,130,246,0.25)"
                    : "none",
                "&:hover": {
                  background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                  color: "white",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: isSmallMobile ? 32 : 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: isSmallMobile ? "0.8rem" : "0.875rem",
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: isSmallMobile ? 1.5 : 2.5, pt: 0 }}>
        <ListItem
          component="button"
          onClick={handleLogout}
          disabled={logoutLoading || authLoading}
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          sx={{
            borderRadius: 2,
            px: isSmallMobile ? 1.5 : 2,
            py: isSmallMobile ? 1 : 1.5,
            background:
              hoveredItem === "logout" || logoutLoading
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "rgba(239,68,68,0.1)",
            border: `1px solid ${
              hoveredItem === "logout" || logoutLoading
                ? "#ef4444"
                : "rgba(239,68,68,0.2)"
            }`,
            color: hoveredItem === "logout" || logoutLoading ? "white" : "#ef4444",
            transition: "all 0.3s ease",
            cursor: logoutLoading ? "not-allowed" : "pointer",
            "&:hover": {
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
            },
            "&:focus": {
              outline: "none",
            },
            "&:disabled": {
              opacity: 0.7,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            {logoutLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LogoutIcon />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography fontWeight={600}>
                {logoutLoading ? "Logging out..." : "Logout"}
              </Typography>
            }
          />
        </ListItem>
      </Box>
    </Box>
  );

  const drawerWidth = isSmallMobile ? 280 : 320;

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            boxShadow: "16px 0 40px rgba(0,0,0,0.15)",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 300,
            border: "none",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: 1200,
            backgroundColor: "#ffffff",
            overflowY: "auto",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

export default UserSidebar;