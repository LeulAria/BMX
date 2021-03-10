import {useNode, UserComponent} from '@craftjs/core';
import {Button, makeStyles, Container as MuiContainer} from '@material-ui/core';
import React, {useEffect, useRef, useState} from 'react';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import {Container} from 'components/selectors/Container';
import {ImageSettings} from './imageSettings';
import Firebase from '../../../firebase/firebase';
import {CloudUpload} from '@material-ui/icons';

const useStyles = makeStyles({
	root: {
		'& > *': {
			margin: 0,
		},
	},
	input: {
		display: 'none',
	},

	bestFit: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: '100%',
	},
	small: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: '100%',
		width: '360px',
		minWidth: '360px',
	},

	fullWidth: {
		maxWidth: '940px',
		width: `calc(100vw - 40px)`,
	},

	fill: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		position: 'relative',
		margin: 0,
		padding: 0,
	},
	img: {
		minWidth: '10%',
		maxWidth: '100%',
		display: 'block',
		position: 'relative',
		overflow: 'hidden',
	},
});

type ImageProp = {
	bestFit?: boolean;
	small?: boolean;
	fullWidth?: boolean;
	imageUrl?: string;
	id: number;
};

export const Image: UserComponent<ImageProp> = ({
	bestFit,
	small,
	fullWidth,
	imageUrl,
	id,
}) => {
	const {
		connectors: {connect, drag},
	} = useNode();
	const classes = useStyles();
	const [{alt, src, file}, setImg] = useState<any>({
		src: imageUrl || 'null',
		alt: '',
		file: null,
	});

	const [isUploaded, setIsUploaded] = useState(false);

	const handleChange = (e: any) => {
		if (e.target.files[0]) {
			setImg({
				src: URL.createObjectURL(e.target.files[0]),
				alt: e.target.files[0].name,
				file: e.target.files[0],
			});
		}
	};

	const handleUpload = async () => {
		const storageRef = Firebase.getInstance().storage.ref();
		const fileRef = storageRef.child('images/' + Date.now() + file.name);
		await fileRef.put(file);
		const url = await fileRef.getDownloadURL();
		setImg((prevProp: any) => ({
			...prevProp,
			src: url,
		}));
		setIsUploaded(true);
	};
	return (
		<div ref={(ref) => connect(drag(ref))}>
			<Container className={classes.fill + ' rounded z-depth-2'}>
				<div
					className={
						small
							? classes.small
							: bestFit
							? classes.bestFit
							: fullWidth
							? classes.fullWidth
							: undefined
					}>
					<img
						src={src === 'null' ? undefined : src}
						alt={alt}
						className={classes.img}
					/>
				</div>
			</Container>

			{!isUploaded && (
				<>
					<input
						accept="image/*"
						className={classes.input}
						id={' ' + id}
						type="file"
						onChange={handleChange}
					/>
					<label htmlFor={' ' + id}>
						<Button
							variant="text"
							size="medium"
							aria-label="upload picture"
							component="span"
							startIcon={<InsertPhotoIcon />}>
							{src === 'null' ? ' Add Image' : 'Change Image'}
						</Button>
					</label>
					{file && (
						<Button onClick={handleUpload} startIcon={<CloudUpload />}>
							Upload
						</Button>
					)}
				</>
			)}
		</div>
	);
};

Image.craft = {
	displayName: 'ImageUploadDragable',
	props: {
		small: false,
		bestFit: false,
		fullWidth: false,
		imageUrl: undefined,
	},
	related: {
		settings: ImageSettings,
	},
};

export const CoverImage: React.FC<{
	handleChange: (key: string, value: string) => void;
	imageUrl: string | undefined;
}> = ({handleChange, imageUrl}) => {
	const classes = useStyles();
	const [{alt, src, file}, setImg] = useState<any>({
		src: imageUrl || 'null',
		alt: '',
		file: null,
	});

	const [isUploaded, setIsUploaded] = useState(false);

	const handleUpload = async () => {
		const storageRef = Firebase.getInstance().storage.ref();
		const fileRef = storageRef.child('images/' + Date.now() + file.name);
		await fileRef.put(file);
		const url = await fileRef.getDownloadURL();
		setImg((prevProp: any) => ({
			...prevProp,
			src: url,
		}));

		handleChange('coverImageUrl', url);
		setIsUploaded(true);
	};

	const handleFileChange = (e: any) => {
		if (e.target.files[0]) {
			setImg({
				src: URL.createObjectURL(e.target.files[0]),
				alt: e.target.files[0].name,
				file: e.target.files[0],
			});
		}
	};

	return (
		<div className={classes.root}>
			<MuiContainer className={classes.fill + ' rounded z-depth-2'}>
				<img
					src={src}
					alt={alt}
					className={classes.img}
					style={{maxWidth: '100%', height: 'auto', width: 'auto'}}
				/>
			</MuiContainer>
			{!isUploaded ||
				(file && (
					<>
						<input
							accept="image/*"
							className={classes.input + ' z-depth-2'}
							id="icon-button-file"
							type="file"
							onChange={handleFileChange}
						/>
						<label htmlFor="icon-button-file">
							<Button
								variant="outlined"
								size="medium"
								aria-label="upload picture"
								component="span"
								startIcon={<InsertPhotoIcon />}>
								Add Cover Image
							</Button>
						</label>
						{file && (
							<Button onClick={handleUpload} startIcon={<CloudUpload />}>
								Upload
							</Button>
						)}
					</>
				))}
		</div>
	);
};
