import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      mb={2}
      zIndex={10}
      {...props}
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
