import React, {useState, useEffect, useContext} from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import AuthContext from '../context/AuthContext'
import { createTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';


const ProfileEditForm = ({profile}) => {
  let {user} = useContext(AuthContext)
  const userID = user['user_id']

  const [open, setOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    avatar: profile.avatar,
    bio: profile.bio
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let handleProfile = async (event) => {
    const response = await fetch(`/api/profile/${userID}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newProfile)
    })
    const data = await response.json()
    console.log(data)
   
  }


  return (
    <div>
        <Grid container justifyContent="flex-end">
            <IconButton aria-label="edit" size="large" onClick={handleClickOpen}>
            <EditIcon sx = {{ mt: 2, mr: 2 }} />
            </IconButton>
        </Grid>
          
        <Dialog fullWidth
        maxWidth="sm" open={open} onClose={handleClose}>
        <form onSubmit={handleProfile} id="profile-edit-form">
        
        <DialogTitle>Edit profile </DialogTitle>
        <DialogContent>
        
            <DialogContentText sx={{ mb: 2 }}>
            You're free to edit your biography and avatar.
            </DialogContentText>
            
            <TextField
            required
            autoFocus
            margin="dense"
            id="avatar"
            name="Avatar URL"
            label="Avatar URL"
            type="url"
            fullWidth
            variant="standard"
            defaultValue={profile?.avatar}
            onChange={e => setNewProfile({
                ...newProfile, 
                avatar: e.target.value, 
               })}
            />

            <TextField
             required
            autoFocus
            margin="dense"
            id="Biography"
            label="Biography"
            type="email"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            defaultValue={profile?.bio}
            onChange={e => setNewProfile({
                ...newProfile, 
                bio: e.target.value, 
               })}
          />
          
        
        </DialogContent>
        
        <DialogActions>
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit" >Save</Button>
            </Stack>
        </DialogActions>
        </form>
        </Dialog>
        
    </div>
    
  )
}

export default ProfileEditForm