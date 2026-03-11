import {
  Avatar,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm, registerSchema } from "../../app/models/schemas";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorText from "../../app/components/ErrorText";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { registerUser } from "./accountSlice";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const result = await dispatch(
        registerUser({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          telephone: data.telephone,
          roleCode: data.roleCode,
        })
      ).unwrap();
      navigate(result.roleCode.trim() === "CANDI" ? "/cv" : "/jobs");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Get Started!
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            error={!!errors.fullName}
            margin="normal"
            required
            fullWidth
            label="Full Name"
            autoFocus
            {...register("fullName")}
          />
          {errors.fullName?.message && <ErrorText errorText={errors.fullName.message} />}

          <TextField
            error={!!errors.telephone}
            margin="normal"
            required
            fullWidth
            label="Telephone"
            {...register("telephone")}
          />
          {errors.telephone?.message && <ErrorText errorText={errors.telephone.message} />}

          <TextField
            error={!!errors.email}
            margin="normal"
            required
            fullWidth
            label="Email Address"
            {...register("email")}
          />
          {errors.email?.message && <ErrorText errorText={errors.email.message} />}

          <TextField
            error={!!errors.password}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
          />
          {errors.password?.message && <ErrorText errorText={errors.password.message} />}

          <TextField
            error={!!errors.confirmPassword}
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <ErrorText errorText={errors.confirmPassword.message} />
          )}

          <FormControl sx={{ mt: 2 }} error={!!errors.roleCode}>
            <FormLabel>Sign up as:</FormLabel>
            <Controller
              name="roleCode"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="CANDI" control={<Radio />} label="Candidate" />
                  <FormControlLabel value="EMPLO" control={<Radio />} label="Employer" />
                </RadioGroup>
              )}
            />
          </FormControl>
          {errors.roleCode?.message && <ErrorText errorText={errors.roleCode.message} />}

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Sign Up
          </LoadingButton>
          <Box component="div" textAlign="center">
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: "secondary.main",
                "&:hover": { color: "secondary.dark" },
              }}
            >
              Already have an account? Sign in!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
