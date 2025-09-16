import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Autocomplete, Box, Paper, Grid } from '@mui/material';

// List of all countries (shortened for brevity, use a full list in production)
const countries = [
  'India', 'Indonesia', 'Ireland', 'Iceland', 'Italy', 'Iran', 'Iraq', 'Israel', 'Ivory Coast',
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'South Africa', 'Russia', 'Mexico', 'Spain', 'Turkey', 'Sweden', 'Switzerland', 'Singapore', 'New Zealand', 'Norway', 'Finland', 'Denmark', 'Netherlands', 'Belgium', 'Austria', 'Poland', 'Portugal', 'Greece', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Slovakia', 'Slovenia', 'Croatia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus', 'Liechtenstein', 'Monaco', 'San Marino', 'Vatican City', 'Andorra', 'Montenegro', 'Serbia', 'Bosnia and Herzegovina', 'Albania', 'Macedonia', 'Kosovo', 'Moldova', 'Ukraine', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Nepal', 'Bhutan', 'Sri Lanka', 'Maldives', 'Myanmar', 'Thailand', 'Vietnam', 'Laos', 'Cambodia', 'Malaysia', 'Philippines', 'South Korea', 'North Korea', 'Mongolia', 'Taiwan', 'Hong Kong', 'Macau', 'Brunei', 'Timor-Leste', 'Papua New Guinea', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands', 'Micronesia', 'Palau', 'Marshall Islands', 'Nauru', 'Kiribati', 'Tuvalu', 'Cook Islands', 'Niue', 'Tokelau', 'Wallis and Futuna', 'French Polynesia', 'New Caledonia', 'Guam', 'Northern Mariana Islands', 'American Samoa', 'Puerto Rico', 'US Virgin Islands', 'British Virgin Islands', 'Anguilla', 'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Bermuda', 'Cayman Islands', 'Dominica', 'Grenada', 'Jamaica', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'Turks and Caicos Islands', 'Aruba', 'Curacao', 'Sint Maarten', 'Bonaire', 'Saba', 'Saint Eustatius', 'Saint Barthelemy', 'Saint Martin', 'Guadeloupe', 'Martinique', 'Saint Pierre and Miquelon', 'Greenland', 'Faroe Islands', 'Iceland', 'Norway', 'Sweden', 'Finland', 'Denmark', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Poland', 'Germany', 'Netherlands', 'Belgium', 'Luxembourg', 'France', 'Switzerland', 'Austria', 'Czech Republic', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herzegovina', 'Serbia', 'Montenegro', 'Albania', 'Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Turkey', 'Cyprus', 'Malta', 'Italy', 'San Marino', 'Vatican City', 'Monaco', 'Andorra', 'Spain', 'Portugal', 'Gibraltar', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Sudan', 'South Sudan', 'Eritrea', 'Djibouti', 'Somalia', 'Ethiopia', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Tanzania', 'Seychelles', 'Comoros', 'Madagascar', 'Mauritius', 'Mozambique', 'Zambia', 'Zimbabwe', 'Malawi', 'Botswana', 'Namibia', 'South Africa', 'Lesotho', 'Eswatini', 'Angola', 'Congo', 'DR Congo', 'Gabon', 'Equatorial Guinea', 'Sao Tome and Principe', 'Cameroon', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Burkina Faso', 'Ivory Coast', 'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'Gambia', 'Cape Verde', 'Mali', 'Mauritania', 'Western Sahara', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Sudan', 'South Sudan', 'Eritrea', 'Djibouti', 'Somalia', 'Ethiopia', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Tanzania', 'Seychelles', 'Comoros', 'Madagascar', 'Mauritius', 'Mozambique', 'Zambia', 'Zimbabwe', 'Malawi', 'Botswana', 'Namibia', 'South Africa', 'Lesotho', 'Eswatini', 'Angola', 'Congo', 'DR Congo', 'Gabon', 'Equatorial Guinea', 'Sao Tome and Principe', 'Cameroon', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Burkina Faso', 'Ivory Coast', 'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'Gambia', 'Cape Verde', 'Mali', 'Mauritania', 'Western Sahara', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Sudan', 'South Sudan', 'Eritrea', 'Djibouti', 'Somalia', 'Ethiopia', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Tanzania', 'Seychelles', 'Comoros', 'Madagascar', 'Mauritius', 'Mozambique', 'Zambia', 'Zimbabwe', 'Malawi', 'Botswana', 'Namibia', 'South Africa', 'Lesotho', 'Eswatini', 'Angola', 'Congo', 'DR Congo', 'Gabon', 'Equatorial Guinea', 'Sao Tome and Principe', 'Cameroon', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Burkina Faso', 'Ivory Coast', 'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'Gambia', 'Cape Verde', 'Mali', 'Mauritania', 'Western Sahara'
];

const states = ['State 1', 'State 2', 'State 3']; // Example states
const cities = ['City 1', 'City 2', 'City 3']; // Example cities

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
          <FormLabel>Gender</FormLabel>
          <RadioGroup row value={form.gender} onChange={handleChange('gender')}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={countries}
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
            options={states}
            value={form.state}
            onChange={handleChange('state')}
            renderInput={(params) => <TextField {...params} label="State" fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={cities}
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
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
        <TextField label="Filter" sx={{ mr: 2 }} />
        <Button variant="contained" color="warning" sx={{ borderRadius: '50%', minWidth: 0, width: 48, height: 48 }}>
          <span role="img" aria-label="delete">🗑️</span>
        </Button>
      </Box>
    </Paper>
  );
}
