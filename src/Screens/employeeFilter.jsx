import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL

// eslint-disable-next-line react/prop-types
const EmployeeFilter = ({ open, onClose, filterQuery = {},setFilterQuery , fetchEmployees}) => {

  const [filterData, setFilterData] = useState({})

  // Handle dropdown changes
  const handleDesignationChange = (event) => {
    const filterQueryCopy = JSON.parse(JSON.stringify(filterQuery))
    filterQueryCopy.designation = event.target.value
    setFilterQuery(filterQueryCopy)
  };

  const handleDepartmentChange = (event) => {
    const filterQueryCopy = JSON.parse(JSON.stringify(filterQuery))
    filterQueryCopy.department = event.target.value
    setFilterQuery(filterQueryCopy)
  };

  // Reset fields
  const handleReset = () => {
    const filterQueryCopy = JSON.parse(JSON.stringify(filterQuery))
    filterQueryCopy.department = ''
    filterQueryCopy.designation = ''
    setFilterQuery(filterQueryCopy)
  };

  // Apply filters (you can customize this function as per your requirement)
  const handleApply = () => {   
    fetchEmployees();
    onClose(); // Close modal after applying filters
  };


  useEffect(() => {
    const fetchFilter = async () => {
      const response = await fetch(`${apiUrl}/employee/allfilter`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setFilterData(data);
    };

    fetchFilter();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{backgroundColor: '#9A1750', borderColor: 'white', color: 'white', fontSize: '20px', fontWeight: '600' }}>
        Filter Employees
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Designation Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Designation</InputLabel>
          <Select
            value={filterQuery.designation}
            onChange={handleDesignationChange}
            label="Designation"
          >

            {filterData?.designation?.map((el, index)=>{
              return <MenuItem  key={index } value={el}>{el}</MenuItem>

            })}
          </Select>
        </FormControl>

        {/* Department Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filterQuery.department}
            onChange={handleDepartmentChange}
            label="Department"
          >
            {filterData?.department?.map((el, index)=>{
              return <MenuItem  key={index } value={el}>{el}</MenuItem>
            })}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        {/* Reset and Apply Buttons */}
        <Button onClick={handleReset} sx={{backgroundColor: '#9A1750', borderColor: 'white', color: 'white', fontSize: '16px', fontWeight: '600' }}>
          Reset
        </Button>
        <Button onClick={handleApply} sx={{backgroundColor: '#9A1750', borderColor: 'white', color: 'white', fontSize: '16px', fontWeight: '600' }}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFilter;
