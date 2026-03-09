import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { useAppSelector } from "../../app/store/configureStore";
import { Interview, Job, TotalScore } from "../../app/models/interfaces";
import { toast } from "react-toastify";

export default function RecruitPage() {
  const { id } = useParams();
  const jobId = parseInt(id || "0");

  const { user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [skillWeight, setSkillWeight] = useState(1);
  const [langWeight, setLangWeight] = useState(1);
  const [eduWeight, setEduWeight] = useState(1);
  const [numResults, setNumResults] = useState(25);
  const [results, setResults] = useState<TotalScore[]>([]);
  const [invitedCandIds, setInvitedCandIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (jobId) agent.Jobs.byId(jobId).then(setJob);
  }, [jobId]);

  useEffect(() => {
    if (!user) return;
    agent.Interviews.employerInvites(user.id).then((invites: Interview[]) => {
      setInvitedCandIds(new Set(invites.map((i) => i.userId)));
    });
  }, [user]);

  const recruit = useCallback(async () => {
    if (!jobId) return;
    const data = await agent.Jobs.recruit(jobId, skillWeight, langWeight, eduWeight, numResults);
    setResults(data);
  }, [jobId, skillWeight, langWeight, eduWeight, numResults]);

  const invite = async (candId: number) => {
    if (!user) return;
    try {
      await agent.Interviews.create(user.id, candId);
      setInvitedCandIds((prev) => new Set(prev).add(candId));
      toast.success("Invite sent");
    } catch {
      toast.error("Failed to send invite");
    }
  };

  if (!job) return <Typography textAlign="center">Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Recruit for: {job.title}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Scoring Weights
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Skill Weight: {skillWeight}</Typography>
          <Slider value={skillWeight} onChange={(_, v) => setSkillWeight(v as number)} min={0} max={5} step={0.1} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Language Weight: {langWeight}</Typography>
          <Slider value={langWeight} onChange={(_, v) => setLangWeight(v as number)} min={0} max={5} step={0.1} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Education Weight: {eduWeight}</Typography>
          <Slider value={eduWeight} onChange={(_, v) => setEduWeight(v as number)} min={0} max={5} step={0.1} />
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Number of Results"
            type="number"
            size="small"
            value={numResults}
            onChange={(e) => setNumResults(parseInt(e.target.value) || 25)}
            sx={{ width: 200 }}
          />
          <Button variant="contained" color="secondary" onClick={recruit}>
            Find Candidates
          </Button>
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Skill Score</TableCell>
                  <TableCell align="right">Language Score</TableCell>
                  <TableCell align="right">Education Score</TableCell>
                  <TableCell align="right">Total Score</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.rowNum}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{r.fullName}</TableCell>
                    <TableCell align="right">{r.skillScore}</TableCell>
                    <TableCell align="right">{r.langScore}</TableCell>
                    <TableCell align="right">{r.eduScore}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>{r.totalScore}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Profile">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/users/${r.id}`)}>
                          <PersonIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {invitedCandIds.has(r.id) ? (
                        <Tooltip title="Already Invited">
                          <CheckCircleIcon fontSize="small" color="success" sx={{ ml: 1, verticalAlign: "middle" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Send Invite">
                          <IconButton size="small" color="secondary" onClick={() => invite(r.id)}>
                            <MailOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
