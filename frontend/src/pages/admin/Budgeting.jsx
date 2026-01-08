import React, { useEffect, useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Paper,
  alpha,
  Button,
  IconButton,
  Chip,
  keyframes,
  styled,
  GlobalStyles
} from "@mui/material";
import { useBudgeting } from "../../hooks/useBudgeting";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../store/authSlice";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from "@mui/icons-material/Savings";
import GroupsIcon from "@mui/icons-material/Groups";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BudgetForm from "../../components/admin/budgeting/BudgetForm";
import BudgetTable from "../../components/admin/budgeting/BudgetTable";
import EditBudgetModal from "../../components/admin/budgeting/BudgetEditModal";

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

const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef(value);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0 : value;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  if (typeof value === 'string' && value.includes('₹')) {
    return `₹${Math.round(displayValue).toLocaleString()}`;
  }
  
  return Math.round(displayValue).toLocaleString();
};

const StatCard = React.memo(({ stat, index }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <GlassCard 
      cardcolor={stat.color}
      sx={{ 
        animation: `${slideInFromLeft} 0.5s ease forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        height: '100%'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <PoppinsTypography variant="subtitle2" sx={{ 
              color: 'text.secondary', 
              fontWeight: 500, 
              mb: 0.5,
              fontSize: '0.875rem',
              letterSpacing: '0.3px'
            }}>
              {stat.title}
            </PoppinsTypography>
            <PoppinsTypography variant="h4" sx={{ 
              fontWeight: 700, 
              color: stat.color, 
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.5px'
            }}>
              <AnimatedNumber value={stat.value} />
            </PoppinsTypography>
            <PoppinsTypography variant="caption" sx={{ 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 400
            }}>
              <Box 
                sx={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: alpha(stat.color, 0.5) 
                }} 
              />
              {stat.subtitle}
            </PoppinsTypography>
          </Box>
          
          <Box sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
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
          }}>
            {React.cloneElement(stat.icon, { sx: { fontSize: 26 } })}
          </Box>
        </Box>
        
        {stat.trend && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 2, 
            pt: 2, 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '20px',
              background: alpha(stat.trendColor || (stat.trend.startsWith('+') ? '#10b981' : '#ef4444'), 0.1),
              color: stat.trendColor || (stat.trend.startsWith('+') ? '#10b981' : '#ef4444'),
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif'
            }}>
              {stat.trend.startsWith('+') ? (
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
              )}
              {stat.trend}
            </Box>
            <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', ml: 1, fontWeight: 400 }}>
              vs last month
            </PoppinsTypography>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
});

const BudgetingHeader = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      mb: 4,
      animation: `${fadeIn} 0.6s ease forwards`
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <PoppinsTypography variant="h4" sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            letterSpacing: '-0.5px'
          }}>
            Budget Management
          </PoppinsTypography>
          <PoppinsTypography variant="body1" sx={{ 
            color: 'text.secondary',
            maxWidth: '600px',
            fontWeight: 400,
            fontSize: '0.95rem'
          }}>
            Allocate, track, and manage budgets efficiently across departments and teams
          </PoppinsTypography>
        </Box>
      </Box>
    </Box>
  );
};

const BudgetUsageChart = () => {
  const theme = useTheme();
  const usageData = [
    { department: 'Sales', allocated: 100000, spent: 75000, remaining: 25000 },
    { department: 'Data', allocated: 80000, spent: 45000, remaining: 35000 },
    { department: 'Office', allocated: 50000, spent: 30000, remaining: 20000 },
    { department: 'HR', allocated: 30000, spent: 20000, remaining: 10000 },
    { department: 'IT', allocated: 60000, spent: 40000, remaining: 20000 },
  ];

  const totalAllocated = usageData.reduce((acc, d) => acc + d.allocated, 0);
  const totalSpent = usageData.reduce((acc, d) => acc + d.spent, 0);
  const overallUsage = ((totalSpent / totalAllocated) * 100).toFixed(1);

  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Budget Usage Overview
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Department-wise budget utilization
            </PoppinsTypography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Overall Usage:
            </PoppinsTypography>
            <PoppinsTypography variant="h6" sx={{ 
              fontWeight: 700, 
              color: overallUsage > 80 ? '#ef4444' : overallUsage > 60 ? '#f59e0b' : '#10b981' 
            }}>
              {overallUsage}%
            </PoppinsTypography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          {usageData.map((dept, index) => {
            const usagePercentage = ((dept.spent / dept.allocated) * 100).toFixed(1);
            const progressColor = usagePercentage > 80 ? '#ef4444' : usagePercentage > 60 ? '#f59e0b' : '#10b981';
            
            return (
              <Box key={dept.department} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <PoppinsTypography variant="body2" sx={{ fontWeight: 500 }}>
                    {dept.department}
                  </PoppinsTypography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      ₹{dept.spent.toLocaleString()} / ₹{dept.allocated.toLocaleString()}
                    </PoppinsTypography>
                    <PoppinsTypography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: progressColor,
                      fontSize: '0.875rem'
                    }}>
                      {usagePercentage}%
                    </PoppinsTypography>
                  </Box>
                </Box>
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha(progressColor, 0.1),
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${usagePercentage}%`,
                      background: `linear-gradient(90deg, ${progressColor}, ${alpha(progressColor, 0.7)})`,
                      borderRadius: 4,
                      animation: `${fadeIn} 1s ease forwards`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Remaining: ₹{dept.remaining.toLocaleString()}
                  </PoppinsTypography>
                  <PoppinsTypography variant="caption" sx={{ 
                    color: progressColor,
                    fontWeight: 500
                  }}>
                    {usagePercentage > 80 ? 'Over Budget' : usagePercentage > 60 ? 'Near Limit' : 'On Track'}
                  </PoppinsTypography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          mt: 4, 
          pt: 3, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          flexWrap: 'wrap' 
        }}>
          {[
            { label: 'Allocated', color: '#3b82f6', value: `₹${totalAllocated.toLocaleString()}` },
            { label: 'Spent', color: '#ef4444', value: `₹${totalSpent.toLocaleString()}` },
            { label: 'Remaining', color: '#10b981', value: `₹${(totalAllocated - totalSpent).toLocaleString()}` }
          ].map((item, index) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '4px', 
                background: item.color,
                animation: `${pulseAnimation} 2s infinite`,
                animationDelay: `${index * 0.5}s`,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: '6px',
                  border: `1px solid ${item.color}`,
                  opacity: 0.3,
                }
              }} />
              <Box>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 400 }}>
                  {item.label}
                </PoppinsTypography>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.value}
                </PoppinsTypography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </GlassCard>
  );
};

const RecentBudgetActivities = () => {
  const theme = useTheme();
  const activities = [
    { id: 1, user: 'John Doe', action: 'created budget for Marketing', amount: '₹100,000', time: '2 hours ago', color: '#3b82f6' },
    { id: 2, user: 'Jane Smith', action: 'updated Operations budget', amount: '₹15,000', time: '5 hours ago', color: '#10b981' },
    { id: 3, user: 'Robert Brown', action: 'approved budget increase', amount: '₹25,000', time: '1 day ago', color: '#f59e0b' },
    { id: 4, user: 'Sarah Wilson', action: 'allocated new budget', amount: '₹50,000', time: '2 days ago', color: '#8b5cf6' },
  ];

  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Recent Activities
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Latest budget changes and approvals
            </PoppinsTypography>
          </Box>
          <Chip 
            label="Live" 
            size="small" 
            color="success" 
            sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          {activities.map((activity, index) => (
            <Box 
              key={activity.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                animation: `${fadeIn} 0.5s ease forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  borderColor: alpha(activity.color, 0.3),
                  background: alpha(activity.color, 0.05)
                }
              }}
            >
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(activity.color, 0.1),
                color: activity.color,
                fontWeight: 600,
                fontFamily: '"Poppins", sans-serif',
              }}>
                {activity.user.charAt(0)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 500 }}>
                  {activity.user} <PoppinsTypography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    {activity.action}
                  </PoppinsTypography>
                </PoppinsTypography>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                  {activity.time} • Amount: {activity.amount}
                </PoppinsTypography>
              </Box>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: activity.color,
                animation: `${pulseAnimation} 2s infinite`,
                animationDelay: `${index * 0.3}s`
              }} />
            </Box>
          ))}
        </Box>

        <Button
          fullWidth
          sx={{
            mt: 2,
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: '"Poppins", sans-serif',
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              background: alpha(theme.palette.primary.main, 0.04)
            }
          }}
        >
          View All Activities
        </Button>
      </CardContent>
    </GlassCard>
  );
};

const Budgeting = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    allBudgets,
    budgets,
    loading,
    meta,
    users,
    page,
    setPage,
    formData,
    setFormData,
    open,
    handleOpen,
    handleClose,
    handleChange,
    handleAdd,
    handleSubmit,
    search,
    setSearch,
    filterMonth,
    setFilterMonth,
    filterYear,
    setFilterYear,
    getMonthByNumber,
    setLimit,
    limit,
  } = useBudgeting();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Budget Stats Calculations
  const totalAllocated =
    allBudgets?.reduce((acc, b) => acc + (Number(b.allocatedAmount) || 0), 0) || 0;
  const totalSpent =
    allBudgets?.reduce((acc, b) => acc + (Number(b.spentAmount) || 0), 0) || 0;
  const remainingBalance = totalAllocated - totalSpent;
  const averageUsage = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0;

  // Budget Stats Cards
  const budgetStats = [
    {
      title: "Total Allocated",
      value: `₹${totalAllocated.toLocaleString()}`,
      icon: <AccountBalanceIcon />,
      color: "#3b82f6",
      subtitle: "Total budget allocation",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      trend: totalAllocated > 500000 ? "+12.5%" : "+5.2%",
      trendColor: totalAllocated > 500000 ? "#10b981" : "#f59e0b"
    },
    {
      title: "Total Expenses",
      value: `₹${totalSpent.toLocaleString()}`,
      icon: <MonetizationOnIcon />,
      color: "#ef4444",
      subtitle: `Total budget used`,
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      trend: totalSpent > 400000 ? "+8.7%" : "-2.1%",
      trendColor: totalSpent > 400000 ? "#ef4444" : "#10b981"
    },
    {
      title: "Remaining Balance",
      value: `₹${remainingBalance.toLocaleString()}`,
      icon: <SavingsIcon />,
      color: "#10b981",
      subtitle: "Available funds",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      trend: remainingBalance > 200000 ? "+15.3%" : "-5.8%",
      trendColor: remainingBalance > 200000 ? "#10b981" : "#ef4444"
    },
    {
      title: "Budget Allocations",
      value: allBudgets?.length || 0,
      icon: <GroupsIcon />,
      color: "#f59e0b",
      subtitle: "Total allocations",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      trend: "+7.2%",
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
          width: '10px',
          height: '10px'
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
        p: { xs: 1.5, sm: 2, md: 3 }, 
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Poppins", sans-serif',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)`,
          pointerEvents: 'none'
        }
      }}>
        <BudgetingHeader />
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {budgetStats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Charts and Activities Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <BudgetUsageChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentBudgetActivities />
          </Grid>
        </Grid>

        {/* Budget Form */}
        <GlassCard sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>
              Create New Budget
            </PoppinsTypography>
            <BudgetForm
              users={users}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleAdd={handleAdd}
              loading={loading}
            />
          </CardContent>
        </GlassCard>

        {/* Budget Table Section */}
        <Box sx={{ 
          animation: `${fadeIn} 0.6s ease forwards`,
          animationDelay: '0.4s',
          opacity: 0,
          fontFamily: '"Poppins", sans-serif',
        }}>
          <GlassCard>
            <CardContent sx={{ p: 0 }}>
              <BudgetTable
                showPagination
                limit={limit}
                setLimit={setLimit}
                budgets={budgets}
                loading={loading}
                meta={meta}
                page={page}
                setPage={setPage}
                search={search}
                setSearch={setSearch}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                getMonthByNumber={getMonthByNumber}
                handleOpen={handleOpen}
              />
            </CardContent>
          </GlassCard>
        </Box>

        {/* Edit Budget Modal */}
        <EditBudgetModal
          open={open}
          handleClose={handleClose}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Box>
    </>
  );
};

export default Budgeting;