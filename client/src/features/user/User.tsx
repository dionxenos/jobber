import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useCallback, useEffect, useState } from "react";
import { fetchUser } from "./userSlice";
import UserDetails from "./UserDetails";
import UserEducation from "./UserEducations";
import UserSkills from "./UserSkills";
import UserLanguages from "./UserLanguages";
import {
  Job,
  JobEducationResponse,
  JobLanguageResponse,
  Skill,
} from "../../app/models/interfaces";
import agent from "../../app/api/agent";

const cardSX = { p: 2, mb: 2 };

interface JobWithDetails extends Job {
  skills: Skill[];
  languages: JobLanguageResponse[];
  education: JobEducationResponse[];
}

export default function User() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { status, userDetails: user } = useAppSelector((state) => state.user);
  const [jobs, setJobs] = useState<JobWithDetails[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    id && dispatch(fetchUser(parseInt(id)));
  }, [dispatch, id]);

  const isEmployer = user?.details?.roleCode.trim() === "EMPLO";

  const loadJobs = useCallback(async () => {
    if (!id || !isEmployer) return;
    setJobsLoading(true);
    try {
      const jobList: Job[] = await agent.Jobs.byUserId(parseInt(id));
      const detailed = await Promise.all(
        jobList.map(async (job) => {
          const [skillsRes, languages, education] = await Promise.all([
            agent.Jobs.getSkills(job.id),
            agent.Jobs.getLanguages(job.id),
            agent.Jobs.getEducation(job.id),
          ]);
          return {
            ...job,
            skills: skillsRes.jobSkills?.map((js: any) => js.skill) || [],
            languages,
            education,
          };
        })
      );
      setJobs(detailed);
    } finally {
      setJobsLoading(false);
    }
  }, [id, isEmployer]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  if (status === "pending")
    return (
      <Paper
        component="div"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}
      >
        <CircularProgress color="secondary" sx={{ my: "auto" }} />
      </Paper>
    );

  if (!user)
    return (
      <Typography variant="h3" textAlign="center">
        User not found.
      </Typography>
    );

  return (
    <Grid container spacing={2} justifyContent="center">
      {isEmployer ? (
        <Grid item xs={12}>
          <Paper sx={cardSX}>
            <Typography variant="h5">Details</Typography>
            <Divider sx={{ my: 2 }} />
            <UserDetails user={user.details!} />
          </Paper>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Posted Jobs
          </Typography>
          {jobsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : jobs.length > 0 ? (
            <Stack spacing={2}>
              {jobs.map((job) => (
                <Paper key={job.id} sx={{ p: 3, border: 1, borderColor: "divider" }} elevation={0}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <WorkIcon color="secondary" />
                    <Typography variant="h6" fontWeight={700}>
                      {job.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Posted on {new Date(job.createdOn).toDateString()}
                  </Typography>

                  {job.skills.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Required Skills
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {job.skills.map((s) => (
                          <Chip key={s.id} label={s.name} size="small" color="primary" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {job.languages.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Required Languages
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {job.languages.map((l) => (
                          <Chip
                            key={l.id}
                            label={`${l.languageName} (${l.languageLevelCode})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {job.education.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Required Education
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {job.education.map((e) => (
                          <Chip
                            key={e.id}
                            label={`${e.name} - ${e.level}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {job.skills.length === 0 && job.languages.length === 0 && job.education.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No requirements specified yet
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No jobs posted</Typography>
          )}
        </Grid>
      ) : (
        <>
          <Grid item md={7} xs={12}>
            <Paper sx={cardSX}>
              <Typography variant="h5">Details</Typography>
              <Divider sx={{ my: 2 }} />
              <UserDetails user={user.details!} />
            </Paper>
            <Paper sx={cardSX}>
              <Typography variant="h5">Education</Typography>
              <Divider sx={{ my: 2 }} />
              <UserEducation education={user.education} />
            </Paper>
          </Grid>
          <Grid item md={5} xs={12}>
            <Paper sx={cardSX}>
              <Typography variant="h5">Skills</Typography>
              <Divider sx={{ my: 2 }} />
              <UserSkills userId={parseInt(id ?? "-1")} skills={user.skills!} />
            </Paper>
            <Paper sx={cardSX}>
              <Typography variant="h5">Languages</Typography>
              <Divider sx={{ my: 2 }} />
              <UserLanguages languages={user.languages!} />
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
}
