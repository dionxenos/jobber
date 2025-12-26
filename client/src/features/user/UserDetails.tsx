import { Grid, Typography } from "@mui/material";
import { User } from "../../app/models/interfaces";

interface Props {
  user: User;
}

export default function UserDetails({ user }: Props) {
  return (
    <Grid container spacing={1} sx={{ flexGrow: 1 }}>
      <Grid item xs={6}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", display: "inline" }}
        >
          Name:
        </Typography>{" "}
        {user.fullName}
      </Grid>
      <Grid item xs={6}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", display: "inline" }}
        >
          Email:
        </Typography>{" "}
        {user.email}
      </Grid>
      <Grid item xs={6}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", display: "inline" }}
        >
          Role:
        </Typography>{" "}
        {user.roleCode}
      </Grid>
      <Grid item xs={6}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", display: "inline" }}
        >
          Telephone:
        </Typography>{" "}
        {user.telephone}
      </Grid>
      <Grid item xs={6}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", display: "inline" }}
        >
          Member since:
        </Typography>{" "}
        {new Date(user.createdOn!).toDateString()}
      </Grid>
    </Grid>
  );
}
