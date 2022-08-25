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
import PostAddIcon from '@mui/icons-material/PostAdd';
import Grid from '@mui/material/Grid';
import AuthContext from '../context/AuthContext'
import Select from "react-dropdown-select";
import { createTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';


const ThreadForm = () => {
  let {user} = useContext(AuthContext)

  const [alertShow, setAlertShow] = useState(false)
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState({
    subject: "",
    content: "",
    topic: "",
    creator: {user}
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // topic options
  const options = [
    { value: 1, label: "Entertainment" },
    { value: 2, label: 'Sports' },
    { value: 3, label: 'Gaming' },
    { value: 4, label: 'Music' },
    { value: 5, label: 'Technology' },
    { value: 6, label: 'News' },
    { value: 7, label: 'Anime' },
    { value: 8, label: 'Drama & Moive' },
  ]

  
  let handleThread = async (event) => {
    // check the authenticated user
    if (!user) {
      setAlertShow(true)
      event.preventDefault();
    }

    const response = await fetch(`/api/createThread/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(thread)
    })
    const data = await response.json()
    console.log(data)

  }

  // new thread button theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#6a5acd',
      }
    },
  });

  return (
    <div>
        
    <Grid container justifyContent="flex-end">
        <Button theme={theme}
          variant="outlined"  
          onClick={handleClickOpen} 
          endIcon={<PostAddIcon/>}
          style={{maxWidth: '180px', maxHeight: '32px', minWidth: '100px', minHeight: '32px'}}
        >
        New Thread
        </Button>
    </Grid>
  
    <Dialog fullWidth
      maxWidth="sm" open={open} onClose={handleClose}>
    <form onSubmit={handleThread} id="NewThreadForm">
      
      <Box>
        {alertShow && (<Alert severity="error" onClose={() => setAlertShow(false)}>
          Please login to add new thread. <Link href="/login">Click here to login.</Link>
          </Alert>)}
      </Box>
      
      <DialogTitle>New Thread</DialogTitle>
      <DialogContent>
      
        <DialogContentText>
          Choose the topic of your thread.
        </DialogContentText>

        <Select 
          required
          onChange={(option) => setThread({...thread, topic: option})}
          options={options}
          value={thread.topic} 
        />
      
        <TextField
          style={{
            marginTop: 20
        }}
          required
          autoFocus
          margin="dense"
          id="subject"
          name="subject"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={thread.subject}
          onChange={e => setThread({...thread, subject: e.target.value})}
        />

        <TextField
          required
          autoFocus
          margin="dense"
          id="content"
          name="content"
          placeholder="What's on your mind?"
          hiddenLabel
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={10}
          onChange={e => setThread({...thread, content: e.target.value.replace(/\\n/g, '\n').replace(/\\"/g, '"')})}
          value={thread.content.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
        />
     
      </DialogContent>
      
      <DialogActions>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" endIcon={<SendIcon />}  type="submit" >Send</Button>
        </Stack>
      </DialogActions>
      </form>
    </Dialog>
    
  </div>
  )
}

export default ThreadForm