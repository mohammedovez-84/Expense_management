import { Box, Button, Fade, Grid } from "@mui/material";
import { useExpenses } from "../../hooks/useExpenses";
import ExpenseTable from "../../components/admin/expense/ExpenseTable";
import StatCard from "../../components/general/StatCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();

  const {
    adminExpenses,
    adminStats,
    adminMeta,
    loading,
    page,
    setPage,
    limit,
    setLimit,
  } = useExpenses({ mode: "admin" });

  const stats = [
    {
      title: "Total Expenses",
      value: `₹${adminStats?.totalSpent?.toLocaleString() || 0}`,
      icon: <MonetizationOnIcon />,
      color: "#2563eb",
    },
    {
      title: "Approved",
      value: `₹${adminStats?.approved?.toLocaleString() || 0}`,
      icon: <DoneAllIcon />,
      color: "#16a34a",
    },
    {
      title: "Pending",
      value: `₹${adminStats?.pending?.toLocaleString() || 0}`,
      icon: <ScheduleIcon />,
      color: "#f59e0b",
    },
  ];

  return (
    <Fade in>
      <Box sx={{ px: { xs: 1, md: 4 }, pt: 2 }}>

        {/* SUMMARY CARDS */}
        <Grid container spacing={2} mb={3}>
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <StatCard stat={stat} />
            </Grid>
          ))}
        </Grid>

        {/* ACTION BUTTON */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/expenses/add")}
          >
            + Upload Expense
          </Button>
        </Box>

        {/* TABLE */}
        <ExpenseTable
          expenses={adminExpenses}
          loading={loading}
          meta={adminMeta}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          disableFilters
        />
      </Box>
    </Fade>
  );
};

export default Expenses;
