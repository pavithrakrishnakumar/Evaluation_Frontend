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
import LogoutIcon from '@mui/icons-material/Logout';
import EmployeeFilter from "./employeeFilter";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

const apiUrl = import.meta.env.VITE_API_URL
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [paginationDetails, setPaginationDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [pageQueryUpdated, setPageQueryUpdated] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    department: '',
    designation: ''
  });
  const [isLoading, setLoading] = useState(true)
  

  const nav = useNavigate();

  const fetchEmployees = async () => {
    let apiUrlQuery = `${apiUrl}/employee/all?`
    if (filterQuery.department?.length !==0) apiUrlQuery+=`department=${filterQuery.department}&`;
    if (filterQuery.designation?.length !==0) apiUrlQuery+=`designation=${filterQuery.designation}&`;
    if (search?.length !==0) apiUrlQuery+=`name=${search}&`;
    if (pageQueryUpdated===false && currentPage) apiUrlQuery+=`page=${currentPage}`;
    setPageQueryUpdated(false)
    setLoading(true)

    const response = await fetch(apiUrlQuery, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (data.error === "Unauthorized") {
      localStorage.removeItem('token');
      toast.error("Token Expired!", {
        autoClose: 800, // Duration of the toast in milliseconds
        });
            nav("/");
    }
    setLoading(false)
    setEmployees(data.employeeData);
    setPaginationDetails(data.paginationData);
    setCurrentPage(data.paginationData.currentPage)
  };


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEmployees();
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [search, currentPage]);

  useEffect(()=>{
    setPageQueryUpdated(true)
  },[search, filterQuery])

  

  // Handle search functionality (filtering by name, designation, or department)
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
  };

  // Pagination logic
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleFilter = () => {
    setOpenFilter(true);
  };

  const handleClose = () => {
    setOpenFilter(false);
  };
  const logout = () => {
    localStorage.removeItem('token')
    nav('/')
  };

  // Preparing CSV data
  const csvData = employees.map(employee => ({
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
          <Button
            variant="outlined"
            sx={{ borderColor: 'white', color: 'white', height: '45px', width: '100px' }}
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </Toolbar>

  
      <div style={{ display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress color="#9A1750" />
    </div>

      {/* Employee table */}
      <div style={{ display: !isLoading ? 'block' : 'none' ,padding: '40px', marginTop: '5px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f0f0f0' }}> {/* Light color for contrast */}
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }}>Name</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="center">Status</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="center">Designation</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="center">Department</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: '600' }} align="center">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{employee.name}</TableCell>
                  <TableCell align="center">{employee.status}</TableCell>
                  <TableCell align="center">{employee.designation}</TableCell>
                  <TableCell align="center">{employee.department}</TableCell>
                  <TableCell align="center">{employee.role}</TableCell>
                </TableRow>
              ))}
              {employees.length===0 && <TableCell colSpan={5} align="center">No Employee Found</TableCell> }
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center" style={{ display:  !isLoading ? 'flex' : 'none' , flexDirection: 'column', justifyContent: 'flex-end', marginRight: '38px' }}>
        <div style={{ marginBottom: '16px'}}>
          {Array.from(
            { length: paginationDetails.numOfPages },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded border bg-white text-blue-500 border-blue-500`}
                style={{ backgroundColor : paginationDetails.currentPage === index + 1 ? "#9A1750" : 'white',  borderColor:"#9A1750" , color:paginationDetails.currentPage === index + 1 ? "white" : "black", fontSize: '16px', fontWeight: '600' }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>
            Showing {(paginationDetails.limit * (paginationDetails.currentPage - 1)) + 1} to {paginationDetails.total < paginationDetails.limit * paginationDetails.currentPage ? paginationDetails.total : paginationDetails.limit * paginationDetails.currentPage } of {paginationDetails.total} employees
          </p>
        </div>
      </div>

      {openFilter && <EmployeeFilter open={openFilter} onClose={handleClose} filterQuery={filterQuery} setFilterQuery={setFilterQuery} fetchEmployees={fetchEmployees}/>}
    </div>
  );
};



export default EmployeeList;
