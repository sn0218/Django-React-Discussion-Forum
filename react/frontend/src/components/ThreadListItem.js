import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';


const ThreadListItem = ({thread}, {index}) => {
  return (
    <div className="thread-list-item">
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start" key={{index}} className="thread-list">
          <Link to = {`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText 
              primary={thread?.subject} 
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
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
      <Divider component="li" sx={{marginLeft: '2%', marginRight: '2%'}}/>
      </List>
    </div>
   
    
  )
}

export default ThreadListItem