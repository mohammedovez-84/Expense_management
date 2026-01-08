import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, fetchUser } from "../../store/authSlice";
import { useToastMessage } from '../../hooks/useToast';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Stack,
  keyframes,
  styled,
  GlobalStyles,
  alpha,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Save,
  Close
} from '@mui/icons-material';

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

const GlassTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: alpha(theme.palette.background.paper, 0.7),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.3s ease',
    fontFamily: '"Poppins", sans-serif',
    '&:hover': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      background: alpha(theme.palette.background.paper, 0.9),
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      background: alpha(theme.palette.background.paper, 0.95),
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 500,
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Poppins", sans-serif',
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  borderRadius: '12px',
  padding: '10px 24px',
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  '&:disabled': {
    background: alpha(theme.palette.primary.main, 0.5),
  }
}));

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, updateProfileLoading } = useSelector((state) => state.auth);
  const { success, error: catchError } = useToastMessage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Initialize user profile from Redux state
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Event Handlers
  const handleProfileChange = (key, value) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Action Functions
  const saveProfile = async () => {
    if (!user?._id) {
      catchError("User ID is missing. Please log in again.");
      return;
    }

    try {
      const result = await dispatch(updateUserProfile({
        ...userProfile,
        userId: user._id
      })).unwrap();

      setIsEditingProfile(false);

      if (updateUserProfile.fulfilled.matches(result)) {
        success("Updated profile successfully");
        setTimeout(() => { dispatch(fetchUser()) }, 5000);
      }
    } catch (error) {
      catchError("Error in updating the profile: " + error?.message);
      console.log(error);
    }
  };

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

      <Container maxWidth="xl" sx={{
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
        {/* Header Section */}
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
                Account Settings
              </PoppinsTypography>
              <PoppinsTypography variant="body1" sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                fontWeight: 400,
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                lineHeight: 1.5
              }}>
                Manage your profile information and preferences
              </PoppinsTypography>
            </Box>

            <Chip
              icon={user?.role === 'superadmin' ? <AdminIcon /> : <PersonIcon />}
              label={user?.role === 'superadmin' ? 'Super Admin' : 'Standard User'}
              color={user?.role === 'superadmin' ? 'warning' : 'primary'}
              sx={{
                borderRadius: '12px',
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.875rem' }
              }}
            />
          </Box>

          {/* User Info Bar */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            mt: 3,
            flexWrap: 'wrap',
            animation: `${fadeIn} 0.6s ease forwards`,
            animationDelay: '0.2s',
            opacity: 0
          }}>
            <Chip
              icon={<PersonIcon />}
              label={user?.name || 'Loading...'}
              sx={{
                borderRadius: '12px',
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: '0.7rem', sm: '0.875rem' }
              }}
            />
            <Chip
              icon={<EmailIcon />}
              label={user?.email || 'No email'}
              sx={{
                borderRadius: '12px',
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 500,
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: '0.7rem', sm: '0.875rem' }
              }}
            />
          </Box>
        </Box>

        {/* Profile Card */}
        <GlassCard
          cardcolor="#3b82f6"
          sx={{
            animation: `${slideInFromLeft} 0.5s ease forwards`,
            opacity: 0,
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              flexWrap: 'wrap'
            }}>
              <Box sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, #3b82f6 0%, ${alpha('#3b82f6', 0.7)} 100%)`,
                color: 'white',
                animation: `${floatAnimation} 2s ease-in-out infinite`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 4px 20px ${alpha('#3b82f6', 0.3)}`,
                flexShrink: 0
              }}>
                <PersonIcon sx={{ fontSize: 26 }} />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <PoppinsTypography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color: '#3b82f6'
                }}>
                  Profile Information
                </PoppinsTypography>
                <PoppinsTypography variant="body2" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 400,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  Manage your personal information and contact details
                </PoppinsTypography>
              </Box>
            </Box>

            {!isEditingProfile ? (
              // View Mode
              <Box sx={{ animation: `${fadeIn} 0.5s ease forwards` }}>
                <Stack spacing={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: 3
                  }}>
                    <Avatar
                      sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        bgcolor: theme.palette.primary.main,
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        fontWeight: 600,
                        animation: `${pulseAnimation} 3s ease-in-out infinite`,
                        border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <PoppinsTypography variant="h5" sx={{ 
                        fontWeight: 700, 
                        mb: 2,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                      }}>
                        {user?.name || 'Loading...'}
                      </PoppinsTypography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                          <EmailIcon sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                          <Box sx={{ minWidth: 0 }}>
                            <PoppinsTypography variant="subtitle2" sx={{ 
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              Email Address
                            </PoppinsTypography>
                            <PoppinsTypography variant="body1" sx={{ 
                              color: 'text.primary',
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                              {user?.email}
                            </PoppinsTypography>
                          </Box>
                        </Box>

                        {user?.phone && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            justifyContent: { xs: 'center', sm: 'flex-start' }
                          }}>
                            <PhoneIcon sx={{ color: alpha(theme.palette.success.main, 0.8) }} />
                            <Box sx={{ minWidth: 0 }}>
                              <PoppinsTypography variant="subtitle2" sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}>
                                Phone Number
                              </PoppinsTypography>
                              <PoppinsTypography variant="body1" sx={{ 
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}>
                                {user?.phone}
                              </PoppinsTypography>
                            </Box>
                          </Box>
                        )}

                        {user?.userLoc && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            justifyContent: { xs: 'center', sm: 'flex-start' }
                          }}>
                            <LocationIcon sx={{ color: alpha(theme.palette.info.main, 0.8) }} />
                            <Box sx={{ minWidth: 0 }}>
                              <PoppinsTypography variant="subtitle2" sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}>
                                Location
                              </PoppinsTypography>
                              <PoppinsTypography variant="body1" sx={{ 
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}>
                                {user?.userLoc}
                              </PoppinsTypography>
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                          <AdminIcon sx={{ color: alpha(theme.palette.warning.main, 0.8) }} />
                          <Box sx={{ minWidth: 0 }}>
                            <PoppinsTypography variant="subtitle2" sx={{ 
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              Role
                            </PoppinsTypography>
                            <PoppinsTypography variant="body1" sx={{ 
                              color: 'text.primary',
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                              {user?.role === 'superadmin' ? 'Super Admin' : 'Standard User'}
                            </PoppinsTypography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <PrimaryButton
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditingProfile(true)}
                      sx={{
                        animation: `${pulseAnimation} 2s infinite`,
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      Edit Profile
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Box>
            ) : (
              // Edit Mode
              <Box sx={{ animation: `${fadeIn} 0.5s ease forwards` }}>
                <Stack spacing={4}>
                  <Box>
                    <PoppinsTypography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      mb: 3,
                      color: 'text.primary',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      textAlign: 'center'
                    }}>
                      Update your personal information
                    </PoppinsTypography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <GlassTextField
                          fullWidth
                          label="Full Name"
                          value={userProfile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <PersonIcon sx={{ mr: 1, color: alpha(theme.palette.primary.main, 0.6) }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <GlassTextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <EmailIcon sx={{ mr: 1, color: alpha(theme.palette.primary.main, 0.6) }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <GlassTextField
                          fullWidth
                          label="Phone Number"
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <PhoneIcon sx={{ mr: 1, color: alpha(theme.palette.primary.main, 0.6) }} />
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    pt: 3,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <PrimaryButton
                      variant="contained"
                      startIcon={updateProfileLoading ? <CircularProgress size={20} /> : <Save />}
                      onClick={saveProfile}
                      disabled={updateProfileLoading}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                      {updateProfileLoading ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>
                    <Button
                      variant="outlined"
                      startIcon={<Close />}
                      onClick={() => setIsEditingProfile(false)}
                      disabled={updateProfileLoading}
                      sx={{ 
                        width: { xs: '100%', sm: 'auto' },
                        borderRadius: '12px',
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.04)
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </CardContent>
        </GlassCard>
      </Container>
    </>
  );
};

export default SettingsPage;