import { Typography } from "@mui/material";

interface Props {
  errorText: string;
}

export default function ErrorText({ errorText }: Props) {
  return (
    <Typography component="span" color="error.main">
      {errorText}
    </Typography>
  );
}
