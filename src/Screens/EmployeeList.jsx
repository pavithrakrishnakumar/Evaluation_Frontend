import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Toolbar, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import EmployeeFilter from "./employeeFilter";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8; 
  const [openFilter, setOpenFilter] = useState(false);

  function createData(name, Status, Designation, Department, Role) {
    return { name, Status, Designation, Department, Role };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 1),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 1),
    createData('Eclair', 262, 16.0, 24, 6.0, 1),
    createData('Cupcake', 305, 3.7, 67, 4.3, 1),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1),
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch("http://localhost:3000/employee/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log({ data });
      setEmployees(data);
      setFilteredEmployees(data);
    };

    fetchEmployees();
  }, []);

  // Handle search functionality (filtering by name, designation, or department)
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.designation.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleFilter = () => {
    setOpenFilter(true);
  };

  const handleClose = () => {
    setOpenFilter(false);
  };

  // Preparing CSV data
  const csvData = filteredEmployees.map(employee => ({
    Name: employee.name,
    Status: employee.status,
    Designation: employee.designation,
    Department: employee.department,
    Role: employee.role
  }));

  return (
    <div className="">
      <Toolbar style={{ backgroundColor: '#9A1750', justifyContent: 'space-between', padding: '10px 20px' }}>
        <h1 className="text-2xl font-bold my-4" style={{ color: 'white' }}>Employee List</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Search Input with Icon */}
          <TextField
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            style={{ backgroundColor: 'white', borderRadius: '5px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* Filter Button with Icon */}
          <Button
            variant="outlined"
            sx={{ borderColor: 'white', color: 'white', height: '45px', width: '100px' }}
            startIcon={<FilterListIcon />}
            onClick={handleFilter}
          >
            Filter
          </Button>
          {/* Export Button with CSVLink */}
          <CSVLink data={csvData} filename="employees.csv">
            <Button
              variant="outlined"
              sx={{ borderColor: 'white', color: 'white', height: '45px', width: '100px' }}
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
          </CSVLink>
        </div>
      </Toolbar>

      {/* Employee table */}
      <div style={{ padding: '40px', marginTop: '5px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}> {/* Light color for contrast */}
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }}>Name</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="right">Status</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="right">Designation</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="right">Department</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="right">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEmployees.map((employee) => (
                <TableRow key={employee.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{employee.name}</TableCell>
                  <TableCell align="right">{employee.status}</TableCell>
                  <TableCell align="right">{employee.designation}</TableCell>
                  <TableCell align="right">{employee.department}</TableCell>
                  <TableCell align="right">{employee.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '38px' }}>
        <div>
          {Array.from(
            { length: Math.ceil(filteredEmployees.length / employeesPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"} border-blue-500`}
                style={{ backgroundColor: '#9A1750', borderColor: 'white', color: 'white', fontSize: '16px', fontWeight: '600' }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>
            Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
          </p>
        </div>
      </div>

      <EmployeeFilter open={openFilter} onClose={handleClose} />
    </div>
  );
};

export default EmployeeList;
