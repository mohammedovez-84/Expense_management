import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    alpha,
    useTheme,
    Container
} from '@mui/material';
import {
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    Refresh as RefreshIcon,
    Analytics as AnalyticsIcon,
    AccountBalance as BudgetIcon,
    Receipt as ReimbursementIcon,
    CompareArrows as CompareIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useBudgeting } from '../../hooks/useBudgeting';
import { useExpenses } from '../../hooks/useExpenses';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation } from '../../contexts/LocationContext';
import { fetchBudgets } from '../../store/budgetSlice';
import { fetchExpenses } from '../../store/expenseSlice';
import { fetchReimbursements } from '../../store/reimbursementSlice';

// Styled Components
const GlassCard = ({ children, sx = {} }) => (
    <Card sx={{
        background: `linear-gradient(135deg, ${alpha('#3b82f6', 0.1)} 0%, ${alpha('#ffffff', 0.8)} 100%)`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
        },
        ...sx
    }}>
        {children}
    </Card>
);

// Helper function to safely extract string from object/string
const safeString = (value, defaultValue = 'N/A') => {
    if (!value && value !== 0 && value !== false) return defaultValue;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        // Handle common object structures
        if (value.name) return value.name;
        if (value.username) return value.username;
        if (value.email) return value.email;
        if (value.label) return value.label;
        if (value.title) return value.title;
        // Try to convert to string
        try {
            return value.toString();
        } catch (e) {
            return defaultValue;
        }
    }
    return String(value) || defaultValue;
};

const Reports = () => {
    const { currentLoc } = useLocation();
    const theme = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBudgets({ location: currentLoc }));
        dispatch(fetchExpenses({ location: currentLoc }));
        dispatch(fetchReimbursements({ location: currentLoc }));
    }, [dispatch, currentLoc]);

    const { allBudgets } = useBudgeting();
    const { allExpenses } = useExpenses();
    const { reimbursements } = useSelector((state) => state?.reimbursement || {});
    const { departments: reduxDeps } = useSelector((state) => state.department || {});

    // Sub-departments data
    const subDepartmentsData = {
        'sales': ['G-Suite', 'Instantly', 'Domain', 'Contabo', 'Linkedin', 'Others'],
        'office': ['APNA', 'Naukri', 'Milk Bill/Tea etc.', 'Office Rent', 'Salaries', 'Others'],
        'data': ['Apollo', 'Linkedin', 'Email Verifier', 'Zoominfo', 'VPN', 'Others'],
        'it': ['Servers', 'Domain', 'Zoho', 'Instantly', 'Real Cloud', 'Others']
    };

    const getCurrentDateRange = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    };

    const [filter, setFilter] = useState({
        type: 'expenses',
        department: 'all',
        subDepartment: 'all',
        reimbursementStatus: 'all',
        dateRange: getCurrentDateRange()
    });

    const [generatedReport, setGeneratedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Get department names safely
    const departments = ['all', ...(reduxDeps?.filter(dept => dept?.name).map(dept => dept.name) || [])];
    const reimbursementStatuses = ['all', 'paid', 'unpaid'];
    
    const reportTypes = [
        { value: 'expenses', label: 'Expense Report', icon: <AnalyticsIcon />, color: "#3b82f6" },
        { value: 'budgets', label: 'Budget Report', icon: <BudgetIcon />, color: "#10b981" },
        { value: 'reimbursement', label: 'Reimbursement Summary', icon: <ReimbursementIcon />, color: "#f59e0b" },
        { value: 'comparison', label: 'Budget vs Expense', icon: <CompareIcon />, color: "#8b5cf6" }
    ];

    const getSubDepartments = () => {
        if (filter.department === 'all' || !subDepartmentsData[filter.department]) {
            return ['all'];
        }
        return ['all', ...subDepartmentsData[filter.department]];
    };

    const handleDepartmentChange = (department) => {
        setFilter({
            ...filter,
            department: department,
            subDepartment: 'all'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'N/A';
        }
    };

    const resetFilters = () => {
        setFilter({
            type: 'expenses',
            department: 'all',
            subDepartment: 'all',
            reimbursementStatus: 'all',
            dateRange: getCurrentDateRange()
        });
        setGeneratedReport(null);
    };

    const filterByDateRange = (items) => {
        if (!items || !Array.isArray(items)) return [];
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        return items.filter(item => {
            if (!item) return false;
            try {
                const itemDate = new Date(item.date || item.createdAt || item.updatedAt);
                return !isNaN(itemDate.getTime()) && itemDate >= startDate && itemDate <= endDate;
            } catch (error) {
                console.error('Date filtering error:', error);
                return false;
            }
        });
    };

    const filterByDepartment = (items) => {
        if (filter.department === 'all') return items;
        return items.filter(item => {
            try {
                // Handle different department data structures
                const deptName = item.department?.name || item.department || item.user?.department;
                // Convert to string and handle null/undefined
                const deptStr = deptName ? safeString(deptName).toLowerCase() : '';
                return deptStr === filter.department.toLowerCase();
            } catch (error) {
                console.error('Department filtering error:', error);
                return false;
            }
        });
    };

    const filterBySubDepartment = (items) => {
        if (filter.subDepartment === 'all' || filter.department === 'all') return items;
        return items.filter(item => {
            try {
                const itemSubDept = item.subDepartment || item.subdepartment || '';
                return safeString(itemSubDept) === filter.subDepartment;
            } catch (error) {
                console.error('Sub-department filtering error:', error);
                return false;
            }
        });
    };

    const getActualData = () => ({
        budgetData: Array.isArray(allBudgets) ? allBudgets : [],
        expenseData: Array.isArray(allExpenses) ? allExpenses : [],
        reimbursementData: Array.isArray(reimbursements) ? reimbursements : []
    });

    const getCurrentMonthYear = () => {
        const today = new Date();
        return {
            month: today.toLocaleString('default', { month: 'long' }),
            year: today.getFullYear()
        };
    };

    const generateExpenseReport = () => {
        try {
            const { expenseData } = getActualData();
            
            let filteredData = filterByDateRange(expenseData);
            filteredData = filterByDepartment(filteredData);
            filteredData = filterBySubDepartment(filteredData);

            const totalAmount = filteredData.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
            const { month, year } = getCurrentMonthYear();

            const items = filteredData.map((expense, index) => {
                // Extract all data safely
                const userName = safeString(expense.user, 'Unknown User');
                const department = safeString(expense.department, 'General');
                const subDepartment = safeString(expense.subDepartment || expense.subdepartment, 'General');
                const description = safeString(expense.description, 'No description');
                const paymentMode = safeString(expense.paymentMode, 'Cash');

                return {
                    id: expense._id || expense.id || `exp-${index}`,
                    description: description,
                    department: department,
                    subDepartment: subDepartment,
                    date: formatDate(expense.date || expense.createdAt),
                    amount: Number(expense.amount) || 0,
                    user: userName,
                    paymentMode: paymentMode
                };
            });

            return {
                title: `Expense Report - ${month} ${year}`,
                type: 'expenses',
                department: filter.department === 'all' ? 'All Departments' : filter.department,
                subDepartment: filter.subDepartment,
                date: new Date().toISOString(),
                totalAmount,
                items
            };
        } catch (error) {
            console.error('Error generating expense report:', error);
            throw error;
        }
    };

    const generateBudgetReport = () => {
        try {
            const { budgetData } = getActualData();
            
            const filteredData = filterByDateRange(budgetData);
            const totalAllocated = filteredData.reduce((sum, budget) => sum + (Number(budget.allocatedAmount) || 0), 0);
            const { month, year } = getCurrentMonthYear();

            const items = filteredData.map((budget, index) => {
                const userName = safeString(budget.user, 'System');
                const company = safeString(budget.company, 'DemandCurve');

                return {
                    id: budget._id || budget.id || `budget-${index}`,
                    user: userName,
                    month: budget.month || new Date().getMonth() + 1,
                    year: budget.year || new Date().getFullYear(),
                    allocatedAmount: Number(budget.allocatedAmount) || 0,
                    spentAmount: Number(budget.spentAmount) || 0,
                    remainingAmount: Number(budget.remainingAmount) || 0,
                    company: company
                };
            });

            return {
                title: `Budget Report - ${month} ${year}`,
                type: 'budgets',
                department: 'All Departments',
                date: new Date().toISOString(),
                totalAmount: totalAllocated,
                items
            };
        } catch (error) {
            console.error('Error generating budget report:', error);
            throw error;
        }
    };

    const generateReimbursementReport = () => {
        try {
            const { reimbursementData } = getActualData();
            
            let filteredData = filterByDateRange(reimbursementData);
            filteredData = filterByDepartment(filteredData);
            filteredData = filterBySubDepartment(filteredData);

            if (filter.reimbursementStatus !== 'all') {
                filteredData = filteredData.filter(reimb => {
                    if (filter.reimbursementStatus === 'paid') return reimb.isReimbursed === true;
                    if (filter.reimbursementStatus === 'unpaid') return reimb.isReimbursed === false;
                    return true;
                });
            }

            const totalAmount = filteredData.reduce((sum, reimb) => sum + (Number(reimb.amount) || 0), 0);
            const { month, year } = getCurrentMonthYear();

            const items = filteredData.map((reimb, index) => {
                // Safely get requested by name
                let requestedByName = safeString(reimb.requestedBy, 'Unknown Employee');
                if (requestedByName === 'Unknown Employee' && reimb.user) {
                    requestedByName = safeString(reimb.user, 'Unknown Employee');
                }

                return {
                    id: reimb._id || reimb.id || `reimb-${index}`,
                    requestedBy: requestedByName,
                    amount: Number(reimb.amount) || 0,
                    status: reimb.isReimbursed ? 'paid' : 'unpaid',
                    date: formatDate(reimb.createdAt || reimb.date)
                };
            });

            return {
                title: `Reimbursement Report - ${month} ${year}`,
                type: 'reimbursement',
                department: filter.department === 'all' ? 'All Departments' : filter.department,
                subDepartment: filter.subDepartment,
                date: new Date().toISOString(),
                totalAmount,
                items
            };
        } catch (error) {
            console.error('Error generating reimbursement report:', error);
            throw error;
        }
    };

    const generateComparisonReport = () => {
        try {
            const { budgetData, expenseData } = getActualData();
            
            const filteredBudgets = filterByDateRange(budgetData);
            const filteredExpenses = filterByDateRange(expenseData);

            const departmentStats = {};
            
            filteredBudgets.forEach(budget => {
                try {
                    let dept = safeString(budget.department, 'General');
                    if (!departmentStats[dept]) departmentStats[dept] = { totalBudget: 0, totalExpense: 0 };
                    departmentStats[dept].totalBudget += Number(budget.allocatedAmount) || 0;
                } catch (error) {
                    console.error('Error processing budget:', error);
                }
            });

            filteredExpenses.forEach(expense => {
                try {
                    let dept = safeString(expense.department, 'General');
                    if (!departmentStats[dept]) departmentStats[dept] = { totalBudget: 0, totalExpense: 0 };
                    departmentStats[dept].totalExpense += Number(expense.amount) || 0;
                } catch (error) {
                    console.error('Error processing expense:', error);
                }
            });

            const items = Object.entries(departmentStats).map(([department, stats]) => ({
                id: department,
                department: department,
                totalBudget: stats.totalBudget,
                totalExpense: stats.totalExpense
            }));

            const totalBudget = items.reduce((sum, item) => sum + (item.totalBudget || 0), 0);
            const totalExpense = items.reduce((sum, item) => sum + (item.totalExpense || 0), 0);
            const { month, year } = getCurrentMonthYear();

            return {
                title: `Budget vs Expense Report - ${month} ${year}`,
                type: 'comparison',
                department: filter.department === 'all' ? 'All Departments' : filter.department,
                date: new Date().toISOString(),
                totalAmount: totalExpense,
                items
            };
        } catch (error) {
            console.error('Error generating comparison report:', error);
            throw error;
        }
    };

    const generateReport = () => {
        setLoading(true);
        setGeneratedReport(null); // Clear previous report
        
        setTimeout(() => {
            try {
                console.log('Generating report with filter:', filter);
                
                let report;
                switch (filter.type) {
                    case 'expenses':
                        report = generateExpenseReport();
                        break;
                    case 'budgets':
                        report = generateBudgetReport();
                        break;
                    case 'reimbursement':
                        report = generateReimbursementReport();
                        break;
                    case 'comparison':
                        report = generateComparisonReport();
                        break;
                    default:
                        report = generateExpenseReport();
                }
                
                console.log('Generated report:', report);
                setGeneratedReport(report);
            } catch (error) {
                console.error('Error generating report:', error);
                alert(`Error generating report: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }, 100); // Small delay to ensure UI updates
    };

    const exportPDF = () => {
        if (!generatedReport) {
            alert('No report generated to export');
            return;
        }

        try {
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(16);
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'bold');
            doc.text(generatedReport.title, 105, 20, { align: 'center' });

            // Details
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const departmentInfo = generatedReport.department === 'all' ? 'All Departments' : 
                generatedReport.department + (generatedReport.subDepartment !== 'all' ? ` (${generatedReport.subDepartment})` : '');
            doc.text(`Generated on ${formatDate(generatedReport.date)} • Department: ${departmentInfo}`, 105, 30, { align: 'center' });

            // Table
            const columns = generatedReport.type === 'expenses' ? 
                ["ID", "User", "Department", "Categories", "Date", "Amount", "Description", "Payment Mode"] :
                generatedReport.type === 'budgets' ?
                ["ID", "Name", "Allocated", "Company", "Month", "Year", "Spent", "Remaining"] :
                generatedReport.type === 'reimbursement' ?
                ["ID", "Requested User", "Amount", "Status", "Date"] :
                ["Department", "Total Budget", "Total Expense"];

            const rows = generatedReport.items.map((item, index) => {
                if (generatedReport.type === 'expenses') {
                    return [
                        (index + 1).toString(),
                        item.user || "Unknown",
                        item.department || "N/A",
                        item.subDepartment || "N/A",
                        item.date || "N/A",
                        `₹${item.amount || 0}`,
                        item.description || "N/A",
                        item.paymentMode || "N/A"
                    ];
                } else if (generatedReport.type === 'budgets') {
                    return [
                        (index + 1).toString(),
                        item.user || "N/A",
                        `₹${item.allocatedAmount || 0}`,
                        item.company || "DemandCurve",
                        item.month || "N/A",
                        item.year || "N/A",
                        `₹${item.spentAmount || 0}`,
                        `₹${item.remainingAmount || 0}`
                    ];
                } else if (generatedReport.type === 'reimbursement') {
                    return [
                        (index + 1).toString(),
                        item.requestedBy || "N/A",
                        `₹${item.amount || 0}`,
                        item.status || "unpaid",
                        item.date || "N/A"
                    ];
                } else {
                    return [
                        item.department || "N/A",
                        `₹${item.totalBudget || 0}`,
                        `₹${item.totalExpense || 0}`
                    ];
                }
            });

            autoTable(doc, {
                startY: 40,
                head: [columns],
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 4 },
                margin: { left: 14, right: 14 }
            });

            doc.save(`${generatedReport.type}_report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error exporting PDF. Please try again.');
        }
    };

    const exportCSV = () => {
        if (!generatedReport) {
            alert('No report generated to export');
            return;
        }

        try {
            const headers = generatedReport.type === 'expenses' ? 
                ['ID', 'User', 'Department', 'Categories', 'Date', 'Amount', 'Description', 'Payment Mode'] :
                generatedReport.type === 'budgets' ?
                ['ID', 'Name', 'Allocated', 'Company', 'Month', 'Year', 'Spent', 'Remaining'] :
                generatedReport.type === 'reimbursement' ?
                ['ID', 'Requested User', 'Amount', 'Status', 'Date'] :
                ['Department', 'Total Budget', 'Total Expense'];

            const rows = generatedReport.items.map((item, index) => {
                if (generatedReport.type === 'expenses') {
                    return [
                        index + 1,
                        `"${item.user || 'Unknown'}"`,
                        `"${item.department || 'N/A'}"`,
                        `"${item.subDepartment || 'N/A'}"`,
                        item.date || 'N/A',
                        item.amount || 0,
                        `"${item.description || 'N/A'}"`,
                        `"${item.paymentMode || 'N/A'}"`
                    ];
                } else if (generatedReport.type === 'budgets') {
                    return [
                        index + 1,
                        `"${item.user || 'N/A'}"`,
                        item.allocatedAmount || 0,
                        `"${item.company || 'DemandCurve'}"`,
                        item.month || '',
                        item.year || '',
                        item.spentAmount || 0,
                        item.remainingAmount || 0
                    ];
                } else if (generatedReport.type === 'reimbursement') {
                    return [
                        index + 1,
                        `"${item.requestedBy || 'N/A'}"`,
                        item.amount || 0,
                        item.status || 'unpaid',
                        item.date || 'N/A'
                    ];
                } else {
                    return [
                        `"${item.department || 'N/A'}"`,
                        item.totalBudget || 0,
                        item.totalExpense || 0
                    ];
                }
            });

            let csvContent = `${generatedReport.title}\n`;
            csvContent += `Generated on: ${formatDate(generatedReport.date)}\n`;
            csvContent += `Total Records: ${generatedReport.items.length}\n\n`;
            csvContent += headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.join(',') + '\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${generatedReport.type}_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('CSV export error:', error);
            alert('Error exporting CSV. Please try again.');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Reports Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Generate comprehensive reports for expenses, budgets, reimbursements and comparisons
                </Typography>
            </Box>

            {/* Report Generator */}
            <GlassCard sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white'
                        }}>
                            <AnalyticsIcon />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Report Generator
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Configure and generate comprehensive financial reports
                            </Typography>
                        </Box>
                    </Box>

                    {/* Filter Controls */}
                    <Grid container spacing={4}>
                        {/* Report Type */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600} mb={2}>
                                📋 Report Type
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={filter.type}
                                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                                    sx={{ borderRadius: '12px' }}
                                >
                                    {reportTypes.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ color: type.color }}>
                                                    {type.icon}
                                                </Box>
                                                <Typography>{type.label}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Department */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600} mb={2}>
                                🏢 Department
                            </Typography>
                            <FormControl fullWidth disabled={filter.type === 'budgets'}>
                                <Select
                                    value={filter.type === 'budgets' ? 'all' : filter.department}
                                    onChange={(e) => handleDepartmentChange(e.target.value)}
                                    sx={{ borderRadius: '12px' }}
                                >
                                    {departments.map(dept => (
                                        <MenuItem key={dept} value={dept.toLowerCase()}>
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Sub-Department */}
                        {filter.department !== 'all' && subDepartmentsData[filter.department] && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={600} mb={2}>
                                    📊 Categories
                                </Typography>
                                <FormControl fullWidth disabled={filter.type === 'budgets'}>
                                    <Select
                                        value={filter.subDepartment}
                                        onChange={(e) => setFilter({ ...filter, subDepartment: e.target.value })}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        {getSubDepartments().map(subDept => (
                                            <MenuItem key={subDept} value={subDept}>
                                                {subDept === 'all' ? 'All Categories' : subDept}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {/* Reimbursement Status */}
                        {filter.type === 'reimbursement' && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={600} mb={2}>
                                    💳 Reimbursement Status
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={filter.reimbursementStatus}
                                        onChange={(e) => setFilter({ ...filter, reimbursementStatus: e.target.value })}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        {reimbursementStatuses.map(status => (
                                            <MenuItem key={status} value={status}>
                                                {status === 'paid' ? '✅ Paid' :
                                                 status === 'unpaid' ? '⏳ Unpaid' : '📋 All Status'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {/* Date Range */}
                        <Grid item xs={12}>
                            <Typography variant="body2" fontWeight={600} mb={3}>
                                📅 Date Range
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        type="date"
                                        value={filter.dateRange.start}
                                        onChange={(e) => setFilter({
                                            ...filter,
                                            dateRange: { ...filter.dateRange, start: e.target.value }
                                        })}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="text.secondary">to</Typography>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        type="date"
                                        value={filter.dateRange.end}
                                        onChange={(e) => setFilter({
                                            ...filter,
                                            dateRange: { ...filter.dateRange, end: e.target.value }
                                        })}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={generateReport}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                }
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={resetFilters}
                            startIcon={<RefreshIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                fontWeight: 600,
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                }
                            }}
                        >
                            Reset Filters
                        </Button>
                    </Box>
                </CardContent>
            </GlassCard>

            {/* Generated Report */}
            {generatedReport && (
                <GlassCard>
                    <CardContent>
                        {/* Report Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h5" fontWeight={700} sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {generatedReport.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Generated on {formatDate(generatedReport.date)} • 
                                    {generatedReport.department !== 'All Departments' ? ` Department: ${generatedReport.department}` : ''}
                                    {generatedReport.subDepartment !== 'all' ? ` (${generatedReport.subDepartment})` : ''} • 
                                    {generatedReport.items.length} records
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={exportCSV}
                                    startIcon={<DownloadIcon />}
                                    size="medium"
                                    sx={{
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                        }
                                    }}
                                >
                                    CSV
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={exportPDF}
                                    startIcon={<PdfIcon />}
                                    size="medium"
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #047857 0%, #0D9488 100%)'
                                        }
                                    }}
                                >
                                    PDF
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 4 }} />

                        {/* Data Table */}
                        {generatedReport.items.length > 0 ? (
                            <TableContainer sx={{ 
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                maxHeight: '500px',
                                overflow: 'auto'
                            }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
                                            {generatedReport.type === 'expenses' && (
                                                <>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>User</TableCell>
                                                    <TableCell>Department</TableCell>
                                                    <TableCell>Categories</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>Payment Mode</TableCell>
                                                </>
                                            )}
                                            {generatedReport.type === 'budgets' && (
                                                <>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Allocated</TableCell>
                                                    <TableCell>Company</TableCell>
                                                    <TableCell>Month</TableCell>
                                                    <TableCell>Year</TableCell>
                                                    <TableCell>Spent</TableCell>
                                                    <TableCell>Remaining</TableCell>
                                                </>
                                            )}
                                            {generatedReport.type === 'reimbursement' && (
                                                <>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Requested User</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Date</TableCell>
                                                </>
                                            )}
                                            {generatedReport.type === 'comparison' && (
                                                <>
                                                    <TableCell>Department</TableCell>
                                                    <TableCell>Total Budget</TableCell>
                                                    <TableCell>Total Expense</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {generatedReport.items.map((item, index) => (
                                            <TableRow key={item.id} hover>
                                                {generatedReport.type === 'expenses' && (
                                                    <>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.user}</TableCell>
                                                        <TableCell>
                                                            <Chip label={item.department} size="small" variant="outlined" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={item.subDepartment} size="small" variant="outlined" color="secondary" />
                                                        </TableCell>
                                                        <TableCell>{item.date}</TableCell>
                                                        <TableCell>
                                                            <Typography fontWeight="bold" color="#10b981">
                                                                ₹{item.amount?.toLocaleString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell>
                                                            <Chip label={item.paymentMode} size="small" />
                                                        </TableCell>
                                                    </>
                                                )}
                                                {generatedReport.type === 'budgets' && (
                                                    <>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.user}</TableCell>
                                                        <TableCell>
                                                            <Typography fontWeight="bold" color="#10b981">
                                                                ₹{item.allocatedAmount?.toLocaleString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{item.company}</TableCell>
                                                        <TableCell>{item.month}</TableCell>
                                                        <TableCell>{item.year}</TableCell>
                                                        <TableCell>₹{item.spentAmount?.toLocaleString()}</TableCell>
                                                        <TableCell>₹{item.remainingAmount?.toLocaleString()}</TableCell>
                                                    </>
                                                )}
                                                {generatedReport.type === 'reimbursement' && (
                                                    <>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.requestedBy}</TableCell>
                                                        <TableCell>
                                                            <Typography fontWeight="bold" color="#10b981">
                                                                ₹{item.amount?.toLocaleString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={item.status} 
                                                                color={item.status === 'paid' ? 'success' : 'warning'} 
                                                                size="small" 
                                                            />
                                                        </TableCell>
                                                        <TableCell>{item.date}</TableCell>
                                                    </>
                                                )}
                                                {generatedReport.type === 'comparison' && (
                                                    <>
                                                        <TableCell>
                                                            <Chip label={item.department} size="small" variant="outlined" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontWeight="bold" color="#10b981">
                                                                ₹{item.totalBudget?.toLocaleString()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>₹{item.totalExpense?.toLocaleString()}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No data found for the selected filters
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </GlassCard>
            )}
        </Container>
    );
};

export default Reports;