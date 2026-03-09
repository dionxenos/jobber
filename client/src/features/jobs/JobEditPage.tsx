import { useCallback, useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import {
  EducationField,
  EducationLevel,
  Job,
  JobEducationResponse,
  JobLanguageResponse,
  Language,
  LanguageLevel,
  Skill,
} from "../../app/models/interfaces";

export default function JobEditPage() {
  const { id } = useParams();
  const jobId = parseInt(id || "0");

  const [job, setJob] = useState<Job | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [jobSkills, setJobSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
  const [jobLanguages, setJobLanguages] = useState<JobLanguageResponse[]>([]);
  const [langInput, setLangInput] = useState("");
  const [langLevel, setLangLevel] = useState("");

  const [eduFields, setEduFields] = useState<EducationField[]>([]);
  const [eduLevels, setEduLevels] = useState<EducationLevel[]>([]);
  const [jobEducation, setJobEducation] = useState<JobEducationResponse[]>([]);
  const [eduFieldInput, setEduFieldInput] = useState("");
  const [eduLevelInput, setEduLevelInput] = useState("");

  const loadData = useCallback(async () => {
    if (!jobId) return;
    const [jobData, skills, jSkills, langs, lLevels, jLangs, eFields, eLevels, jEdu] =
      await Promise.all([
        agent.Jobs.byId(jobId),
        agent.Skills.list(),
        agent.Jobs.getSkills(jobId),
        agent.Languages.list(),
        agent.Languages.levels(),
        agent.Jobs.getLanguages(jobId),
        agent.Education.fields(),
        agent.Education.levels(),
        agent.Jobs.getEducation(jobId),
      ]);
    setJob(jobData);
    setAllSkills(skills);
    setJobSkills(jSkills.jobSkills?.map((js: any) => js.skill) || []);
    setAllLanguages(langs);
    setLanguageLevels(lLevels);
    setJobLanguages(jLangs);
    setEduFields(eFields);
    setEduLevels(eLevels);
    setJobEducation(jEdu);
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addSkill = async (skillId: number) => {
    await agent.Jobs.addSkill(jobId, skillId);
    toast.success("Skill added");
    setSkillInput("");
    loadData();
  };

  const removeSkill = async (skillId: number) => {
    await agent.Jobs.removeSkill(jobId, skillId);
    toast.success("Skill removed");
    loadData();
  };

  const addLanguage = async () => {
    if (!langInput || !langLevel) return;
    const lang = allLanguages.find((l) => l.name === langInput);
    if (!lang) { toast.error("Language not found"); return; }
    await agent.Jobs.addLanguage(jobId, lang.code, langLevel);
    toast.success("Language added");
    setLangInput("");
    setLangLevel("");
    loadData();
  };

  const removeLanguage = async (langId: number) => {
    await agent.Jobs.removeLanguage(langId);
    toast.success("Language removed");
    loadData();
  };

  const addEducation = async () => {
    if (!eduFieldInput || !eduLevelInput) return;
    const field = eduFields.find((f) => f.name === eduFieldInput);
    const level = eduLevels.find((l) => l.level === eduLevelInput);
    if (!field || !level) { toast.error("Not found"); return; }
    await agent.Jobs.addEducation(jobId, field.id, level.id);
    toast.success("Education added");
    setEduFieldInput("");
    setEduLevelInput("");
    loadData();
  };

  const removeEducation = async (eduId: number) => {
    await agent.Jobs.removeEducation(eduId);
    toast.success("Education removed");
    loadData();
  };

  const jobSkillIds = jobSkills.map((s) => s.id);
  const availableSkills = allSkills.filter((s) => !jobSkillIds.includes(s.id));

  if (!job) return <Typography textAlign="center">Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Add or edit requirements for this job.
      </Typography>

      {/* Skills */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Skills</Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {jobSkills.map((s) => (
            <ListItem key={s.id} sx={{ display: "contents" }}>
              <Chip label={s.name} onDelete={() => removeSkill(s.id)} color="primary" />
            </ListItem>
          ))}
        </Box>
        <Autocomplete
          options={availableSkills}
          getOptionLabel={(o) => o.name}
          inputValue={skillInput}
          onInputChange={(_, v) => setSkillInput(v)}
          onChange={(_, v) => { if (v) addSkill(v.id); }}
          renderInput={(params) => <TextField {...params} label="Add Skill..." size="small" />}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      {/* Languages */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Languages</Typography>
        <Divider sx={{ my: 1 }} />
        {jobLanguages.map((jl) => (
          <Box key={jl.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "bold", mr: 2 }}>{jl.languageName}</Typography>
            <Chip label={jl.languageLevelCode} size="small" sx={{ mr: 1 }} />
            <IconButton size="small" onClick={() => removeLanguage(jl.id)} color="error">
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
        <Typography variant="h6">Education</Typography>
        <Divider sx={{ my: 1 }} />
        {jobEducation.map((je) => (
          <Box key={je.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: "bold", mr: 1 }}>{je.name}</Typography>
            <Chip label={je.level} size="small" sx={{ mr: 1 }} />
            <IconButton size="small" onClick={() => removeEducation(je.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Grid container spacing={1} sx={{ mt: 1 }} alignItems="center">
          <Grid item xs={5}>
            <Autocomplete
              options={eduFields.map((f) => f.name)}
              inputValue={eduFieldInput}
              onInputChange={(_, v) => setEduFieldInput(v)}
              renderInput={(params) => <TextField {...params} label="Field" size="small" />}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl size="small" fullWidth>
              <InputLabel>Degree</InputLabel>
              <Select value={eduLevelInput} label="Degree" onChange={(e) => setEduLevelInput(e.target.value)}>
                {eduLevels.map((el) => (
                  <MenuItem key={el.id} value={el.level}>{el.level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addEducation}>Add</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
