import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [totalData, setTotalData] = useState([]);
  const [redListedData, setRedListedData] = useState([]);
  const [yellowListedData, setYellowListedData] = useState([]);
  const [approvedCount, setApprovedCount] = useState(null); // Approved count state
  const [rejectedCount, setRejectedCount] = useState(null); // Rejected count state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all datasets concurrently
    const fetchTotalAnalytics = axios.get('https://projectsyntech-dzb2g7dbebe0amde.southindia-01.azurewebsites.net/api/Analytics/Total%20Analytics');
    const fetchRedListedAnalytics = axios.get('https://projectsyntech-dzb2g7dbebe0amde.southindia-01.azurewebsites.net/api/Analytics/RedListed%20Analytics');
    const fetchYellowListedAnalytics = axios.get('https://projectsyntech-dzb2g7dbebe0amde.southindia-01.azurewebsites.net/api/Analytics/UNListed%20Analytics');
    const fetchApprovedCount = axios.get('https://projectsyntech-dzb2g7dbebe0amde.southindia-01.azurewebsites.net/api/Analytics/approved');
    const fetchRejectedCount = axios.get('https://projectsyntech-dzb2g7dbebe0amde.southindia-01.azurewebsites.net/api/Analytics/rejected');

    Promise.all([
      fetchTotalAnalytics, 
      fetchRedListedAnalytics, 
      fetchYellowListedAnalytics, 
      fetchApprovedCount, 
      fetchRejectedCount
    ])
      .then(([totalResponse, redListedResponse, yellowListedResponse, approvedResponse, rejectedResponse]) => {
        // Transform the Total Analytics data
        const transformedTotalData = totalResponse.data.map(item => ({
          date: new Date(item.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          count: item.count
        }));

        // Transform the RedListed Analytics data
        const transformedRedListedData = redListedResponse.data.map(item => ({
          date: new Date(item.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          count: item.count
        }));

        // Transform the YellowListed Analytics data
        const transformedYellowListedData = yellowListedResponse.data.map(item => ({
          date: new Date(item.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          count: item.count
        }));

        // Set the approved and rejected counts
        setApprovedCount(approvedResponse.data.count);
        setRejectedCount(rejectedResponse.data.count);

        // Set the data for the charts
        setTotalData(transformedTotalData);
        setRedListedData(transformedRedListedData);
        setYellowListedData(transformedYellowListedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ width: '90vw', height: '90vh', padding: '20px' }}>
      {/* Display approved and rejected counts */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h6" style={{ marginLeft: '20px' }}>
          Approved Count: {approvedCount}
        </Typography>
        <Typography variant="h6" style={{ marginRight: '20px' }}>
          Rejected Count: {rejectedCount}
        </Typography>
      </Box>

      <Typography style={{marginTop:"20px",marginBottom:"20px"}} variant="h4" align="center" gutterBottom>
        Analytics Data
      </Typography>

      <Grid container spacing={4}>
        {/* Total Analytics Chart */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" align="center" gutterBottom>
            Total Analytics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* RedListed Analytics Chart */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" align="center" gutterBottom>
            RedListed Analytics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={redListedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* YellowListed Analytics Chart */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" align="center" gutterBottom>
            UnListed Analytics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yellowListedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f9c74f" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
