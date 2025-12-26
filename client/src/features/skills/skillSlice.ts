import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { FetchStatus, Skill } from "../../app/models/interfaces";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

interface SkillState {
  skillsLoaded: boolean;
  status: FetchStatus;
}

export const skillsAdapter = createEntityAdapter<Skill>();

export const fetchSkills = createAsyncThunk<Skill[], void>(
  "skills/fetchSkills",
  async (_, thunkAPI) => {
    try {
      const response = agent.Skills.list();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const skillSlice = createSlice({
  name: "skills",
  initialState: skillsAdapter.getInitialState<SkillState>({
    skillsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSkills.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.skillsLoaded = true;
      state.status = "idle";
      skillsAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchSkills.rejected, (state, action) => {
      state.skillsLoaded = false;
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

// export const {} = skillSlice.actions;

export const skillSelectors = skillsAdapter.getSelectors(
  (state: RootState) => state.skill
);
