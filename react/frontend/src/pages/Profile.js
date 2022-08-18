import React, {useEffect, useState, useContext} from 'react'
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container'
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';


const Profile = () => {

  let {user} = useContext(AuthContext)
  const userID = user['user_id']

  // initalize thread and posts component state
  const [profile, setProfile] = useState()

  useEffect(()=> {
    const getProfile = async () => {
        const response = await fetch(`/api/profile/${userID}`)

        // parse the data in json
        let data = await response.json()

        setProfile(data)
    }
    getProfile()
  }, [userID])
  

  return (
    <div style={{ marginTop: 100 }} >
        <Container maxWidth="md">
        <Card>
        <Grid container justifyContent="flex-end">
        <IconButton aria-label="edit">
                <EditIcon sx = {{ m: 2 }}/>
              </IconButton>
        </Grid>
      
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: 2, py: 1, bgcolor: 'background.default' }}>
            <Box maxWidth='sm' 
                alignItems="center"
                justifyContent="center">
                    <Avatar 
                aria-label="avatar" 
                src={profile?.avatar} 
                alt='avatar'
                sx={{ width: 100, height: 100, marginBottom: 4 }}>
          </Avatar>
            <Typography variant="h6" fontWeight={700} align="center" >{user.username}</Typography>
            <Typography variant="body1" align='center'  gutterBottom >
            <Chip label={profile?.status}/>
            </Typography>
            </Box>
        </Stack>
        
       
        <Divider />
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: 2, py: 4, bgcolor: 'background.default' }}
        >
            <Box maxWidth='sm'>
            <Typography variant="body1" align='center'  gutterBottom >
            {profile?.bio}
            </Typography>
            </Box>
           
        
        </Stack>
        </Card>
        </Container>
        
    </div>
  )
}

export default Profile