import { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { User } from "../../app/models/interfaces";
import agent from "../../app/api/agent";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const data = await agent.Users.search(q.trim());
    setResults(data);
    setSearched(true);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Search Users
      </Typography>
      <TextField
        fullWidth
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      {searched && results.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No users found matching "{query}"
        </Typography>
      )}
      {results.length > 0 && (
        <Paper elevation={0} sx={{ border: 1, borderColor: "divider" }}>
          <List disablePadding>
            {results.map((user, i) => (
              <ListItem
                key={user.id}
                disablePadding
                divider={i < results.length - 1}
              >
                <ListItemButton onClick={() => navigate(`/users/${user.id}`)}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName}
                    secondary={user.email}
                  />
                  <Chip
                    label={user.roleCode.trim() === "CANDI" ? "Candidate" : "Employer"}
                    size="small"
                    color={user.roleCode.trim() === "CANDI" ? "info" : "secondary"}
                    variant="outlined"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
