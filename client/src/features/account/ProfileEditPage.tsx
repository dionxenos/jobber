import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProfileEditForm, profileEditSchema } from "../../app/models/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorText from "../../app/components/ErrorText";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { signOut } from "./accountSlice";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
    },
  });

  const onSubmit: SubmitHandler<ProfileEditForm> = async (data) => {
    try {
      await agent.Users.update(user!.id, data);
      toast.success("Profile updated successfully");
      navigate(`/users/${user!.id}`);
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    try {
      await agent.Users.remove(user!.id);
      dispatch(signOut());
      toast.success("Account deleted");
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to delete account");
    }
  };

  if (!user) return null;

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography component="h1" variant="h5" textAlign="center">
          Edit Profile
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 2 }}
        >
          <TextField
            error={!!errors.fullName}
            margin="normal"
            required
            fullWidth
            label="Full Name"
            {...register("fullName")}
          />
          {errors.fullName?.message && <ErrorText errorText={errors.fullName.message} />}

          <TextField
            error={!!errors.email}
            margin="normal"
            required
            fullWidth
            label="Email"
            {...register("email")}
          />
          {errors.email?.message && <ErrorText errorText={errors.email.message} />}

          <TextField
            error={!!errors.telephone}
            margin="normal"
            required
            fullWidth
            label="Telephone"
            {...register("telephone")}
          />
          {errors.telephone?.message && (
            <ErrorText errorText={errors.telephone.message} />
          )}

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 1 }}
            disabled={isSubmitting}
          >
            Save Changes
          </LoadingButton>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            sx={{ mb: 2 }}
            onClick={() => setDeleteOpen(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
