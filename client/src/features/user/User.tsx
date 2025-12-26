import {
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useEffect } from "react";
import { fetchUser } from "./userSlice";
import UserDetails from "./UserDetails";
import UserEducation from "./UserEducations";
import UserSkills from "./UserSkills";
import UserLanguages from "./UserLanguages";

const cardSX = { flexGrow: 1, p: 2, mb: 2 };

export default function User() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { status, userDetails: user } = useAppSelector((state) => state.user);

  useEffect(() => {
    id && dispatch(fetchUser(parseInt(id)));
  }, [dispatch, id]);

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
    <Grid container spacing={2}>
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
    </Grid>
  );
}
