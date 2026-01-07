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
  Chip,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PieChartIcon from "@mui/icons-material/PieChart";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const UserSidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { csrf, loading: logoutLoader } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  // 🔹 USER MENU (same pattern as AdminSidebar)
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

  const handleLogoutClick = async () => {
    await dispatch(logout(csrf));
  };

  // 🔹 LOGO (same as AdminSidebar)
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
      {/* HEADER */}
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

      <Divider sx={{ my: 1, mx: isSmallMobile ? 1 : 2 }} />

      {/* MENU */}
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

      {/* LOGOUT */}
      <Box sx={{ p: isSmallMobile ? 1.5 : 2.5, pt: 0 }}>
        <ListItem
          component="button"
          onClick={handleLogoutClick}
          disabled={logoutLoader}
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          sx={{
            borderRadius: 2,
            px: isSmallMobile ? 1.5 : 2,
            py: isSmallMobile ? 1 : 1.5,
            background:
              hoveredItem === "logout"
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "rgba(239,68,68,0.1)",
            border: `1px solid ${
              hoveredItem === "logout"
                ? "#ef4444"
                : "rgba(239,68,68,0.2)"
            }`,
            color: hoveredItem === "logout" ? "white" : "#ef4444",
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography fontWeight={600}>Logout</Typography>
            }
          />
        </ListItem>
      </Box>
    </Box>
  );

  const drawerWidth = isSmallMobile ? 280 : 320;

  return (
    <>
      {/* MOBILE DRAWER (ARIA FIXED) */}
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
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* DESKTOP DRAWER */}
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
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

export default UserSidebar;
