import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";

const ExpenseStats = ({ stats }) => {
  const isSmallMobile = useMediaQuery("(max-width:400px)");

  const StatCard = ({ title, value, icon, color, subtitle }) => {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: "white",
          borderRadius: 3,
          boxShadow: 3,
          height: "100%",
          minHeight: isSmallMobile ? 120 : 140,
          display: "flex",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 4,
        width: "100%",
      }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Box>
  );
};

export default ExpenseStats;
