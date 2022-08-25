import React, {useEffect, useState, useContext} from 'react'
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container'
import ProfileEditForm from '../components/ProfileEditForm'

const Profile = () => {

  let {user} = useContext(AuthContext)

  // extract profile id
  let params = useParams()
  let profileID = params.id
  
  // validate the user if he is the owner of the profile
  let isMyself = false

  if (user !== null && user['user_id'] === parseInt(profileID)) {
    isMyself = true
  }

  // initalize thread and posts component state
  const [profile, setProfile] = useState()

  useEffect(()=> {
    const getProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${profileID}`)

        // parse the data in json
        let data = await response.json()

        setProfile(data)
      } catch (err) {
        console.log("The requested profile does not exists.")
    }
        
    }
    getProfile()
  }, [profileID])
  

  return (
    <div style={{ marginTop: 100 }} >
      {profile &&
        <Container maxWidth="md">
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {profile?.name}'s Profile
          </Typography>

        <Card sx={{ boxShadow: 3 }}>

        {isMyself &&
        <ProfileEditForm profile={profile}/>
        }
        
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: 2, py: 2, bgcolor: 'background.default' }}>
            <Box maxWidth='sm' alignItems="center" justifyContent="center">
              <Avatar 
                aria-label="avatar" 
                src={profile?.avatar} 
                alt='avatar'
                sx={{ width: 150, height: 150, marginBottom: 4 }}>
              </Avatar>
            <Typography variant="h6" fontWeight={700} align="center" >{profile?.name}</Typography>
            <Typography variant="body1" align='center' component="div"  gutterBottom >
            <Chip sx={{ mt: 2, mb: 2 }}label={profile?.status}/>
            </Typography>
            </Box>
        </Stack>
        
       
        <Divider sx={{ borderBottomWidth: 2 }}/>
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: 2, py: 4, bgcolor: 'background.default' }}
        >
            <Box maxWidth='sm'>
            <Typography variant="body1" align='center' style={{whiteSpace: 'pre-line'}}  gutterBottom >
            {profile?.bio}
            </Typography>
            </Box>
           
        
        </Stack>
        </Card>
        </Container>
      } 
    </div>
  )
}

export default Profile