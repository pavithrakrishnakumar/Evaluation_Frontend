import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const EmployeeFilter = ({ open, onClose }) => {
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
  const handleApply = () => {   
    console.log('Filters Applied: ', { designation, department });
    // Handle filter logic or callback here
    onClose(); // Close modal after applying filters
  };

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
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="pm">Project Manager (PM)</MenuItem>
            <MenuItem value="ceo">CEO</MenuItem>
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
            <MenuItem value="testing">Testing</MenuItem>
            <MenuItem value="frontend">Frontend</MenuItem>
            <MenuItem value="backend">Backend</MenuItem>
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
