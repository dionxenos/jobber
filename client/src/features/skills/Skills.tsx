import { useEffect } from "react";
import { Paper, CircularProgress, ListItem, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchSkills, skillSelectors } from "./skillSlice";
import ChipWrapper from "./ChipWrapper";

const Skills = () => {
  const dispatch = useAppDispatch();
  const skills = useAppSelector(skillSelectors.selectAll);
  const { skillsLoaded, status } = useAppSelector((state) => state.skill);

  useEffect(() => {
    if (!skillsLoaded) dispatch(fetchSkills());
  }, [skillsLoaded, dispatch]);

  if (status === "pending") {
    return (
      <Paper
        square={false}
        component="div"
        sx={{
          height: "150px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="secondary" sx={{ my: "auto" }} />
      </Paper>
    );
  }

  if (!skills) {
    return <Typography component="p">No skills found.</Typography>;
  }

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 2,
        m: 0,
        gap: 1,
      }}
      component="ul"
    >
      {skills.map((skill) => (
        <ListItem component="li" key={skill.id} sx={{ display: "contents" }}>
          <ChipWrapper
            label={skill.name}
            handleDelete={() => console.log(skill.id)}
            color="primary"
            sx={{ backgroundColor: "secondary.main" }}
          />
        </ListItem>
      ))}
    </Paper>
  );
};

export default Skills;
