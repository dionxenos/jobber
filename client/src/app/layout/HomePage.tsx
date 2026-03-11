import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  Grid,
  ListItem,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { Navigate, NavLink } from "react-router-dom";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkIcon from "@mui/icons-material/Work";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { fetchSkills, skillSelectors } from "../../features/skills/skillSlice";

const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 48 }} />,
    title: "Skills-Based Matching",
    description:
      "Our algorithm matches candidates to jobs based on competencies, not just keywords.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
    title: "Percentage Scoring",
    description:
      "Get a transparent match score across skills, languages, and education criteria.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 48 }} />,
    title: "Two-Way Platform",
    description:
      "Whether you're hiring or job hunting, Jobber streamlines the connection.",
  },
];

const forCandidates = [
  "Build your profile with skills, languages & education",
  "Get matched to relevant positions automatically",
  "Receive interview invitations from employers",
];

const forEmployers = [
  "Post jobs with detailed competency requirements",
  "Recruit from a ranked list of matched candidates",
  "Invite top matches directly for interviews",
];

const HomePage = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const skills = useAppSelector(skillSelectors.selectAll);
  const { skillsLoaded, status } = useAppSelector((state) => state.skill);

  useEffect(() => {
    if (!skillsLoaded) dispatch(fetchSkills());
  }, [skillsLoaded, dispatch]);

  const isDark = theme.palette.mode === "dark";

  if (user) {
    return <Navigate to={user.roleCode.trim() === "CANDI" ? "/cv" : "/jobs"} replace />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Fade in timeout={800}>
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #e8edf5 50%, #dce3ed 100%)",
            borderRadius: 3,
            mb: 6,
            px: 3,
          }}
        >
          <Box
            component="img"
            src="/logo.svg"
            alt="Jobber"
            sx={{ width: 80, height: 80, mb: 2, borderRadius: 2 }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light || "#ff8a65"})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            The Right Talent, The Right Job
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 640,
              mx: "auto",
              mb: 4,
              fontSize: { xs: "1rem", md: "1.35rem" },
              lineHeight: 1.6,
            }}
          >
            Jobber connects candidates and employers through intelligent
            competency-based matching — so the right people find the right jobs.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: "1rem" }}
            >
              Get Started
            </Button>
            <Button
              component={NavLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                borderColor: "secondary.main",
                color: "secondary.main",
                "&:hover": {
                  borderColor: "secondary.dark",
                  backgroundColor: "rgba(255,87,34,0.08)",
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Fade>

      {/* Features Section */}
      <Fade in timeout={1200}>
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 1 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 5, maxWidth: 500, mx: "auto" }}
          >
            A smarter way to match talent with opportunity
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    border: 1,
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "secondary.main",
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${isDark ? "rgba(255,87,34,0.15)" : "rgba(255,87,34,0.1)"}`,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: "secondary.main", mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* For Candidates & Employers */}
      <Fade in timeout={1600}>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                border: 1,
                borderColor: "divider",
              }}
              elevation={0}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <PersonSearchIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                <Typography variant="h5" fontWeight={700}>
                  For Candidates
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {forCandidates.map((item, i) => (
                  <Stack direction="row" alignItems="flex-start" spacing={1.5} key={i}>
                    <VerifiedIcon
                      sx={{ color: "secondary.main", fontSize: 20, mt: 0.3 }}
                    />
                    <Typography variant="body1">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                component={NavLink}
                to="/register"
                variant="text"
                color="secondary"
                sx={{ mt: 3, fontWeight: 600 }}
              >
                Create Candidate Profile &rarr;
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                border: 1,
                borderColor: "divider",
              }}
              elevation={0}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <WorkIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                <Typography variant="h5" fontWeight={700}>
                  For Employers
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {forEmployers.map((item, i) => (
                  <Stack direction="row" alignItems="flex-start" spacing={1.5} key={i}>
                    <VerifiedIcon
                      sx={{ color: "secondary.main", fontSize: 20, mt: 0.3 }}
                    />
                    <Typography variant="body1">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                component={NavLink}
                to="/register"
                variant="text"
                color="secondary"
                sx={{ mt: 3, fontWeight: 600 }}
              >
                Start Hiring &rarr;
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Fade>

      {/* Trending Skills */}
      <Fade in timeout={2000}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 1 }}
          >
            Trending Skills
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4, maxWidth: 460, mx: "auto" }}
          >
            Explore the most in-demand competencies on the platform
          </Typography>
          {status === "pending" ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : skills.length > 0 ? (
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 3,
                m: 0,
                gap: 1,
              }}
              component="ul"
              elevation={0}
            >
              {skills.map((skill) => (
                <ListItem
                  component="li"
                  key={skill.id}
                  sx={{ display: "contents" }}
                >
                  <Chip
                    label={skill.name}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "default",
                    }}
                  />
                </ListItem>
              ))}
            </Paper>
          ) : (
            <Typography textAlign="center" color="text.secondary">
              No skills available yet.
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default HomePage;
