import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const navStyles = {
  color: "inherit",
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  height: "inherit",
  margin: 0,
  "&.active": {
    color: "secondary.main",
    borderBottom: 3,
    borderColor: "inherit",
    borderRadius: 0,
  },
};

const pages = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
];
const settings = [
  { title: "Login", path: "/login" },
  { title: "Register", path: "/register" },
];

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { user } = useAppSelector((state) => state.account);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar>
      <Container>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <BusinessCenterRoundedIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              noWrap
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              JOBBER
            </Typography>
            <Tooltip title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
              <IconButton onClick={handleThemeChange} color="inherit">
                {darkMode ? <Brightness7Icon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    component={NavLink}
                    to={page.path}
                    sx={{
                      ...navStyles,
                      "&.active": { backgroundColor: "inherit" },
                    }}
                  >
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            JOBBER
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page) => (
              <Button
                component={NavLink}
                to={page.path}
                key={page.path}
                onClick={handleCloseNavMenu}
                sx={navStyles}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box
            sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, gap: 1 }}
          >
            {user ? (
              <SignedInMenu email={user.fullName} />
            ) : (
              settings.map((page) => (
                <Button
                  component={NavLink}
                  to={page.path}
                  key={page.path}
                  onClick={handleCloseNavMenu}
                  sx={navStyles}
                >
                  {page.title}
                </Button>
              ))
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
