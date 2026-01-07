import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

/* ✅ FIX: DEFINE tableSx */
const tableSx = {
  "& thead th": {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#f9fafb",
    fontWeight: 700,
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  "& tbody tr": {
    transition: "background-color 0.2s ease",
  },
  "& tbody tr:hover": {
    backgroundColor: "#f3f4f6",
  },
  "& td": {
    py: 1.2,
    fontSize: "0.85rem",
  },
};

const BudgetTable = ({
  budgets,
  loading,
  meta,
  page,
  setPage,
  handleOpen,
}) => {
  return (
    <Box sx={{ background: "#fff", borderRadius: 2 }}>
      <Divider />

      <TableContainer>
        <Table stickyHeader sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Allocated</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : budgets?.length > 0 ? (
              budgets.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{row.allocatedAmount}
                  </TableCell>
                  <TableCell color="error">
                    ₹{row.totalSpent || 0}
                  </TableCell>
                  <TableCell color="success">
                    ₹{row.remainingBalance || 0}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View / Edit">
                      <IconButton
                        onClick={() => handleOpen(row)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No budgets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {meta?.total > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * meta.limit + 1} –{" "}
            {Math.min(page * meta.limit, meta.total)} of {meta.total}
          </Typography>

          <Pagination
            count={Math.ceil(meta.total / meta.limit)}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default BudgetTable;
