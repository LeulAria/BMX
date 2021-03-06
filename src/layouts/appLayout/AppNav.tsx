import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
	makeStyles,
	useTheme,
	Theme,
	createStyles,
} from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import {Box} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {RootState} from '../../app/store';
import dashboardRoutes from './routes';
import {INavRouter} from './routes';
import FB from '../../firebase/firebase';
import Icon from '@material-ui/core/Icon';
import Appbar from './Appbar';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		drawer: {
			[theme.breakpoints.up('sm')]: {
				width: drawerWidth,
				flexShrink: 0,
			},
		},
		appBar: {
			[theme.breakpoints.up('sm')]: {
				width: `calc(100% - ${drawerWidth}px)`,
				marginLeft: drawerWidth,
			},
		},
		menuButton: {
			marginRight: theme.spacing(2),
			[theme.breakpoints.up('sm')]: {
				display: 'none',
			},
		},
		// necessary for content to be below app bar
		toolbar: theme.mixins.toolbar,
		drawerPaper: {
			width: drawerWidth,
			marginTop: '65px',
		},
		content: {
			flexGrow: 1,
		},
		// list items
		listItems: {
			width: '90%',
			borderRadius: '4px',
			margin: '5px auto',
			transition: 'all .4s',
		},
	})
);

interface Props {
	window?: () => Window;
	children?: JSX.Element | JSX.Element[];
}

export default function AppNav(props: Props) {
	const classes = useStyles();
	const {window} = props;
	const dispatch = useDispatch();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const role = useSelector((state: RootState) => state.user.role);
	const [navs, setNavs] = useState<INavRouter[]>([]);
	const logged = useSelector((state: RootState) => state.user.logged);
	const [photo, setPhoto] = React.useState<any>('');
	const [name, setName] = React.useState<any>(null);
	const [email, setEmail] = React.useState<any>(null);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	React.useEffect(() => {
		FB.getInstance().auth.onAuthStateChanged((user): any => {
			if (user) {
				setPhoto(user.photoURL);
				setName(user.displayName);
				setEmail(user.email);
			} else {
			}
		});

		if (role === 'admin') {
			setNavs(dashboardRoutes['admin']);
		} else if (role === 'user') {
			setNavs(dashboardRoutes['user']);
		} else {
			setNavs(dashboardRoutes['guest']);
		}
	}, []);

	const drawer = (
		<div>
			<Divider />
			<List>
				{navs.map((nav: INavRouter, i: number) => (
					<ListItem
						button
						component={Link}
						to={nav.path}
						key={i}
						className={classes.listItems}>
						<ListItemIcon>
							<Icon style={{ fontSize: 20 }}>{nav.icon}</Icon>
						</ListItemIcon>
						<Box fontSize={14} fontWeight={500}>
							{nav.name}
						</Box>
					</ListItem>
				))}
			</List>
			{/* <Divider /> */}
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Appbar />
			<nav className={classes.drawer} aria-label="mailbox folders">
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true,
						}}>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>

			<main className={classes.content}>
				<div className={classes.toolbar}></div>
				{props.children}
			</main>
		</div>
	);
}
