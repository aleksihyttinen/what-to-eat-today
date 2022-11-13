import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Restaurant from "@mui/icons-material/Restaurant";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const pages = ["Lisää uusi ruoka", "Muokkaa ruokia"];
interface IProps {
  setNewModalOpen: Function;
  setEditModalOpen: Function;
}
function ResponsiveAppBar({ setNewModalOpen, setEditModalOpen }: IProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Restaurant
            sx={{
              fontSize: "2rem",
              display: { xs: "none", md: "flex" },
              mr: 2,
            }}
          />
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ruoka-appi
          </Typography>

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
              <MenuItem>
                <Typography
                  textAlign="center"
                  onClick={() => setNewModalOpen(true)}
                >
                  Lisää uusi ruoka
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography
                  textAlign="center"
                  onClick={() => setEditModalOpen(true)}
                >
                  Muokkaa ruokia
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Restaurant sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ruoka-appi
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              size="large"
              sx={{ my: 2, color: "white", display: "block" }}
              onClick={() => setNewModalOpen(true)}
            >
              {"Lisää uusi ruoka"}
            </Button>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              size="large"
              onClick={() => setEditModalOpen(true)}
            >
              {"Muokkaa ruokia"}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button
              sx={{
                my: 2,
                color: "white",
                display: "block",
              }}
              variant="text"
              size="large"
              onClick={() => {
                auth?.signout();
                navigate("/login", { replace: true });
              }}
            >
              Kirjaudu ulos
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
