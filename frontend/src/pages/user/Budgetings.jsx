import { Box, Grid, Fade } from "@mui/material";
import { useBudgeting } from "../../hooks/useBudgeting.js";
import BudgetTable from "../../components/admin/budgeting/BudgetTable.jsx";
import EditBudgetModal from "../../components/admin/budgeting/BudgetEditModal.jsx";
import BudgetCard from "../../components/user/BudgetCard.jsx";

const Budgetings = () => {
  const {
    budgets,
    loading,
    meta,
    page,
    setPage,
    formData,
    open,
    handleOpen,
    handleClose,
    handleChange,
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

  /* ---------------- SUMMARY DATA (FRONTEND ONLY) ---------------- */
  const summaryData = {
    monthlyBudget: budgets?.reduce(
      (sum, b) => sum + (b.allocatedAmount || 0),
      0
    ),
    totalSpent: budgets?.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0
    ),
    remainingBalance: budgets?.reduce(
      (sum, b) => sum + (b.remainingAmount || 0),
      0
    ),
    pendingReimbursements:
      budgets?.filter((b) => b.status === "pending")?.length || 0,
  };

  return (
    <Fade in timeout={400}>
      <Box sx={{ px: { xs: 1, sm: 1, md: 4 }, pt: 2 }}>

        {/* ================= SUMMARY CARDS ================= */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <BudgetCard budgetData={summaryData} />
          </Grid>
        </Grid>

        {/* ================= BUDGET TABLE ================= */}
        <BudgetTable
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

        {/* ================= EDIT MODAL ================= */}
        <EditBudgetModal
          open={open}
          handleClose={handleClose}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Fade>
  );
};

export default Budgetings;
