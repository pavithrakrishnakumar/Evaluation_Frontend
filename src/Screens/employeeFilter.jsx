import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const EmployeeFilter = ({ open, onClose, setFilteredEmployees }) => {

  const [filterData, setFilterData] = useState({})
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  // Handle dropdown changes
  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  // Reset fields
  const handleReset = () => {
    setDesignation('');
    setDepartment('');
  };

  // Apply filters (you can customize this function as per your requirement)
  const handleApply = async () => {   
    let url = `http://localhost:3000/employee/all?`

    if (department.length!==0) url+= `department=${department}`
    if (designation.length!==0) url+= `designation=${designation}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log(data)
    setFilteredEmployees(data);
    // Handle filter logic or callback here
    onClose(); // Close modal after applying filters
  };


  useEffect(() => {
    const fetchFilter = async () => {
      const response = await fetch("http://localhost:3000/employee/allfilter", {
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
            value={designation}
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
            value={department}
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
