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
  Tabs,
  Tab,
  Stack,
  keyframes,
  styled,
  GlobalStyles
} from "@mui/material";
import { useExpenses } from "../../hooks/useExpenses";
import { useNavigate } from "react-router-dom";
import ExpenseTable from "../../components/admin/expense/ExpenseTable";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
        height: '100%',
        mb: 2
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
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
              fontSize: { xs: '1.5rem', md: '1.75rem' },
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
              {stat.subtitle || 'Department expenses'}
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
            ml: 2
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

const ExpensesHeader = ({ isAdminTab, setTab, tab }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Box sx={{ 
      mb: 4,
      animation: `${fadeIn} 0.6s ease forwards`
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <PoppinsTypography variant="h4" sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            letterSpacing: '-0.5px'
          }}>
            Expense Management
          </PoppinsTypography>
          <PoppinsTypography variant="body1" sx={{ 
            color: 'text.secondary',
            maxWidth: '600px',
            fontWeight: 400,
            fontSize: '0.95rem'
          }}>
            Track, manage, and analyze expenses across departments and users
          </PoppinsTypography>
        </Box>
        
        
      </Box>

      {/* Enhanced Tabs with Glass Card */}
      <GlassCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Tabs
              value={tab}
              onChange={(_, val) => setTab(val)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '0.95rem',
                  minHeight: '48px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                  borderRadius: '2px 2px 0 0',
                }
              }}
            >
              <Tab label="User Expenses" />
              <Tab label="Admin Expenses" />
            </Tabs>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(isAdminTab ? "/admin/expenses/add" : "/user/expenses/add")}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 500,
                fontFamily: '"Poppins", sans-serif',
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 25px ${alpha(theme.palette.success.main, 0.4)}`,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Upload New Expense
            </Button>
          </Box>
        </CardContent>
      </GlassCard>
    </Box>
  );
};

const MonthlyExpenseTrend = ({ expenses }) => {
  const theme = useTheme();
  
  // Calculate monthly trends
  const getMonthlyTotal = (month) => {
    return expenses
      .filter(exp => new Date(exp.date).getMonth() === month)
      .reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
  };

  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentMonthTotal = getMonthlyTotal(currentMonth);
  const previousMonthTotal = getMonthlyTotal(previousMonth);
  
  const percentageChange = previousMonthTotal > 0 
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
    : 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map((month, index) => ({
    month,
    amount: getMonthlyTotal(index)
  }));

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
  
  return (
    <GlassCard sx={{ height: '100%', mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Monthly Trend
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Expense pattern over months
            </PoppinsTypography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '20px',
            background: alpha(percentageChange >= 0 ? '#ef4444' : '#10b981', 0.1),
            color: percentageChange >= 0 ? '#ef4444' : '#10b981',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}>
            {percentageChange >= 0 ? (
              <TrendingUpIcon sx={{ fontSize: 18, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 18, mr: 0.5 }} />
            )}
            {percentageChange >= 0 ? '+' : ''}{percentageChange}%
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          {monthlyData.map((monthData, index) => {
            const heightPercentage = maxAmount > 0 ? (monthData.amount / maxAmount * 100) : 0;
            const isCurrentMonth = index === currentMonth;
            
            return (
              <Box key={monthData.month} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <PoppinsTypography variant="body2" sx={{ 
                    fontWeight: isCurrentMonth ? 600 : 500,
                    color: isCurrentMonth ? theme.palette.primary.main : 'text.primary'
                  }}>
                    {monthData.month}
                  </PoppinsTypography>
                  <PoppinsTypography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: isCurrentMonth ? theme.palette.primary.main : 'text.secondary'
                  }}>
                    ₹{monthData.amount.toLocaleString()}
                  </PoppinsTypography>
                </Box>
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha(theme.palette.primary.main, 0.1),
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${heightPercentage}%`,
                      background: `linear-gradient(90deg, ${isCurrentMonth ? theme.palette.primary.main : theme.palette.secondary.main}, ${alpha(isCurrentMonth ? theme.palette.primary.main : theme.palette.secondary.main, 0.7)})`,
                      borderRadius: 4,
                      animation: `${fadeIn} 1s ease forwards`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4, 
          pt: 3, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` 
        }}>
          <Box>
            <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 400 }}>
              Current Month
            </PoppinsTypography>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              ₹{currentMonthTotal.toLocaleString()}
            </PoppinsTypography>
          </Box>
          <Box>
            <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 400 }}>
              Previous Month
            </PoppinsTypography>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              ₹{previousMonthTotal.toLocaleString()}
            </PoppinsTypography>
          </Box>
        </Box>
      </CardContent>
    </GlassCard>
  );
};

const RecentExpenses = ({ expenses, isAdminTab }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const recentExpenses = expenses.slice(0, 5);

  return (
    <GlassCard sx={{ height: '100%', mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Recent Expenses
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Latest {isAdminTab ? 'admin' : 'user'} expense entries
            </PoppinsTypography>
          </Box>
        
        </Box>

        {recentExpenses.length > 0 ? (
          <Stack spacing={2}>
            {recentExpenses.map((expense, index) => (
              <Box 
                key={expense.id || index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  animation: `${fadeIn} 0.5s ease forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    background: alpha(theme.palette.primary.main, 0.05)
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
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}>
                  <MonetizationOnIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <PoppinsTypography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {expense.description || 'Expense Entry'}
                  </PoppinsTypography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      {expense.category || 'Uncategorized'}
                    </PoppinsTypography>
                    {expense.department?.name && (
                      <PoppinsTypography variant="caption" sx={{ 
                        color: 'text.secondary',
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                        {expense.department.name}
                      </PoppinsTypography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <PoppinsTypography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                    ₹{Number(expense.amount || 0).toLocaleString()}
                  </PoppinsTypography>
                  <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </PoppinsTypography>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${floatAnimation} 3s ease-in-out infinite`
            }}>
              <ReceiptIcon sx={{ fontSize: 40, color: alpha(theme.palette.primary.main, 0.5) }} />
            </Box>
            <PoppinsTypography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 400 }}>
              No recent expenses found
            </PoppinsTypography>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
};

const Expenses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const {
    expenses,
    adminExpenses,
    loading,
    meta,
    page,
    setPage,
    search,
    setSearch,
    filterMonth,
    setFilterMonth,
    filterYear,
    setFilterYear,
    getMonthByNumber,
    setLimit,
    limit,
    handleOpen,
    setSelectedMonth,
  } = useExpenses();

  const isAdminTab = tab === 1;
  const currentExpenses = isAdminTab ? adminExpenses : expenses;
  const safeExpenses = currentExpenses || [];

  // Calculate stats
  const totalExpenses = safeExpenses.reduce(
    (acc, e) => acc + Number(e.amount || 0),
    0
  );

  const salesExpenses = safeExpenses
    .filter((e) => e?.department?.name === "Sales")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const dataExpenses = safeExpenses
    .filter((e) => e?.department?.name === "Data")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const itExpenses = safeExpenses
    .filter((e) => e?.department?.name === "IT")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const officeExpenses = safeExpenses
    .filter((e) => e?.department?.name === "Office")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const expenseStats = [
    {
      title: "Total Expenses",
      value: `₹${totalExpenses.toLocaleString()}`,
      color: "#3b82f6",
      icon: <MonetizationOnIcon />,
      subtitle: isAdminTab ? "Admin Expenses" : "User Expenses",
      trend: totalExpenses > 50000 ? "+8.5%" : "-2.1%",
      trendColor: totalExpenses > 50000 ? "#ef4444" : "#10b981"
    },
    {
      title: "Sales",
      value: `₹${salesExpenses.toLocaleString()}`,
      color: "#10b981",
      icon: <ReceiptIcon />,
      bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      trend: "+12.3%",
      trendColor: "#10b981"
    },
    {
      title: "Data",
      value: `₹${dataExpenses.toLocaleString()}`,
      color: "#8b5cf6",
      icon: <PendingActionsIcon />,
      bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      trend: "+5.7%",
      trendColor: "#8b5cf6"
    },
    {
      title: "IT",
      value: `₹${itExpenses.toLocaleString()}`,
      color: "#f59e0b",
      icon: <AttachMoneyIcon />,
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      trend: "-3.2%",
      trendColor: "#ef4444"
    },
    {
      title: "Office",
      value: `₹${officeExpenses.toLocaleString()}`,
      color: "#ef4444",
      icon: <BusinessIcon />,
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      trend: "+7.8%",
      trendColor: "#ef4444"
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
        <ExpensesHeader isAdminTab={isAdminTab} setTab={setTab} tab={tab} />
        
        {/* Stats Cards in Single Column - FIXED */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
  {expenseStats.map((stat, index) => (
    <Grid
      key={index}
      size={{ xs: 12, sm: 6, md: 2.4, 12 : 3 }}
    >
      <StatCard stat={stat} index={index} />
    </Grid>
  ))}
</Grid>



        {/* Charts and Recent Expenses */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 7, md: 6 }}>
            <MonthlyExpenseTrend expenses={safeExpenses} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>

            <RecentExpenses expenses={safeExpenses} isAdminTab={isAdminTab} />
          </Grid>
        </Grid>

        {/* Expense Table Section */}
        <Box sx={{ 
          animation: `${fadeIn} 0.6s ease forwards`,
          animationDelay: '0.4s',
          opacity: 0,
          fontFamily: '"Poppins", sans-serif',
        }}>
          <GlassCard>
            <CardContent sx={{ p: 0 }}>
              <ExpenseTable
                expenses={currentExpenses}
                loading={loading}
                meta={meta}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                search={search}
                setSearch={setSearch}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                getMonthByNumber={getMonthByNumber}
                handleOpen={handleOpen}
                setSelectedMonth={setSelectedMonth}
                disableFilters={isAdminTab}
              />
            </CardContent>
          </GlassCard>
        </Box>
      </Box>
    </>
  );
};

export default Expenses;