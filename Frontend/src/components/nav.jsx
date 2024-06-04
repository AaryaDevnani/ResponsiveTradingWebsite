import React, { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AppBar,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Box,
  Collapse,
} from "@mui/material";
import StockContext from "../stockContext";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles/nav.css";

function NavBar() {
  const { clearContext, interval } = useContext(StockContext);
  // Styling Constants
  const navButtonStyle = {
    fontSize: "15px",
    color: "#bdbdbd",
    textTransform: "none",
    "&:hover": {
      color: "#ffffff",
    },
  };

  const navActiveStyle = {
    border: "1px solid #bdbdbd",
    borderRadius: "12px",
    color: "#bdbdbd",
    textTransform: "none",
    "&:hover": {
      border: "1px solid #ffffff",
      color: "#ffffff",
      borderRadius: "12px",
    },
  };

  const mobileNavMenu = {
    color: "#bdbdbd",
    fontSize: "10px",
    textTransform: "none",
    justifyContent: "flex-start",
  };

  const mobileNavMenuActive = {
    fontSize: "15px",
    border: "1px solid #bdbdbd",
    color: "#bdbdbd",
    textTransform: "none",
    borderRadius: "15px",
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const location = useLocation().pathname;

  // Mobile Drawer
  const drawer = (
    <Box
      sx={{
        textAlign: "left",
        backgroundColor: "#2226A3",
        width: "80vw",
        paddingLeft: "30px",
      }}
    >
      <List>
        <ListItem
          key="Search"
          sx={
            location.startsWith("/search") ? mobileNavMenuActive : mobileNavMenu
          }
        >
          <NavLink className="mobileList" to={"/"} onClick={handleDrawerToggle}>
            <ListItemText
              primary="Search"
              sx={mobileNavMenu}
              disableTypography
            />
          </NavLink>
        </ListItem>
        <ListItem
          key="Watchlist"
          sx={location === "/watchlist" ? mobileNavMenuActive : mobileNavMenu}
        >
          <NavLink
            className="mobileList"
            to={"/watchlist"}
            onClick={handleDrawerToggle}
          >
            <ListItemText
              primary="Watchlist"
              sx={mobileNavMenu}
              disableTypography
            />
          </NavLink>
        </ListItem>
        <ListItem
          key="Portfolio"
          sx={location === "/portfolio" ? mobileNavMenuActive : mobileNavMenu}
        >
          <NavLink
            className="mobileList"
            to={"/portfolio"}
            onClick={handleDrawerToggle}
          >
            <ListItemText
              primary="Portfolio"
              sx={mobileNavMenu}
              disableTypography
            />
          </NavLink>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        className="toolbar"
        sx={{ backgroundColor: "#2226A3", color: "#fff" }}
        position="static"
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <NavLink
            to={"/"}
            style={{ textDecoration: "none", color: "white" }}
            onClick={() => {
              clearContext();
              clearInterval(interval);
            }}
          >
            <Typography
              component="div"
              sx={{
                ml: { lg: "50px", md: "50px" },
                fontSize: "20px",
                paddingLeft: "20px",
              }}
            >
              Stock Search
            </Typography>
          </NavLink>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              flexDirection: "row",
              justifyContent: "flex-end",
              mr: "35px",
            }}
          >
            <>
              <NavLink to={"/"} style={{ textDecoration: "none" }}>
                <Button
                  key="Search"
                  disableRipple
                  sx={
                    location.toLowerCase().startsWith("/search")
                      ? navActiveStyle
                      : navButtonStyle
                  }
                >
                  Search
                </Button>
              </NavLink>
              <NavLink to={"/watchlist"} style={{ textDecoration: "none" }}>
                <Button
                  key="Watchlist"
                  disableRipple
                  sx={
                    location.toLowerCase() === "/watchlist"
                      ? navActiveStyle
                      : navButtonStyle
                  }
                >
                  Watchlist
                </Button>
              </NavLink>
              <NavLink to={"/portfolio"} style={{ textDecoration: "none" }}>
                <Button
                  key="Portfolio"
                  disableRipple
                  sx={
                    location.toLowerCase() === "/portfolio"
                      ? navActiveStyle
                      : navButtonStyle
                  }
                >
                  Portfolio
                </Button>
              </NavLink>
            </>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              ml: 2,
              display: { sm: "none" },
              alignContent: "flex-end",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <nav>
          <Collapse
            sx={{ display: { lg: "none", md: "none", sm: "none" } }}
            in={mobileOpen}
            unmountOnExit
          >
            {drawer}
          </Collapse>
        </nav>
      </AppBar>
    </Box>
  );
}

export default NavBar;
