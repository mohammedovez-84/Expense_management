import {
  Box,
  Card,
  Typography,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TimelineIcon from "@mui/icons-material/Timeline";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  loading,
}) => {
  return (
    <Card
      sx={{
        p: 3.5,
        height: "100%",
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderTop: `4px solid ${accentColor}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        },
        animation: "fadeUp 0.6s ease forwards",
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 108,
          height: 55,
          borderRadius: 2,
          backgroundColor: `${accentColor}1A`,
          color: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        {loading ? (
          <>
            <Skeleton width={120} height={28} sx={{ mb: 0.5 }} />
            <Skeleton width={160} height={24} sx={{ mb: 0.5 }} />
            <Skeleton width={140} height={20} />
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
};

const BudgetCard = ({ budgetData }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const loading = !budgetData;

  const stats = [
    {
      title: "Total Allocated",
      value: `₹${(budgetData?.monthlyBudget || 0).toLocaleString("en-IN")}`,
      subtitle: "Total budget allocation",
      icon: <AccountBalanceIcon fontSize="large" />,
      accentColor: "#2563eb",
    },
    {
      title: "Total Expenses",
      value: `₹${(budgetData?.totalSpent || 0).toLocaleString("en-IN")}`,
      subtitle: "Total expenses amount",
      icon: <MonetizationOnIcon fontSize="large" />,
      accentColor: "#ef4444",
    },
    {
      title: "Pending Reimbursement",
      value: `₹${(budgetData?.pendingReimbursements || 0).toLocaleString("en-IN")}`,
      subtitle: "Awaiting processing",
      icon: <CreditCardIcon fontSize="large" />,
      accentColor: "#f59e0b",
    },
    {
      title: "Reimbursement Received",
      value: `₹${(budgetData?.reimbursedAmount || 0).toLocaleString("en-IN")}`,
      subtitle: "Available funds",
      icon: <TimelineIcon fontSize="large" />,
      accentColor: "#10b981",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 6,
      }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          accentColor={stat.accentColor}
          loading={loading}
        />
      ))}
    </Box>
  );
};

export default BudgetCard;