import { Divider, Paper, Typography } from "@mui/material";

export default function About() {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h3">About this Project</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">
        <i>JOBBER</i> is a concept project, developed for percentage matching the
        competencies of job seekers (<i>Candidates</i>) against jobs posted by{" "}
        <i>Employers</i>.
      </Typography>
      <br />
      <Typography variant="h6">
        It is my Thesis Dissertation implementation recreated in React with a
        .NET backend and Microsoft SQL Server as a datasource.
      </Typography>
    </Paper>
  );
}
