import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Copyright from "../components/Copyright";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useTheme from "../hooks/theme";
import { useAppDispatch } from "../store/configureStore";
import { useCallback, useEffect, useState } from "react";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "./HomePage";
import Loader from "./Loader";

function App() {
  const location = useLocation();
  const { darkMode, theme, handleThemeChange } = useTheme();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (error) {
      //console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => {
      setLoading(false);
    });
  }, [initApp]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        theme="colored"
        autoClose={1000}
      />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {loading ? (
          <Loader message="Loading..." />
        ) : (
          <>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
            <Container sx={{ mt: 4, flex: 1 }}>
              {location.pathname === "/" ? <HomePage /> : <Outlet />}
            </Container>
          </>
        )}
        <Box component="footer" sx={{ py: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
