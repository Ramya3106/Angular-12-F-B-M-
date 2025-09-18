import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Autocomplete, Box, Paper, Grid } from '@mui/material';
import { Country, State, City } from 'country-state-city';

// ...existing code...

export default function CrudForm() {
  // ...existing code...
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
            <FormLabel style={{ marginBottom: 8 }}>Gender</FormLabel>
            <RadioGroup row value={form.gender} onChange={handleChange('gender')}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" style={{ marginRight: 24 }} />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </div>
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
          <Button variant="contained" color="primary" disabled sx={{ mr: 2 }}>Submit</Button>
          <Button variant="contained" color="warning" onClick={handleReset}>Reset</Button>
        </Grid>
      </Grid>
      {/* Filter section removed as requested */}
    </Paper>
  );
}
