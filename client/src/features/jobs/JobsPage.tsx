import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import { useAppSelector } from "../../app/store/configureStore";
import { useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import { Job } from "../../app/models/interfaces";
import { toast } from "react-toastify";

export default function JobsPage() {
  const { user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const loadedRef = useRef(false);

  const loadJobs = useCallback(async () => {
    if (!user) return;
    const data = await agent.Jobs.byUserId(user.id);
    setJobs(data);
  }, [user]);

  useEffect(() => {
    if (user && !loadedRef.current) {
      loadedRef.current = true;
      loadJobs();
    }
  }, [user, loadJobs]);

  const addJob = async () => {
    if (!user || !newTitle.trim()) return;
    await agent.Jobs.add(user.id, newTitle.trim());
    toast.success("Job added");
    setNewTitle("");
    loadJobs();
  };

  const deleteJob = async (id: number) => {
    await agent.Jobs.remove(id);
    toast.success("Job deleted");
    loadJobs();
  };

  return (
    <Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        My Jobs
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Post new Jobs or edit already existing ones.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Add new Job
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <TextField
            size="small"
            label="Job Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addJob()}
            sx={{ minWidth: 300 }}
          />
          <Button variant="contained" color="secondary" onClick={addJob}>
            Add
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Active Jobs
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {jobs.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No active jobs yet
          </Typography>
        ) : (
          <List>
            {jobs.map((job) => (
              <ListItem
                key={job.id}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => navigate(`/jobs/${job.id}/edit`)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/jobs/${job.id}/recruit`)} color="secondary">
                      <PeopleIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteJob(job.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={job.title} secondary={new Date(job.createdOn).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
