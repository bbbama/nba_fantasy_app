import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { createLeague, getLeagues, joinLeague, deleteLeague } from "../services/api"; // Import deleteLeague
import { League } from "../types";
import { Box, Typography, Button, TextField, CircularProgress, Paper, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSnackbar } from '../SnackbarContext';
import AddIcon from '@mui/icons-material/Add';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate

export const LeaguesPage = () => {
  const { token, user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Create League dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [creatingLeague, setCreatingLeague] = useState(false);

  // State for Join League dialog
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [joinInviteCode, setJoinInviteCode] = useState('');
  const [joiningLeague, setJoiningLeague] = useState(false);
  
  const handleDeleteLeague = async (leagueId: number, leagueName: string) => {
    if (!token) return;
    if (window.confirm(`Are you sure you want to delete the league "${leagueName}"? This action cannot be undone.`)) {
      try {
        await deleteLeague(token, leagueId);
        showSnackbar(`League "${leagueName}" deleted successfully!`, 'success');
        fetchLeagues(); // Refresh list
      } catch (err: any) {
        showSnackbar(err.response?.data?.detail || "Failed to delete league.", 'error');
      }
    }
  };


  const fetchLeagues = async () => {
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data: League[] = await getLeagues(token);
      setLeagues(data);
    } catch (err: any) {
      setError("Failed to fetch leagues.");
      showSnackbar(err.response?.data?.detail || "Failed to fetch leagues.", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, [token]);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) {
      showSnackbar("League name cannot be empty.", 'warning');
      return;
    }
    setCreatingLeague(true);
    try {
      await createLeague(token!, newLeagueName);
      showSnackbar(`League "${newLeagueName}" created successfully!`, 'success');
      setOpenCreateDialog(false);
      setNewLeagueName('');
      fetchLeagues(); // Refresh list
    } catch (err: any) {
      showSnackbar(err.response?.data?.detail || "Failed to create league.", 'error');
    } finally {
      setCreatingLeague(false);
    }
  };

  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinInviteCode.trim()) {
      showSnackbar("Invite code cannot be empty.", 'warning');
      return;
    }
    setJoiningLeague(true);
    try {
      await joinLeague(token!, joinInviteCode);
      showSnackbar(`Successfully joined league!`, 'success');
      setOpenJoinDialog(false);
      setJoinInviteCode('');
      fetchLeagues(); // Refresh list
    } catch (err: any) {
      showSnackbar(err.response?.data?.detail || "Failed to join league.", 'error');
    } finally {
      setJoiningLeague(false);
    }
  };


  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">Loading leagues...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white">
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          Your Leagues
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
            Create New League
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<VpnKeyIcon />} onClick={() => setOpenJoinDialog(true)}>
            Join League
          </Button>
        </Box>
      </Box>

      {leagues.length === 0 ? (
        <Typography variant="body1" className="text-center mt-8">
          You are not a member of any leagues yet. Create one or join using an invite code!
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3, mt: 3 }}>
          <List>
            {leagues.map((league) => (
              <ListItem
                key={league.id}
                divider
                component={Link} // Use Link component
                to={`/leagues/${league.id}`} // Pass navigation target
                sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center' } }}
                // Remove onClick since Link handles navigation
              >
                <ListItemText
                  primary={<Typography variant="h6">{league.name}</Typography>}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Invite Code: {league.invite_code} | Members: {league.users ? league.users.length : 0}
                      {league.owner_id === user?.id && <span style={{ marginLeft: '8px', color: '#002D62', fontWeight: 'bold' }}> (Owner)</span>}
                    </Typography>
                  }
                />
                {(league.owner_id === user?.id || user?.role === 'admin') && (
                  <IconButton edge="end" aria-label="delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteLeague(league.id, league.name); }}>
                    <DeleteIcon sx={{ color: 'error.main' }} />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Create League Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New League</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="leagueName"
            label="League Name"
            type="text"
            fullWidth
            variant="standard"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateLeague} disabled={creatingLeague}>
            {creatingLeague ? <CircularProgress size={24} color="inherit" /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join League Dialog */}
      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
        <DialogTitle>Join League</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="inviteCode"
            label="Invite Code"
            type="text"
            fullWidth
            variant="standard"
            value={joinInviteCode}
            onChange={(e) => setJoinInviteCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinLeague} disabled={joiningLeague}>
            {joiningLeague ? <CircularProgress size={24} color="inherit" /> : 'Join'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaguesPage;
