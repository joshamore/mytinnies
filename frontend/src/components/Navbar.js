import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AppsIcon from "@material-ui/icons/Apps";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export default function Navbar() {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						MyTinnies
					</Typography>
					<div>
						<IconButton
							aria-label="navigation bar"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AppsIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Smash Tinnies</MenuItem>
							<MenuItem onClick={handleClose}>Add Tinnies</MenuItem>
							<MenuItem onClick={handleClose}>Tinnies History</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}
