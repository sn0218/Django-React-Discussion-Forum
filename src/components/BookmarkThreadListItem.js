import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import IconButton from '@mui/material/IconButton';
import AuthContext from '../context/AuthContext'


const BookmarkThreadListItem = ({thread}) => {
    let {user} = useContext(AuthContext)

    const [hide, setHide] = useState(false)
    
    // handle removebookmark button
    const handleBookmark = async() => {
        // hide the list
        setHide(true)

        // update bookmark
        const response = await fetch(`/api/pin/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user['user_id'], 
            thread: thread.id,
            pin: false
        })   
        })
        const data = await response.json()
        console.log(data)
    }

  return (
    <div className="thread-list-item">
      {!hide && (
      <List sx={{ width: '95%', bgcolor: 'background.paper' }}>
        
        
        <ListItem alignItems="flex-start" className="bookmark-list" secondaryAction={
                    <IconButton aria-label="bookmark" edge="end" onClick={handleBookmark}>
                    <BookmarkRemoveIcon/>
                  </IconButton>
                  }>
          <Link to = {`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText 
              primary={thread?.subject} 
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {thread?.creator}
                  </Typography>
                   <span> - updated <Moment fromNow>{thread?.updated}</Moment></span>
                </React.Fragment>
              }
            />
          </Link>   
          
      </ListItem>
  
     
     {!hide &&
     <><Divider component="li" sx={{marginLeft: '2%', marginRight: '2%'}}/></>  
     }  
      </List>
         )}
    </div>
   
    
  )
}

export default BookmarkThreadListItem