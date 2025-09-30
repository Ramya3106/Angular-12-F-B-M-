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
      
      // Transform field names to match backend schema
      const userData = {
        first_name: form.firstName,
        last_name: form.lastName,
        date_of_birth: form.dob,
        email_id: form.email,
        gender: form.gender,
        country: form.country,
        state: form.state,
        city: form.city,
        address: form.address,
        pincode: form.pincode
      };
      
      if (editingId) {
        await userService.updateUser(editingId, userData);
        setEditingId(null);
      } else {
        await userService.createUser(userData);
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
    // Transform field names from backend to frontend format
    const formData = {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      dob: user.date_of_birth || '',
      email: user.email_id || '',
      gender: user.gender || 'Male',
      country: user.country || '',
      state: user.state || '',
      city: user.city || '',
      address: user.address || '',
      pincode: user.pincode || ''
    };
    setForm(formData);
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 8 }}>
            <FormLabel style={{ marginBottom: 1 }}>Gender</FormLabel>
            <RadioGroup row value={form.gender} onChange={handleChange('gender')}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" style={{ marginRight: 24 }} />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Transgender" control={<Radio />} label="Transgender" />
            </RadioGroup>
          </div>
        </Grid>
        </Grid>
        <Grid container spacing={2} mt={5}>
        <Grid item xs={12} sm={6} md={2.5}>
          <Autocomplete
            options={countryOptions}
            value={form.country}
            onChange={handleChange('country')}
            renderInput={(params) => <TextField {...params} label="Country" fullWidth size="medium" />}
            filterOptions={(options, state) =>
              options.filter(option => option.toLowerCase().startsWith(state.inputValue.toLowerCase()))
            }
            sx={{ minWidth: 200 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <Autocomplete
            options={stateOptions}
            value={form.state}
            onChange={handleChange('state')}
            renderInput={(params) => <TextField {...params} label="State" fullWidth size="medium" />}
            sx={{ minWidth: 200 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <Autocomplete
            options={cityOptions}
            value={form.city}
            onChange={handleChange('city')}
            renderInput={(params) => <TextField {...params} label="City" fullWidth size="medium" />}
            sx={{ minWidth: 200 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.25}>
          <TextField label="Address" fullWidth value={form.address} onChange={handleChange('address')} />
        </Grid>
        <Grid item xs={12} sm={6} md={2.25}>
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 1
        }}>
          <h3 style={{ margin: 0, color: '#1976d2' }}>Users List</h3>
          <Box sx={{ color: '#666', fontSize: '14px' }}>
            Total Users: {users.length}
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '15%', 
                  color: 'white',
                  fontSize: '14px'
                }}>Name</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '18%', 
                  color: 'white',
                  fontSize: '14px'
                }}>Email</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '12%', 
                  color: 'white',
                  fontSize: '14px'
                }}>DOB</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '10%', 
                  color: 'white',
                  fontSize: '14px'
                }}>Gender</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '20%', 
                  color: 'white',
                  fontSize: '14px'
                }}>Location</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '15%', 
                  color: 'white',
                  fontSize: '14px'
                }}>Address</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '10%', 
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No users found. Add some users to see them here.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow 
                    key={user._id} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#f0f7ff' },
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      fontWeight: '500',
                      verticalAlign: 'middle'
                    }}>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      verticalAlign: 'middle',
                      wordBreak: 'break-word'
                    }}>
                      {user.email_id}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      verticalAlign: 'middle'
                    }}>
                      {user.date_of_birth}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      verticalAlign: 'middle'
                    }}>
                      <Box sx={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: user.gender?.toLowerCase() === 'female' ? '#fce4ec' : '#e3f2fd',
                        color: user.gender?.toLowerCase() === 'female' ? '#c2185b' : '#1976d2',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {user.gender}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      verticalAlign: 'middle',
                      maxWidth: '200px'
                    }}>
                      {user.city && user.state && user.country 
                        ? `${user.city}, ${user.state}, ${user.country}`
                        : `${user.city || ''} ${user.state || ''} ${user.country || ''}`.trim()
                      }
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px',
                      verticalAlign: 'middle',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user.address && user.pincode 
                        ? `${user.address}, ${user.pincode}`
                        : `${user.address || ''} ${user.pincode || ''}`.trim()
                      }
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '14px 16px', 
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: 1 
                      }}>
                        <IconButton 
                          onClick={() => handleEdit(user)} 
                          color="primary"
                          size="small"
                          sx={{ 
                            padding: '8px',
                            backgroundColor: '#e3f2fd',
                            '&:hover': { 
                              backgroundColor: '#bbdefb',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                          }}
                          title="Edit user"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              handleDelete(user._id);
                            }
                          }} 
                          color="error"
                          size="small"
                          sx={{ 
                            padding: '8px',
                            backgroundColor: '#ffebee',
                            '&:hover': { 
                              backgroundColor: '#ffcdd2',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                          }}
                          title="Delete user"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}
