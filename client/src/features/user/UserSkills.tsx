import { Box, ListItem, Chip, Typography } from "@mui/material";
import { Skill } from "../../app/models/interfaces";

interface Props {
  userId: number | null;
  skills: Skill[];
}

export default function UserSkills({ skills }: Props) {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "left",
        flexWrap: "wrap",
        listStyle: "none",
        gap: 1,
        paddingLeft: 0,
      }}
      component="ul"
    >
      {skills.length > 0 ? (
        skills.map((skill) => (
          <ListItem component="li" key={skill.id} sx={{ display: "contents" }}>
            <Chip
              label={skill.name}
              color="primary"
              sx={{ backgroundColor: "info.main" }}
            />
          </ListItem>
        ))
      ) : (
        <Typography variant="body1">No skills added</Typography>
      )}
    </Box>
  );
}
