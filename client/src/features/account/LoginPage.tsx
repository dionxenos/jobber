import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm, loginSchema } from "../../app/models/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorText from "../../app/components/ErrorText";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const result = await dispatch(signInUser(data)).unwrap();
      navigate(result.roleCode.trim() === "CANDI" ? "/cv" : "/jobs");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            error={errors.email !== undefined}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoFocus
            {...register("email")}
          />
          {errors.email?.message && (
            <ErrorText errorText={errors.email.message} />
          )}
          <TextField
            error={errors.password !== undefined}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            {...register("password")}
          />
          {errors.password?.message && (
            <ErrorText errorText={errors.password.message} />
          )}

          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Sign In
          </LoadingButton>
          <Box component="div" textAlign="center">
            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{
                color: "secondary.main",
                "&:hover": { color: "secondary.dark" },
              }}
            >
              {"Don't have an account? Sign Up"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
