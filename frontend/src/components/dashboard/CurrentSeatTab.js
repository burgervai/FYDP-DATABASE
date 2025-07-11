import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const CurrentSeatTab = ({ currentSeat, onSeatChange, onToggleAvailability }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" /> Current Seat Information
              </Typography>
              
              <Box sx={{ '& > *': { mb: 2 }, flexGrow: 1 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Hospital</Typography>
                  <Typography>{currentSeat.hospital}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Department</Typography>
                  <Typography>{currentSeat.department}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Room</Typography>
                  <Typography>{currentSeat.room}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Floor</Typography>
                  <Typography>{currentSeat.floor}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Typography color={currentSeat.available ? 'success.main' : 'error.main'}>
                    {currentSeat.available ? 'Available' : 'Not Available'}
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                color={currentSeat.available ? 'error' : 'primary'}
                sx={{ 
                  mt: 'auto',
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none'
                }}
                onClick={onToggleAvailability}
                fullWidth
              >
                {currentSeat.available ? 'Mark as Unavailable' : 'Mark as Available'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Update Seat Information</Typography>
              <Box component="form" sx={{ '& > *': { mb: 2 } }}>
                <FormControl fullWidth>
                  <InputLabel>Hospital</InputLabel>
                  <Select
                    value={currentSeat.hospital}
                    onChange={(e) => onSeatChange('hospital', e.target.value)}
                    label="Hospital"
                  >
                    <MenuItem value="City General Hospital">City General Hospital</MenuItem>
                    <MenuItem value="Metro Medical Center">Metro Medical Center</MenuItem>
                    <MenuItem value="University Hospital">University Hospital</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={currentSeat.department}
                    onChange={(e) => onSeatChange('department', e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Room Number"
                  value={currentSeat.room}
                  onChange={(e) => onSeatChange('room', e.target.value)}
                />
                
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Information
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CurrentSeatTab;
