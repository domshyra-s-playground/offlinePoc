import { AppBar, Grid, IconButton, Link } from "@mui/material";
import React, { useState } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import { NavLink } from "react-router-dom";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { recommendationsLabel } from "../constants/labels";
import { recommendationsRoot } from "../constants/routes";

const StyledAppBar = () => {
	//for hamgurger menu
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	let menuItems = [
		{
			label: "Playlists",
			path: "",
			icon: <MusicVideoIcon />,
		},
		{
			label: recommendationsLabel,
			path: "recommendations",
			icon: <PlaylistAddIcon />,
		},
	];

	const hamburgerMenus = (items) => {
		return items.map((item) => (
			<Link underline="none" component={NavLink} to={item.path} key={item.path}>
				<MenuItem onClick={handleClose} aria-label={`Show ${item.label}`} title={`Show ${item.label}`}>
					<Grid container direction="row" alignContent="center" alignItems="center">
						<IconButton color="primary">{item.icon}</IconButton>
						<Typography>{item.label}</Typography>
					</Grid>
				</MenuItem>
			</Link>
		));
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						{hamburgerMenus(menuItems)}
					</Menu>

					<Link underline="none" to="/" component={NavLink} color="white">
						<Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
							Playlists
						</Typography>
					</Link>
					<Link underline="none" to={`${recommendationsRoot}/`} component={NavLink} color="white" px={2}>
						<Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
							Recommendations
						</Typography>
					</Link>
					<Box sx={{ flexGrow: 1 }} />
					{/*{Larger screens}*/}
					<Box sx={{ display: { xs: "none", md: "flex" } }}></Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default StyledAppBar;
