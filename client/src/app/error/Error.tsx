import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <Container component={Box}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "50vh" }}
      >
        <Typography variant="h4" gutterBottom color="secondary">
          Oops - We could not find what you are looking for.
        </Typography>
        <Button variant="outlined" color="info" component={Link} to="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
