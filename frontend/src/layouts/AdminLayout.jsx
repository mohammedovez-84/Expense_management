import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "#f8fafc",
            overflow: "hidden",
            position: "relative"
        }}>
            {/* Sidebar */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1200,
                    display: {
                        xs: sidebarOpen ? "block" : "none",
                        md: "block"
                    }
                }}
            >
                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: {
                        xs: "100%",
                        md: "calc(100% - 280px)"
                    },
                    ml: {
                        xs: 0,
                        md: "280px"
                    },
                    transition: "all 0.3s ease",
                    position: "relative",
                    minHeight: "100vh"
                }}
            >
                <Navbar
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Content Area */}
                <Box sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: {
                        xs: "calc(100vh - 60px)",
                        sm: "calc(100vh - 68px)"
                    },
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                    }
                }}>
                    <Outlet />
                </Box>
            </Box>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0, 0, 0, 0.3)",
                        zIndex: 1100,
                        display: { xs: "block", md: "none" }
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </Box>
    );
}