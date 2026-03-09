import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
    >
      {"Copyright © "}
      <Typography component={Link} color="inherit" to="/">
        Jobber
      </Typography>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
