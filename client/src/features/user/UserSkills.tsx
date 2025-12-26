import { Box, ListItem, Chip, Typography } from "@mui/material";
import { Skill } from "../../app/models/interfaces";
import { useAppSelector } from "../../app/store/configureStore";

interface Props {
  userId: number | null;
  skills: Skill[];
}

export default function UserSkills({ skills, userId: id }: Props) {
  const { user: self } = useAppSelector((state) => state.account);
  const isSelf = id === self?.id;

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
              onDelete={isSelf ? () => console.log(skill.id) : undefined}
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
