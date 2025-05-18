import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Modal, Box, MenuItem, Select, InputLabel,
  FormControl, CircularProgress, Pagination, Switch, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ deviceId: '', name: '', type: 'sensor', status: 'active' });
  const [editDevice, setEditDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const rowsPerPage = 5;

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://thingsboardserver.vercel.app/api/devices');
      setDevices(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(`Failed to fetch devices: ${err.response?.data?.details || err.message}`);
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.deviceId || !form.name) {
      toast.error('Device ID and Name are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post('https://thingsboardserver.vercel.app/api/devices', form);
      fetchDevices();
      setForm({ deviceId: '', name: '', type: 'sensor', status: 'active' });
      toast.success('Device added successfully');
    } catch (err) {
      console.error('Error adding device:', err);
      setError(`Failed to add device: ${err.response?.data?.details || err.message}`);
      toast.error('Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (device) => {
    setEditDevice(device);
    setForm({ deviceId: device.deviceId, name: device.name, type: device.type, status: device.status });
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.put(`https://thingsboardserver.vercel.app/api/devices/${editDevice.deviceId}`, form);
      fetchDevices();
      setOpenModal(false);
      setEditDevice(null);
      setForm({ deviceId: '', name: '', type: 'sensor', status: 'active' });
      toast.success('Device updated successfully');
    } catch (err) {
      console.error('Error updating device:', err);
      setError(`Failed to update device: ${err.response?.data?.details || err.message}`);
      toast.error('Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    setLoading(true);
    try {
      await axios.delete(`https://thingsboardserver.vercel.app/api/devices/${deviceId}`);
      fetchDevices();
      toast.success('Device deleted successfully');
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(`Failed to delete device: ${err.response?.data?.details || err.message}`);
      toast.error('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices
    .filter((device) =>
      device.name.toLowerCase().includes(filter.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.deviceId.localeCompare(b.deviceId);
    });

  const paginatedDevices = filteredDevices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Device Management
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>Dark Mode</Typography>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form for Adding Device */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>
            Add New Device
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Device ID"
                value={form.deviceId}
                onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
                required
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                sx={{ flex: 1, minWidth: 200 }}
              />
              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="sensor">Sensor</MenuItem>
                  <MenuItem value="actuator">Actuator</MenuItem>
                  <MenuItem value="gateway">Gateway</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
                disabled={loading}
                sx={{ height: 'fit-content' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Device'}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Filter and Sort */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Search Devices"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="deviceId">Device ID</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Device Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No devices found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDevices.map((device) => (
                  <TableRow key={device.deviceId}>
                    <TableCell>
                      <a href={`/dashboard/${device.deviceId}`}>{device.deviceId}</a>
                    </TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <Typography
                        color={device.status === 'active' ? 'success.main' : 'error.main'}
                      >
                        {device.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(device)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(device.deviceId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredDevices.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>

        {/* Edit Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Edit Device
            </Typography>
            <TextField
              label="Device ID"
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                label="Type"
              >
                <MenuItem value="sensor">Sensor</MenuItem>
                <MenuItem value="actuator">Actuator</MenuItem>
                <MenuItem value="gateway">Gateway</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}

export default DeviceList;