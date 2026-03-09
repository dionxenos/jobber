import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useAppSelector } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { Interview } from "../../app/models/interfaces";
import { toast } from "react-toastify";

export default function InvitesPage() {
  const { user } = useAppSelector((state) => state.account);
  const [invites, setInvites] = useState<Interview[]>([]);
  const isCandidate = user?.roleCode.trim() === "CANDI";
  const loadedRef = useRef(false);

  const loadInvites = async () => {
    if (!user) return;
    const data = isCandidate
      ? await agent.Interviews.candidateInvites(user.id)
      : await agent.Interviews.employerInvites(user.id);
    setInvites(data);
  };

  useEffect(() => {
    if (user && !loadedRef.current) {
      loadedRef.current = true;
      loadInvites();
    }
  }, [user]);

  const accept = async (id: number) => {
    await agent.Interviews.accept(id);
    toast.success("Invite accepted");
    loadInvites();
  };

  const decline = async (id: number) => {
    await agent.Interviews.decline(id);
    toast.success("Invite declined");
    loadInvites();
  };

  return (
    <Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Interview Invites
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Divider sx={{ mb: 2 }} />
        {invites.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No invites yet
          </Typography>
        ) : (
          <List>
            {invites.map((inv) => (
              <ListItem
                key={inv.id}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {inv.hasAccepted ? (
                      <Chip label="Accepted" color="success" size="small" icon={<CheckIcon />} />
                    ) : isCandidate ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => accept(inv.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => decline(inv.id)}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Chip label="Pending Response" size="small" icon={<HourglassEmptyIcon />} />
                    )}
                  </Box>
                }
              >
                <ListItemText
                  primary={inv.fullName}
                  secondary={inv.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
