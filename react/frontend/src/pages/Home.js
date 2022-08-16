import React, {useState, useEffect, useContext} from 'react'
import ThreadListItem from '../components/ThreadListItem'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ThreadForm from '../components/ThreadForm'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import AuthContext from '../context/AuthContext'
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';

import TopicIcon from '@mui/icons-material/Topic';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';



const ThreadListPage = () => {
  // initalize component state
  const [threads, setThreads] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)

  useEffect(() => {
      const getThreads = async () => {
          // fetch the threads from api endpoint
          const response = await fetch(`/api/threads/?page=1`)

          // parse the data in json
          let data = await response.json()
        
          // update the state of threads
          setThreads(data.results)

           // check if there is more threads
           if (data.next === null) {
            setHasMore(false)
          }
      }
      getThreads()

  }, [])

  // fetch next page threads
  const getMoreThreads = async () => {
      // fetch the threads from api endpoint
      const response = await fetch(`/api/threads/?page=${page}`)
      // parse the data in json
      let data = await response.json()
      
      
      return data.results
  }

  const fetchData = async () => {
      // get more threads from next fetch
      const moreThreads = await getMoreThreads()

      // update the thread state by combining data
      setThreads([...threads, ...moreThreads])
      
      // check the fetch of last page, if yes, HasMore is false
      if (moreThreads.length === 0 || moreThreads.length < 15) {
          setHasMore(false)
      }
      setPage(page + 1)
  }


  // style the paper component
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));
  
  let {user} = useContext(AuthContext)

  const topics = [
    "Entertainment", 
    'Sports',
    'Gaming',
    'Music',
    'Technology',
    'News',
    'Anime',
    'Drama & Moive'
  ]
  
  
  return (
    <div style={{ marginTop: 25 }}>
      
      <Container>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} >
        <Grid item xs 
          sx={{
          display: { xs: "none", md: "block" }
        }}>
          <div className='d-flex mb-3'> 
            <Typography variant="h5" >Topics </Typography>
          </div>
      

          <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="topics"
              >
                {topics.map((topic) => (
                <ListItem key={topic}>
                  <ListItemButton>
                    <ListItemIcon>
                    <TopicIcon />
                    </ListItemIcon>
                    <ListItemText primary={topic}/>
                  </ListItemButton>
                </ListItem>
             
                 ))}
              </List>
          
        </Grid>

        <Grid item xs={12} md={6} >
          <div className='d-flex justify-content-between mb-3'>
          <Typography variant="h5" >Latest Thread</Typography>
          <ThreadForm />
          </div>
          <Item >    
            <InfiniteScroll
            dataLength={threads.length} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center', marginTop: 20}}>
                {/* <span>You have seen all the threads.</span>*/}
                </p>
            }>
              {threads.map((thread, index) => (
                <ThreadListItem key={index} thread={thread}/>
              ))}
            </InfiniteScroll>
          </Item>
        </Grid>

        <Grid item xs 
          sx={{
          display: { xs: "none", md: "block" }
        }}>
          <div className='d-flex mb-3'> 
            <Typography variant="h5" >Pinned </Typography>
          </div>
          <Item><BookmarkIcon sx={{margin: 2}}/>Pinned one</Item>
        </Grid>

      </Grid>
      </Box>
      </Container>

        
    </div>
    
  )
}

export default ThreadListPage