import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Register, User } from "../../app/models/interfaces";
import agent from "../../app/api/agent";
import { router } from "../../app/routes/Router";
import { LoginForm } from "../../app/models/schemas";
import { toast } from "react-toastify";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, LoginForm>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUser = createAsyncThunk<User, Register>(
  "account/registerUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.register(data);
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.Account.currentUser();
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const logOutUser = createAsyncThunk(
  "account/signOutUser",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(signOut());
      await agent.Account.logout();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      router.navigate("/");
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
    });
    builder.addCase(logOutUser.fulfilled, () => {
      toast.success("You have successfully logged out.");
    });
    builder.addMatcher(
      isAnyOf(fetchCurrentUser.fulfilled, signInUser.fulfilled, registerUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(signInUser.rejected, registerUser.rejected),
      (_state, action) => {
        throw action.payload;
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;
