import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import {
  EducationField,
  EducationLevel,
  LanguageLevel,
  RecommendedSkill,
  Skill,
  UserSkillResponse,
  UserLanguageResponse,
  UserEducationResponse,
  Language,
} from "../../app/models/interfaces";

export default function CvPage() {
  const { user } = useAppSelector((state) => state.account);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkillResponse[]>([]);
  const [recommended, setRecommended] = useState<RecommendedSkill[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
  const [userLanguages, setUserLanguages] = useState<UserLanguageResponse[]>([]);
  const [langInput, setLangInput] = useState("");
  const [langLevel, setLangLevel] = useState("");

  const [eduFields, setEduFields] = useState<EducationField[]>([]);
  const [eduLevels, setEduLevels] = useState<EducationLevel[]>([]);
  const [userEducation, setUserEducation] = useState<UserEducationResponse | null>(null);
  const [eduFieldInput, setEduFieldInput] = useState("");
  const [eduLevelInput, setEduLevelInput] = useState("");
  const [eduFrom, setEduFrom] = useState(2020);
  const [eduTo, setEduTo] = useState(2024);

  const userId = user?.id;
  const loadedRef = useRef(false);

  const loadData = async () => {
    if (!userId) return;
    const [skills, uSkills, rec, langs, lLevels, uLangs, eFields, eLevels, uEdu] =
      await Promise.all([
        agent.Skills.list(),
        agent.UserSkills.list(userId),
        agent.UserSkills.recommended(userId),
        agent.Languages.list(),
        agent.Languages.levels(),
        agent.UserLanguages.list(userId),
        agent.Education.fields(),
        agent.Education.levels(),
        agent.UserEducation.list(userId),
      ]);
    setAllSkills(skills);
    setUserSkills(uSkills);
    setRecommended(rec);
    setAllLanguages(langs);
    setLanguageLevels(lLevels);
    setUserLanguages(uLangs);
    setEduFields(eFields);
    setEduLevels(eLevels);
    setUserEducation(uEdu.degrees ? uEdu : null);
  };

  useEffect(() => {
    if (userId && !loadedRef.current) {
      loadedRef.current = true;
      loadData();
    }
  }, [userId]);

  const addSkill = async (skillId: number) => {
    if (!userId) return;
    await agent.UserSkills.add(userId, skillId);
    toast.success("Skill added");
    loadData();
  };

  const removeSkill = async (skillId: number) => {
    if (!userId) return;
    await agent.UserSkills.remove(userId, skillId);
    toast.success("Skill removed");
    loadData();
  };

  const addLanguage = async () => {
    if (!userId || !langInput || !langLevel) return;
    const lang = allLanguages.find((l) => l.name === langInput);
    if (!lang) { toast.error("Language not found"); return; }
    await agent.UserLanguages.add(userId, lang.code, langLevel);
    toast.success("Language added");
    setLangInput("");
    setLangLevel("");
    loadData();
  };

  const removeLanguage = async (id: number) => {
    await agent.UserLanguages.remove(id);
    toast.success("Language removed");
    loadData();
  };

  const addEducation = async () => {
    if (!userId || !eduFieldInput || !eduLevelInput) return;
    const field = eduFields.find((f) => f.name === eduFieldInput);
    const level = eduLevels.find((l) => l.level === eduLevelInput);
    if (!field || !level) { toast.error("Education not found"); return; }
    await agent.UserEducation.add(userId, field.id, level.id, eduFrom, eduTo);
    toast.success("Education added");
    setEduFieldInput("");
    setEduLevelInput("");
    loadData();
  };

  const removeEducation = async (id: number) => {
    await agent.UserEducation.remove(id);
    toast.success("Education removed");
    loadData();
  };

  const userSkillIds = userSkills.map((s) => s.id);
  const availableSkills = allSkills.filter((s) => !userSkillIds.includes(s.id));
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        My CV
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Create or edit your CV. This will be visible to recruiters and other users.
      </Typography>

      {/* Skills */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5">Skills</Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }} component="ul" p={0}>
          {userSkills.map((s) => (
            <ListItem key={s.id} sx={{ display: "contents" }}>
              <Chip
                label={s.name}
                onDelete={() => removeSkill(s.id)}
                color="primary"
                sx={{ backgroundColor: "info.main" }}
              />
            </ListItem>
          ))}
        </Box>
        <Autocomplete
          options={availableSkills}
          getOptionLabel={(o) => o.name}
          inputValue={skillInput}
          onInputChange={(_, v) => setSkillInput(v)}
          onChange={(_, v) => { if (v) { addSkill(v.id); setSkillInput(""); } }}
          renderInput={(params) => <TextField {...params} label="Add new skill..." size="small" />}
          sx={{ maxWidth: 400 }}
        />
        {recommended.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              You might also know
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {recommended.map((r) => (
                <Chip
                  key={r.id}
                  label={r.name}
                  variant="outlined"
                  color="warning"
                  onClick={() => addSkill(r.id)}
                  clickable
                />
              ))}
            </Box>
          </>
        )}
      </Paper>

      {/* Languages */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5">Languages</Typography>
        <Divider sx={{ my: 1 }} />
        {userLanguages.map((ul) => (
          <Box key={ul.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "bold", mr: 2 }}>{ul.language.name}</Typography>
            <Chip label={ul.languageLevelCode} size="small" sx={{ backgroundColor: "secondary.dark", color: "white", mr: 1 }} />
            <IconButton size="small" onClick={() => removeLanguage(ul.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Grid container spacing={1} sx={{ mt: 1 }} alignItems="center">
          <Grid item xs={5}>
            <Autocomplete
              options={allLanguages.map((l) => l.name)}
              inputValue={langInput}
              onInputChange={(_, v) => setLangInput(v)}
              renderInput={(params) => <TextField {...params} label="Language" size="small" />}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl size="small" fullWidth>
              <InputLabel>Level</InputLabel>
              <Select value={langLevel} label="Level" onChange={(e) => setLangLevel(e.target.value)}>
                {languageLevels.map((ll) => (
                  <MenuItem key={ll.code} value={ll.code}>{ll.code}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addLanguage}>Add</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Education */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Education</Typography>
        <Divider sx={{ my: 1 }} />
        {userEducation?.degrees?.map((d) => (
          <Box key={d.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "bold", mr: 1 }}>{d.fieldName}</Typography>
            <Chip label={d.level} size="small" sx={{ backgroundColor: "secondary.dark", color: "white", mr: 1 }} />
            <Typography variant="body2" sx={{ mr: 1 }}>{d.from} - {d.to}</Typography>
            <IconButton size="small" onClick={() => removeEducation(d.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Grid container spacing={1} sx={{ mt: 1 }} alignItems="center">
          <Grid item xs={3}>
            <Autocomplete
              options={eduFields.map((f) => f.name)}
              inputValue={eduFieldInput}
              onInputChange={(_, v) => setEduFieldInput(v)}
              renderInput={(params) => <TextField {...params} label="Field" size="small" />}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Degree</InputLabel>
              <Select value={eduLevelInput} label="Degree" onChange={(e) => setEduLevelInput(e.target.value)}>
                {eduLevels.map((el) => (
                  <MenuItem key={el.id} value={el.level}>{el.level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>From</InputLabel>
              <Select value={eduFrom} label="From" onChange={(e) => setEduFrom(Number(e.target.value))}>
                {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>To</InputLabel>
              <Select value={eduTo} label="To" onChange={(e) => setEduTo(Number(e.target.value))}>
                {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addEducation}>Add</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
