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
import AddCommentIcon from '@mui/icons-material/AddComment';
import Fab from '@mui/material/Fab';
import Container from '@mui/material/Container';


const ReplyForm = ({thread}) => {
  let {user} = useContext(AuthContext)
  const threadID = thread?.id
  console.log(threadID)

  const [alertShow, setAlertShow] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [post, setPost] = useState({
    content: "",
    thread: "",
    creator: {user}
  })


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let handlePost = async (event) => {
    // check the authenticated user
    if (!user) {
      setAlertShow(true)
      event.preventDefault();
    }
 
    const response = await fetch(`/api/createPost/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(post)
    })
    const data = await response.json()
    console.log(data)
   
  }

   // add reply button style and theme
   const fabStyle = {
    margin: 0,
    top: 'auto',
    bottom: 110,
    position: 'fixed'
  };

    const fab = 
    {
        sx: fabStyle,
        icon: <AddCommentIcon />,
        label: 'Add',
    };

    const theme = createTheme({
    palette: {
        primary: {
        main: '#6a5acd',
        }
    },
    });

  return (
    <div>
        <Container maxWidth="lg">
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', mr: 2 }}>
            <Fab theme={theme} sx={fab.sx} aria-label={fab.label}  color="primary" onClick={handleClickOpen}>
            {fab.icon}
            </Fab>
        </Box>
            
        </Container>

        <Dialog fullWidth
        maxWidth="sm" open={open} onClose={handleClose}>
        <form onSubmit={handlePost} id="NewReplyForm">

        <Box>
            {alertShow && (<Alert severity="error" onClose={() => setAlertShow(false)}>
            Please login to reply this thread. <Link href="/login">Click here to login.</Link>
            </Alert>)}
        </Box>
        
        <DialogTitle>New Reply to <strong>{thread?.subject} </strong></DialogTitle>
        <DialogContent>
        
            <DialogContentText>
            Reply form
            </DialogContentText>

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
            onChange={e => setPost({
                ...post, 
                content: e.target.value.replace(/\\n/g, '\n').replace(/\\"/g, '"'), 
                thread: threadID
               })}
            value={post.content.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
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

export default ReplyForm