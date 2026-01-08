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
  Avatar,
  Stack,
  LinearProgress,
  keyframes,
  styled,
  GlobalStyles
} from "@mui/material";
import { useBudgeting } from "../../hooks/useBudgeting";
import { useExpenses } from "../../hooks/useExpenses";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import BudgetTable from "../../components/admin/budgeting/BudgetTable";
import ExpenseTable from "../../components/admin/expense/ExpenseTable";
import TabButtonsWithReport from "../../components/general/TabButtonsWithReport";
import EditBudgetModal from "../../components/admin/budgeting/BudgetEditModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgets } from "../../store/budgetSlice";
import { fetchExpenses } from "../../store/expenseSlice";
import { fetchReimbursements } from "../../store/reimbursementSlice";
import BusinessIcon from "@mui/icons-material/Business";
import { useLocation } from "../../contexts/LocationContext";

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
            background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
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

const DashboardHeader = () => {
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
            Financial Dashboard
          </PoppinsTypography>
          <PoppinsTypography variant="body1" sx={{ 
            color: 'text.secondary',
            maxWidth: '600px',
            fontWeight: 400,
            fontSize: '0.95rem'
          }}>
            Real-time insights and comprehensive analytics for efficient budget management
          </PoppinsTypography>
        </Box>
</Box>
    </Box>
  );
};

const MonthlyExpenseChart = ({ data, selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const theme = useTheme();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Monthly Expense Trends
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Daily breakdown of expenses for {months[selectedMonth]} {selectedYear}
            </PoppinsTypography>
          </Box>
          
          
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              sx={{
                borderRadius: '12px',
                background: alpha(theme.palette.primary.main, 0.05),
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                }
              }}
            >
              {months.map((month, index) => (
                <MenuItem 
                  key={month} 
                  value={index}
                  sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
                >
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              sx={{
                borderRadius: '12px',
                background: alpha(theme.palette.primary.main, 0.05),
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                }
              }}
            >
              {years.map((year) => (
                <MenuItem 
                  key={year} 
                  value={year}
                  sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}
                >
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAllocation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorReimbursement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.divider, 0.5)}
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontFamily: '"Poppins", sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontFamily: '"Poppins", sans-serif' }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  fontFamily: '"Poppins", sans-serif',
                }}
                formatter={(value, name) => {
                  const formattedValue = `₹${Number(value).toLocaleString()}`;
                  const labelMap = {
                    fromAllocation: 'From Allocation',
                    fromReimbursement: 'From Reimbursement',
                    totalAmount: 'Total Amount'
                  };
                  return [formattedValue, labelMap[name] || name];
                }}
                labelStyle={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500 }}
              />

              <Area 
                type="monotone" 
                dataKey="fromAllocation" 
                stroke="#3b82f6" 
                fill="url(#colorAllocation)" 
                strokeWidth={2.5}
                animationDuration={1500}
                animationBegin={200}
              />
              <Area 
                type="monotone" 
                dataKey="fromReimbursement" 
                stroke="#f59e0b" 
                fill="url(#colorReimbursement)" 
                strokeWidth={2.5}
                animationDuration={1500}
                animationBegin={400}
              />
              <Area 
                type="monotone" 
                dataKey="totalAmount" 
                stroke="#10b981" 
                fill="url(#colorTotal)" 
                strokeWidth={2.5}
                animationDuration={1500}
                animationBegin={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Allocation', color: '#3b82f6', value: '₹15,240' },
            { label: 'Reimbursement', color: '#f59e0b', value: '₹8,560' },
            { label: 'Total', color: '#10b981', value: '₹23,800' }
          ].map((item, index) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 14, 
                height: 14, 
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

const CategoryDistribution = ({ data }) => {
  const theme = useTheme();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Category Distribution
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Expense breakdown by categories
            </PoppinsTypography>
          </Box>
          
        </Box>

        {data.length > 0 ? (
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={85}
                  innerRadius={45}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: '"Poppins", sans-serif', fontSize: '12px', fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ 
            height: 260, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${floatAnimation} 3s ease-in-out infinite`,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <PieChartIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.5) }} />
            </Box>
            <PoppinsTypography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 400 }}>
              No category data available
            </PoppinsTypography>
          </Box>
        )}

        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 2,
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: '"Poppins", sans-serif',
            color: theme.palette.primary.main,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.04),
              transform: 'translateX(4px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          View All Categories
        </Button>
      </CardContent>
    </GlassCard>
  );
};

const RecentActivity = () => {
  const theme = useTheme();
  const activities = [
    { id: 1, user: 'John Doe', action: 'added new expense', amount: '₹2,500', time: '2 min ago', color: '#3b82f6' },
    { id: 2, user: 'Jane Smith', action: 'approved budget', amount: '₹15,000', time: '15 min ago', color: '#10b981' },
    { id: 3, user: 'Robert Brown', action: 'requested reimbursement', amount: '₹8,000', time: '1 hour ago', color: '#f59e0b' },
    { id: 4, user: 'Sarah Wilson', action: 'updated expense', amount: '₹3,200', time: '2 hours ago', color: '#8b5cf6' },
  ];

  return (
    <GlassCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Recent Activity
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Latest updates and transactions
            </PoppinsTypography>
          </Box>
          <Chip 
            label="Live" 
            size="small" 
            color="success" 
            sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500 }}
          />
        </Box>

        <Stack spacing={2}>
          {activities.map((activity, index) => (
            <Box 
              key={activity.id}
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
                  borderColor: alpha(activity.color, 0.3),
                  background: alpha(activity.color, 0.05)
                }
              }}
            >
              <Avatar sx={{ 
                width: 44, 
                height: 44, 
                bgcolor: alpha(activity.color, 0.1),
                color: activity.color,
                fontWeight: 600,
                fontFamily: '"Poppins", sans-serif',
              }}>
                {activity.user.charAt(0)}
              </Avatar>
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
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: activity.color,
                animation: `${pulseAnimation} 2s infinite`,
                animationDelay: `${index * 0.3}s`
              }} />
            </Box>
          ))}
        </Stack>

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
          Show All Activities
        </Button>
      </CardContent>
    </GlassCard>
  );
};

const BudgetProgress = () => {
  const theme = useTheme();
  const progressData = [
    { category: 'Sales', spent: 75000, total: 100000, progress: 75, color: '#3b82f6' },
    { category: 'Data', spent: 45000, total: 80000, progress: 56, color: '#10b981' },
    { category: 'Office', spent: 30000, total: 50000, progress: 60, color: '#f59e0b' },
    { category: 'HR', spent: 20000, total: 30000, progress: 67, color: '#8b5cf6' },
    { category: 'IT', spent: 90000, total: 30000, progress: 87, color: '#3a864bff' },
  ];

  return (
    <GlassCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
              Budget Utilization
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Current month budget progress
            </PoppinsTypography>
          </Box>
          <PoppinsTypography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            68% Total
          </PoppinsTypography>
        </Box>

        <Stack spacing={3}>
          {progressData.map((item, index) => (
            <Box key={item.category}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.category}
                </PoppinsTypography>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                  ₹{item.spent.toLocaleString()} / ₹{item.total.toLocaleString()}
                </PoppinsTypography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: alpha(item.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: item.color,
                    borderRadius: 5,
                    animation: `${fadeIn} 1s ease forwards`,
                    animationDelay: `${index * 0.2}s`
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                  {item.progress}% utilized
                </PoppinsTypography>
                <PoppinsTypography variant="caption" sx={{ 
                  color: item.progress > 80 ? '#ef4444' : item.progress > 60 ? '#f59e0b' : '#10b981',
                  fontWeight: 600
                }}>
                  {item.progress > 80 ? 'Over Budget' : item.progress > 60 ? 'Near Limit' : 'On Track'}
                </PoppinsTypography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </GlassCard>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("budget");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { currentLoc } = useLocation();

  const { reimbursements } = useSelector((state) => state?.reimbursement);

  const {
    allBudgets,
    budgets,
    loading: budgetLoading,
    meta: budgetMeta,
    page: budgetPage,
    setPage: setBudgetPage,
    handleOpen: handleBudgetOpen,
    search: budgetSearch,
    setSearch: setBudgetSearch,
    filterMonth: budgetFilterMonth,
    setFilterMonth: setBudgetFilterMonth,
    filterYear: budgetFilterYear,
    setFilterYear: setBudgetFilterYear,
    getMonthByNumber: getBudgetMonthByNumber,
    setLimit: setBudgetLimit,
    limit: budgetLimit,
    formData: budgetFormData,
    handleClose: budgetHandleClose,
    handleSubmit: budgetHandleSubmit,
    handleChange: budgetHandleChange,
    open: budgetOpen
  } = useBudgeting();

  const {
    allExpenses,
    adminExpenses,
    expenses,
    loading: expenseLoading,
    meta: expenseMeta,
    page: expensePage,
    setPage: setExpensePage,
    handleOpen: handleExpenseOpen,
    search: expenseSearch,
    setSearch: setExpenseSearch,
    filterMonth: expenseFilterMonth,
    setFilterMonth: setExpenseFilterMonth,
    filterYear: expenseFilterYear,
    setFilterYear: setExpenseFilterYear,
    getMonthByNumber: getExpenseMonthByNumber,
    setLimit: setExpenseLimit,
    limit: expenseLimit,
    setSelectedMonth: setExpenseSelectedMonth,
  } = useExpenses();

  useEffect(() => {
    dispatch(fetchBudgets({ location: currentLoc }));
    dispatch(fetchExpenses({ location: currentLoc }));
    dispatch(fetchReimbursements({ location: currentLoc }));
  }, [dispatch, currentLoc]);

  const totalPendingReimbursed = reimbursements
    ?.filter(item => !item?.isReimbursed)
    .reduce((acc, reimbursement) => acc + Number(reimbursement?.expense?.fromReimbursement || 0), 0) || 0;

  const totalReimbursed = reimbursements
    ?.filter(item => item?.isReimbursed)
    .reduce((acc, reimbursement) => acc + Number(reimbursement?.expense?.fromReimbursement || 0), 0) || 0;

  const totalExpenses = adminExpenses.reduce((acc, b) => acc + Number(b?.amount), 0) + allExpenses.reduce((acc, b) => acc + Number(b?.amount), 0);
  const totalAllocated = allBudgets?.reduce((acc, b) => acc + Number(b?.allocatedAmount), 0) || 0;

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    try {
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      }
      if (dateString.includes('-')) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(dateString);
    } catch (error) {
      console.warn('Invalid date:', dateString, error);
      return null;
    }
  };

  const isDateInSelectedMonth = (date, selectedMonth, selectedYear) => {
    if (!date) return false;
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    return dateMonth === selectedMonth && dateYear === selectedYear;
  };

  const getDailyAreaChartData = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const dailyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dailyData.push({
        day: day.toString(),
        date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        displayDate: `${day}/${selectedMonth + 1}/${selectedYear}`,
        fromAllocation: Math.random() * 50000,
        fromReimbursement: Math.random() * 30000,
        totalAmount: Math.random() * 80000
      });
    }

    return dailyData;
  };

  const getCategoryData = () => {
    const categories = ['Sales', 'Data', 'Office', 'HR', 'IT',];
    return categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 100000) + 20000
    }));
  };

  const dailyAreaChartData = getDailyAreaChartData();
  const categoryData = getCategoryData();

  const budgetStats = [
    {
      title: "Total Allocated",
      value: `₹${totalAllocated.toLocaleString()}`,
      icon: <AccountBalanceIcon />,
      color: "#3b82f6",
      subtitle: "Total budget allocation",
    },
    {
      title: "Total Expenses",
      value: `₹${totalExpenses.toLocaleString()}`,
      color: "#ef4444",
      icon: <MonetizationOnIcon />,
      subtitle: "Allocated expenses",
      trend: "-2.1%",
      trendColor: "#ef4444"
    },
    {
      title: "To Be Reimbursed",
      value: `₹${totalPendingReimbursed.toLocaleString()}`,
      icon: <CreditCardIcon />,
      color: "#f59e0b",
      subtitle: "Pending funds",
      trend: "+15.7%",
      trendColor: "#f59e0b"
    },
    {
      title: "Total Reimbursed",
      value: `₹${totalReimbursed.toLocaleString()}`,
      icon: <BusinessIcon />,
      color: "#10b981",
      subtitle: "Reimbursed funds",
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
        <DashboardHeader />
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {budgetStats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Charts and Progress Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <MonthlyExpenseChart
              data={dailyAreaChartData}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CategoryDistribution data={categoryData} />
          </Grid>
        </Grid>

        {/* Recent Activity and Budget Progress */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <RecentActivity />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <BudgetProgress />
          </Grid>
        </Grid>

        {/* Tables Section */}
        <Box sx={{ 
          animation: `${fadeIn} 0.6s ease forwards`,
          animationDelay: '0.4s',
          opacity: 0,
          fontFamily: '"Poppins", sans-serif',
        }}>
          <Box sx={{ mb: 2 }}>
            <TabButtonsWithReport
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              budgets={allBudgets}
              expenses={allExpenses}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            {activeTab === "budget" && (
              <>
                <BudgetTable
                  showPagination
                  limit={budgetLimit}
                  setLimit={setBudgetLimit}
                  budgets={budgets}
                  loading={budgetLoading}
                  meta={budgetMeta}
                  page={budgetPage}
                  setPage={setBudgetPage}
                  search={budgetSearch}
                  setSearch={setBudgetSearch}
                  filterMonth={budgetFilterMonth}
                  setFilterMonth={setBudgetFilterMonth}
                  filterYear={budgetFilterYear}
                  setFilterYear={setBudgetFilterYear}
                  getMonthByNumber={getBudgetMonthByNumber}
                  handleOpen={handleBudgetOpen}
                />
                <EditBudgetModal
                  open={budgetOpen}
                  handleClose={budgetHandleClose}
                  formData={budgetFormData}
                  handleChange={budgetHandleChange}
                  handleSubmit={budgetHandleSubmit}
                />
              </>
            )}
            {activeTab === "expense" && (
              <ExpenseTable
                limit={expenseLimit}
                setLimit={setExpenseLimit}
                expenses={expenses}
                loading={expenseLoading}
                meta={expenseMeta}
                page={expensePage}
                setPage={setExpensePage}
                search={expenseSearch}
                setSearch={setExpenseSearch}
                filterMonth={expenseFilterMonth}
                setFilterMonth={setExpenseFilterMonth}
                filterYear={expenseFilterYear}
                setFilterYear={setExpenseFilterYear}
                getMonthByNumber={getExpenseMonthByNumber}
                handleOpen={handleExpenseOpen}
                setSelectedMonth={setExpenseSelectedMonth}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;