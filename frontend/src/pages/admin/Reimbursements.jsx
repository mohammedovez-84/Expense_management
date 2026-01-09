import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Pagination,
  Stack,
  InputLabel,
  MenuItem,
  Grid,
  FormControl,
  Select,
  Button,
  LinearProgress,
  keyframes,
  styled,
  GlobalStyles,
  Container,
  alpha
} from "@mui/material";
import { useExpenses } from '../../hooks/useExpenses';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReimbursements, markAsReimbursed } from '../../store/reimbursementSlice';
import { DoneAll, AccountBalance, MonetizationOn, CreditCard, TrendingUp, TrendingDown, FilterList, Download, CalendarToday, CheckCircle, PendingActions, ArrowForward } from '@mui/icons-material';
import { fetchBudgets } from '../../store/budgetSlice';
import { useLocation } from '../../contexts/LocationContext';
import { fetchExpenses } from '../../store/expenseSlice';
import { useBudgeting } from '../../hooks/useBudgeting';

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
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 }, 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2,
          gap: 1
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <PoppinsTypography 
              variant="subtitle2" 
              sx={{ 
                color: 'text.secondary', 
                fontWeight: 500, 
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' },
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
                mb: 1,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
                wordBreak: 'break-all'
              }}
            >
              <AnimatedNumber value={stat.value} />
            </PoppinsTypography>
            <PoppinsTypography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 400,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
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
            width: { xs: 44, sm: 48, md: 52 },
            height: { xs: 44, sm: 48, md: 52 },
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
            flexShrink: 0
          }}>
            {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 22, sm: 24, md: 26 } } })}
          </Box>
        </Box>
        
        {stat.trend && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 2, 
            pt: 2, 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            flexShrink: 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: { xs: '3px 8px', sm: '4px 10px' },
              borderRadius: '20px',
              background: alpha(stat.trendColor || (stat.trend.startsWith('+') ? '#10b981' : '#ef4444'), 0.1),
              color: stat.trendColor || (stat.trend.startsWith('+') ? '#10b981' : '#ef4444'),
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif',
              whiteSpace: 'nowrap'
            }}>
              {stat.trend.startsWith('+') ? (
                <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
              )}
              {stat.trend}
            </Box>
            <PoppinsTypography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                ml: 1, 
                fontWeight: 400,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                whiteSpace: 'nowrap'
              }}
            >
              vs last month
            </PoppinsTypography>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
});

const ReimbursementHeader = ({ currentLoc, reimbursements }) => {
  const theme = useTheme();
  
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
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PoppinsTypography variant="h4" sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            Reimbursement Management
          </PoppinsTypography>
          <PoppinsTypography variant="body1" sx={{ 
            color: 'text.secondary',
            maxWidth: '600px',
            fontWeight: 400,
            fontSize: { xs: '0.875rem', sm: '0.95rem' },
            lineHeight: 1.5
          }}>
            Track, approve, and manage reimbursement requests across departments
          </PoppinsTypography>
        </Box>
      </Box>
    </Box>
  );
};

const ReimbursementOverview = ({ totalAllocated, totalExpenses, totalPendingReimbursed, totalReimbursed }) => {
  const theme = useTheme();
  
  const reimbursementRate = totalExpenses > 0 ? (totalReimbursed / totalExpenses * 100).toFixed(1) : 0;
  const pendingRate = totalExpenses > 0 ? (totalPendingReimbursed / totalExpenses * 100).toFixed(1) : 0;

  return (
    <GlassCard sx={{ mb: 4, height: '100%' }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              Reimbursement Overview
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Current status and progress of reimbursements
            </PoppinsTypography>
          </Box>
          <Chip 
            label={`${reimbursementRate}% Completed`}
            color="success"
            size="small"
            sx={{ 
              fontFamily: '"Poppins", sans-serif', 
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          />
        </Box>

        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '1.975rem' } }}>
                  Reimbursement Progress
                </PoppinsTypography>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main, fontSize: { xs: '0.8rem', sm: '1.975rem' } }}>
                  {reimbursementRate}%
                </PoppinsTypography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(reimbursementRate)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.success.main,
                    borderRadius: 5,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  ₹{totalReimbursed.toLocaleString()} reimbursed
                </PoppinsTypography>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  ₹{(totalReimbursed + totalPendingReimbursed).toLocaleString()} total
                </PoppinsTypography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Pending Reimbursements
                </PoppinsTypography>
                <PoppinsTypography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {pendingRate}%
                </PoppinsTypography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(pendingRate)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.warning.main,
                    borderRadius: 5,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <PoppinsTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  ₹{totalPendingReimbursed.toLocaleString()} pending
                </PoppinsTypography>
                <PoppinsTypography variant="caption" sx={{ 
                  color: totalPendingReimbursed > 50000 ? theme.palette.error.main : theme.palette.warning.main,
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}>
                  {totalPendingReimbursed > 50000 ? 'Action Required' : 'Within Limits'}
                </PoppinsTypography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 4,
              background: alpha(theme.palette.primary.main, 0.05),
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 3,
                mb: 2
              }}>
                {[
                  { label: 'Total Allocated', value: totalAllocated, color: '#3b82f6' },
                  { label: 'Total Expenses', value: totalExpenses, color: '#ef4444' },
                  { label: 'Reimbursed', value: totalReimbursed, color: '#10b981' },
                  { label: 'Pending', value: totalPendingReimbursed, color: '#f59e0b' },
                ].map((item, index) => (
                  <Box key={item.label} sx={{ textAlign: 'center' }}>
                    <PoppinsTypography variant="caption" sx={{ 
                      color: 'text.secondary', 
                      display: 'block', 
                      fontWeight: 400, 
                      mb: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      whiteSpace: 'nowrap'
                    }}>
                      {item.label}
                    </PoppinsTypography>
                    <Box sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      background: item.color,
                      margin: '0 auto 8px',
                      animation: `${pulseAnimation} 2s infinite`,
                      animationDelay: `${index * 0.3}s`
                    }} />
                    <PoppinsTypography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: item.color,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      wordBreak: 'break-all'
                    }}>
                      ₹{item.value.toLocaleString()}
                    </PoppinsTypography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <PoppinsTypography variant="caption" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 400,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}>
                  Total reimbursement liability: 
                </PoppinsTypography>
                <PoppinsTypography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: (totalReimbursed + totalPendingReimbursed) > totalAllocated * 0.8 ? '#ef4444' : '#10b981',
                  mt: 0.5,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  ₹{(totalReimbursed + totalPendingReimbursed).toLocaleString()}
                </PoppinsTypography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </GlassCard>
  );
};

const RecentReimbursements = ({ reimbursements, currentLoc }) => {
  const theme = useTheme();
  const recentReimbursements = reimbursements.slice(0, 5);

  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <PoppinsTypography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              Recent Reimbursements
            </PoppinsTypography>
            <PoppinsTypography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Latest reimbursement requests
            </PoppinsTypography>
          </Box>
         
        </Box>

        {recentReimbursements.length > 0 ? (
          <Stack spacing={1.5}>
            {recentReimbursements.map((reimbursement, index) => (
              <Box 
                key={reimbursement._id || index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
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
                  width: 36, 
                  height: 36, 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: reimbursement?.isReimbursed 
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.warning.main, 0.1),
                  color: reimbursement?.isReimbursed 
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {reimbursement?.isReimbursed ? (
                    <CheckCircle sx={{ fontSize: 18 }} />
                  ) : (
                    <PendingActions sx={{ fontSize: 18 }} />
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <PoppinsTypography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      mb: 0.5,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {reimbursement?.requestedBy?.name || 'Unknown User'}
                  </PoppinsTypography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <PoppinsTypography variant="caption" sx={{ 
                      color: 'text.secondary', 
                      fontWeight: 400,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}>
                      {reimbursement?.requestedBy?.userLoc || currentLoc}
                    </PoppinsTypography>
                    <PoppinsTypography variant="caption" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}>
                      <Box sx={{ 
                        width: 4, 
                        height: 4, 
                        borderRadius: '50%', 
                        background: 'currentColor',
                        flexShrink: 0
                      }} />
                      ₹{Number(reimbursement?.expense?.fromReimbursement || 0).toLocaleString()}
                    </PoppinsTypography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <PoppinsTypography variant="body2" sx={{ 
                    fontWeight: 600, 
                    color: reimbursement?.isReimbursed ? theme.palette.success.main : '#ef4444',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}>
                    ₹{Number(reimbursement?.expense?.fromReimbursement || 0).toLocaleString()}
                  </PoppinsTypography>
                  <PoppinsTypography variant="caption" sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 400,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}>
                    {reimbursement?.createdAt
                      ? new Date(reimbursement.createdAt).toLocaleDateString()
                      : '-'}
                  </PoppinsTypography>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            height: 160, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              width: 70, 
              height: 70, 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${floatAnimation} 3s ease-in-out infinite`
            }}>
              <CreditCard sx={{ fontSize: 32, color: alpha(theme.palette.primary.main, 0.5) }} />
            </Box>
            <PoppinsTypography variant="body2" color="text.secondary" align="center" sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}>
              No recent reimbursements found
            </PoppinsTypography>
          </Box>
        )}
      </CardContent>
    </GlassCard>
  );
};

const ReimbursementManagement = () => {
  const theme = useTheme();
  const { currentLoc } = useLocation();
  const dispatch = useDispatch();
  
  const {
    reimbursements,
    loading,
    pagination = {},
  } = useSelector((state) => state.reimbursement);

  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { allExpenses } = useExpenses();
  const { allBudgets } = useBudgeting();

  const totalAllocated = allBudgets?.reduce((acc, b) => acc + Number(b?.allocatedAmount || 0), 0) || 0;
  const totalExpenses = allExpenses?.reduce((acc, b) => acc + Number(b?.amount || 0), 0) || 0;
  
  const totalPendingReimbursed = reimbursements
    ?.filter(item => !item?.isReimbursed)
    .reduce((acc, reimbursement) => acc + Number(reimbursement?.expense?.fromReimbursement || 0), 0) || 0;
    
  const totalReimbursed = reimbursements
    ?.filter(item => item?.isReimbursed)
    .reduce((acc, reimbursement) => acc + Number(reimbursement?.expense?.fromReimbursement || 0), 0) || 0;

  useEffect(() => {
    dispatch(fetchReimbursements({ location: currentLoc, limit: itemsPerPage, page: currentPage }));
  }, [dispatch, currentLoc, currentPage, itemsPerPage]);

  const handleMarkReimbursed = async (id) => {
    const res = await dispatch(markAsReimbursed({ id, isReimbursed: true }));

    if (markAsReimbursed.fulfilled.match(res)) {
      dispatch(fetchReimbursements({
        location: currentLoc,
        page: currentPage,
        limit: itemsPerPage
      }));
      await Promise.all([
        dispatch(fetchBudgets({ page: 1, limit: 10, month: "", year: "", all: false, location: currentLoc })),
        dispatch(fetchExpenses({ page: 1, limit: 20, location: currentLoc })),
      ]);
      setSuccess('Reimbursement marked as paid successfully!');
    } else {
      setErrorMessage('Failed to mark reimbursement as paid');
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const reimbursementStats = [
    {
      title: "Total Allocated",
      value: `₹${totalAllocated?.toLocaleString()}`,
      color: "#3b82f6",
      icon: <AccountBalance />,
      subtitle: "Total budget allocation",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      trend: totalAllocated > 500000 ? "+12.5%" : "+5.2%",
      trendColor: totalAllocated > 500000 ? "#10b981" : "#f59e0b"
    },
    {
      title: "Total Expenses",
      value: `₹${totalExpenses?.toLocaleString()}`,
      color: "#ef4444",
      icon: <MonetizationOn />,
      subtitle: "Total expenses incurred",
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      trend: totalExpenses > 400000 ? "+8.7%" : "-2.1%",
      trendColor: totalExpenses > 400000 ? "#ef4444" : "#10b981"
    },
    {
      title: "Total Reimbursed",
      value: `₹${totalReimbursed?.toLocaleString()}`,
      color: "#10b981",
      icon: <CheckCircle />,
      subtitle: "Paid reimbursement amount",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      trend: "+15.3%",
      trendColor: "#10b981"
    },
    {
      title: "To Be Reimbursed",
      value: `₹${totalPendingReimbursed?.toLocaleString()}`,
      color: "#f59e0b",
      icon: <CreditCard />,
      subtitle: "Pending reimbursement amount",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      trend: totalPendingReimbursed > 100000 ? "+18.5%" : "+7.2%",
      trendColor: totalPendingReimbursed > 100000 ? "#ef4444" : "#f59e0b"
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
      
<Container
  maxWidth="xl"
  disableGutters
  sx={{
    background: "transparent !important",
    boxShadow: "none",
    p: { xs: 1.5, sm: 2, md: 3 },
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  }}
>

        {/* Notifications */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setErrorMessage('')} 
            severity="error" 
            sx={{ 
              width: '100%',
              fontFamily: '"Poppins", sans-serif',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              background: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSuccess('')} 
            severity="success" 
            sx={{ 
              width: '100%',
              fontFamily: '"Poppins", sans-serif',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              background: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            {success}
          </Alert>
        </Snackbar>

        <ReimbursementHeader 
          currentLoc={currentLoc}
          reimbursements={reimbursements}
        />
        
        {/* Stats Cards - Fixed width layout */}
        <Box sx={{ 
          mb: 4,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {reimbursementStats.map((stat, index) => (
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

        {/* Overview and Recent Reimbursements */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3,
          mb: 4
        }}>
          <Box>
            <ReimbursementOverview 
              totalAllocated={totalAllocated}
              totalExpenses={totalExpenses}
              totalPendingReimbursed={totalPendingReimbursed}
              totalReimbursed={totalReimbursed}
            />
          </Box>
          <Box>
            <RecentReimbursements reimbursements={reimbursements} currentLoc={currentLoc} />
          </Box>
        </Box>

        {/* Reimbursements Table Section */}
        <Box sx={{ 
          animation: `${fadeIn} 0.6s ease forwards`,
          animationDelay: '0.4s',
          opacity: 0,
          fontFamily: '"Poppins", sans-serif',
        }}>
          <GlassCard>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3, 
                flexWrap: 'wrap', 
                gap: 2 
              }}>
                <Box sx={{ minWidth: 0 }}>
                  <PoppinsTypography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 0.5, 
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}>
                    Reimbursement Requests
                  </PoppinsTypography>
                  <PoppinsTypography variant="body2" sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 400,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}>
                    Review and manage reimbursement requests
                  </PoppinsTypography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  flexShrink: 0
                }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      sx={{
                        borderRadius: '12px',
                        background: alpha(theme.palette.primary.main, 0.05),
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      {[5, 10, 20, 50, 100].map((num) => (
                        <MenuItem 
                          key={num} 
                          value={num}
                          sx={{ 
                            fontFamily: '"Poppins", sans-serif', 
                            fontWeight: 400,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {num} per page
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                maxWidth: '100%',
                overflowX: 'auto'
              }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ background: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        User
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        Amount Allocated
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        Total Expenses
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        To Be Reimbursed
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        py: 2, 
                        fontFamily: '"Poppins", sans-serif', 
                        textAlign: "center",
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <PoppinsTypography variant="h6" color="text.secondary">
                            Loading...
                          </PoppinsTypography>
                        </TableCell>
                      </TableRow>
                    ) : reimbursements?.length > 0 ? (
                      reimbursements.map((item) => (
                        <TableRow
                          key={item?._id}
                          sx={{
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.03),
                            }
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  width: { xs: 36, sm: 40 },
                                  height: { xs: 36, sm: 40 },
                                  fontWeight: 600,
                                  fontFamily: '"Poppins", sans-serif',
                                  fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                              >
                                {item?.requestedBy?.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <PoppinsTypography fontWeight={500} sx={{ 
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {item?.requestedBy?.name}
                                </PoppinsTypography>
                                <PoppinsTypography variant="caption" color="text.secondary" sx={{ 
                                  fontWeight: 400,
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}>
                                  {item?.requestedBy?.userLoc}
                                </PoppinsTypography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <PoppinsTypography fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              ₹{Number(item?.expense?.fromAllocation || 0)?.toLocaleString()}
                            </PoppinsTypography>
                          </TableCell>
                          <TableCell>
                            <PoppinsTypography fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              ₹{Number(item?.expense?.amount || 0)?.toLocaleString()}
                            </PoppinsTypography>
                          </TableCell>
                          <TableCell>
                            <PoppinsTypography
                              fontWeight={600}
                              sx={{
                                color: item?.isReimbursed ? 'text.secondary' : '#ef4444',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}
                            >
                              ₹{item?.isReimbursed ? 0 : Number(item?.expense?.fromReimbursement || 0)?.toLocaleString()}
                            </PoppinsTypography>
                          </TableCell>
                          <TableCell>
                            <PoppinsTypography variant="body2" sx={{ 
                              fontWeight: 400,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}>
                              {item?.createdAt
                                ? new Date(item.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "Asia/Kolkata",
                                  })
                                : "-"}
                            </PoppinsTypography>
                          </TableCell>
                          <TableCell>
                            <PoppinsTypography
                              variant="body2"
                              sx={{
                                maxWidth: { xs: '100px', sm: '150px', md: '200px' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 400,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              {item?.expense?.description || "-"}
                            </PoppinsTypography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title={item?.isReimbursed ? "Reimbursed" : "Mark as reimbursed"}>
                              <IconButton
                                color={item?.isReimbursed ? "success" : "default"}
                                onClick={() => !item?.isReimbursed && handleMarkReimbursed(item._id)}
                                sx={{
                                  backgroundColor: item?.isReimbursed 
                                    ? alpha(theme.palette.success.main, 0.1) 
                                    : alpha(theme.palette.primary.main, 0.1),
                                  color: item?.isReimbursed 
                                    ? theme.palette.success.main 
                                    : theme.palette.primary.main,
                                  border: item?.isReimbursed ? 'none' : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                  borderRadius: 2,
                                  width: { xs: 36, sm: 40 },
                                  height: { xs: 36, sm: 40 },
                                  '&:hover': {
                                    backgroundColor: item?.isReimbursed 
                                      ? theme.palette.success.main 
                                      : theme.palette.primary.main,
                                    color: 'white',
                                    transform: 'scale(1.05)',
                                  },
                                  transition: 'all 0.2s ease-in-out',
                                  animation: !item?.isReimbursed ? `${pulseAnimation} 2s infinite` : 'none'
                                }}
                              >
                                <DoneAll sx={{ fontSize: { xs: 18, sm: 20 } }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <PoppinsTypography variant="h6" color="text.secondary">
                            No reimbursement requests found
                          </PoppinsTypography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination?.totalPages > 1 && (
                <Box
                  sx={{
                    mt: 3,
                    pt: 3,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    width: '100%',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <PoppinsTypography variant="body2" color="text.secondary" sx={{ 
                      fontWeight: 400,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}–
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{' '}
                      of {pagination.totalItems} reimbursements
                      {currentLoc !== 'OVERALL' && ` in ${currentLoc}`}
                    </PoppinsTypography>

                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      siblingCount={1}
                      boundaryCount={1}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          minWidth: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        },
                      }}
                    />
                  </Stack>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        </Box>
      </Container>
    </>
  );
};

export default ReimbursementManagement;