import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { logOutUser } from "../../features/account/accountSlice";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

interface Props {
  email: string;
}

export default function SignedInMenu({ email }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <Avatar
          src="/broken-image.jpg"
          //alt={user?.fullName.toUpperCase()}
          sx={{ width: 24, height: 24, mr: 1 }}
        />
        {user?.fullName.toUpperCase()}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate(`users/${user && user.id}`);
            handleClose();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/profile/edit");
            handleClose();
          }}
        >
          Edit Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logOutUser());
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
