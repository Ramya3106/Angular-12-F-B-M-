import React, { useState, useEffect } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Autocomplete, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Country, State, City } from 'country-state-city';
import { userService } from './services/userService';

// ...existing code...

export default function CrudForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    gender: 'Male',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
  });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // Get all countries
  const countryOptions = Country.getAllCountries().map(c => c.name);
  // Get states for selected country
  const stateOptions = form.country ? State.getStatesOfCountry(Country.getAllCountries().find(c => c.name === form.country)?.isoCode).map(s => s.name) : [];
  // Get cities for selected state
  const cityOptions = (form.country && form.state)
    ? City.getCitiesOfState(
        Country.getAllCountries().find(c => c.name === form.country)?.isoCode,
        State.getStatesOfCountry(Country.getAllCountries().find(c => c.name === form.country)?.isoCode).find(s => s.name === form.state)?.isoCode
      ).map(city => city.name)
    : [];

  const handleChange = (field) => (event, value) => {
    if (value !== undefined) {
      setForm({ ...form, [field]: value });
    } else {
      setForm({ ...form, [field]: event.target.value });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await userService.updateUser(editingId, form);
        setEditingId(null);
      } else {
        await userService.createUser(form);
      }
      handleReset();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please check if all fields are filled.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleReset = () => {
    setForm({
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      gender: 'Male',
      country: '',
      state: '',
      city: '',
      address: '',
      pincode: '',
    });
    setEditingId(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Box sx={{ mb: 2, bgcolor: '#FFD600', p: 2, borderRadius: 1 }}>
        <h2>Angular 12 CRUD Example with Web API</h2>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="FirstName" fullWidth value={form.firstName} onChange={handleChange('firstName')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="LastName" fullWidth value={form.lastName} onChange={handleChange('lastName')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Date Of Birth" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.dob} onChange={handleChange('dob')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Email ID" fullWidth value={form.email} onChange={handleChange('email')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={countryOptions}
            value={form.country}
            onChange={handleChange('country')}
            renderInput={(params) => <TextField {...params} label="Country" fullWidth />}
            filterOptions={(options, state) =>
              options.filter(option => option.toLowerCase().startsWith(state.inputValue.toLowerCase()))
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 8 }}>
            <FormLabel style={{ marginBottom: 8 }}>Gender</FormLabel>
            <RadioGroup row value={form.gender} onChange={handleChange('gender')}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" style={{ marginRight: 24 }} />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={stateOptions}
            value={form.state}
            onChange={handleChange('state')}
            renderInput={(params) => <TextField {...params} label="State" fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={cityOptions}
            value={form.city}
            onChange={handleChange('city')}
            renderInput={(params) => <TextField {...params} label="City" fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Address" fullWidth value={form.address} onChange={handleChange('address')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Pincode" fullWidth value={form.pincode} onChange={handleChange('pincode')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} sx={{ mr: 2 }}>
            {loading ? 'Processing...' : (editingId ? 'Update' : 'Submit')}
          </Button>
          <Button variant="contained" color="warning" onClick={handleReset}>Reset</Button>
        </Grid>
      </Grid>
      
      {/* Users Table */}
      <Box sx={{ mt: 4 }}>
        <h3>Users List</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.city}, {user.state}, {user.country}</TableCell>
                  <TableCell>{user.address}, {user.pincode}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}
