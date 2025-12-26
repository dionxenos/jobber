import { Container, CssBaseline, ThemeProvider } from "@mui/material";
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
      {loading ? (
        <Loader message="Loading..." />
      ) : (
        <>
          <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <Container sx={{ mt: 4 }}>
            {location.pathname === "/" ? <HomePage /> : <Outlet />}
          </Container>
        </>
      )}
      <Copyright position="absolute" sx={{ left: 0, bottom: 0, right: 0 }} />
    </ThemeProvider>
  );
}

export default App;
