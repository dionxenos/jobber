import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchStatus, Skill, UserDetails } from "../../app/models/interfaces";
import agent from "../../app/api/agent";

interface UserState {
  userDetails: UserDetails | null;
  status: FetchStatus;
}

const initialState: UserState = {
  userDetails: null,
  status: "idle",
};

export const fetchUser = createAsyncThunk<UserDetails, number>(
  "users/fetchUser",
  async (data, thunkAPI) => {
    try {
      const userDetails = await agent.Users.details(data);
      return userDetails;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchRecommendedSkills = createAsyncThunk<Skill[], number>(
  "users/fetchRecommendedSkills",
  async (data, thunkAPI) => {
    try {
      const skills = await agent.UserSkills.recommended(data);
      return skills;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.userDetails = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.status = "idle";
    });
  },
});
