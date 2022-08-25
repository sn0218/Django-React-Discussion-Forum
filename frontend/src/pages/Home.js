import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import ThreadListItem from '../components/ThreadListItem'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ThreadForm from '../components/ThreadForm'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';

import MessageIcon from '@mui/icons-material/Message';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import BookmarksIcon from '@mui/icons-material/Bookmarks';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const ThreadListPage = () => {
  // initalize component state
  const [threads, setThreads] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)
  const [topThreads, setTopThreads] = useState([])

  const topics = {
    1: "Entertainment" ,
    2: 'Sports' ,
    3: 'Gaming' ,
    4: 'Music' ,
    5: 'Technology' ,
    6: 'News',
    7: 'Anime' ,
    8: 'Drama & Moive' 
  }

  useEffect(() => {
    const getTopThreads = async () => {
      // fetch top threads
      const response = await fetch(`api/topThreads`)
      const data = await response.json()
      setTopThreads(data)
    }
    getTopThreads()

    
  }, [])
  

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
      
      console.log("fetching")

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

  
  return (
    <div style={{ marginTop: 100 }}>
      
      <Container>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} >
        <Grid item md = {2}
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
                {Object.keys(topics).map((key, index) => (
                <div key={index}>
                <Link style={{textDecoration:"none", color:'black', textTransform: 'capitalize'}} 
                  to={`/topic/${key}`}>
                   
                <ListItem key={index}>
                  <ListItemButton>
                    <ListItemText primary={<Typography >{topics[key]}</Typography>}/>
                  </ListItemButton>
                </ListItem>
                </Link>
                </div>
                  
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
            loader={<h4 style={{ textAlign: 'center', marginTop: 20}}>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center', marginTop: 20}}>
                <span>You have seen all the threads.</span>
                </p>
            }>
              {threads.map((thread, index) => (
                <ThreadListItem key={index} thread={thread}/>
              ))}
            </InfiniteScroll>
          </Item>
        </Grid>

        <Grid item md = {4}
          sx={{
          display: { xs: "none", md: "block" }
        }}>
          <div className='d-flex mb-3'> 
            <Typography variant="h5" ><BookmarksIcon sx={{marginRight: 2}}/>Top Threads </Typography>
          </div>
          {topThreads.map((thread, index) => 
           
            <Box sx={{ minWidth: 275,  marginTop: 2 }} key={index} >
            <Link to = {`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <Card className='hotTopics' variant="outlined" key={index}>
            <React.Fragment>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {thread?.subject}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {thread?.creator}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <MessageIcon sx={{ marginRight: 1 }}/>{thread?.replyCount}
                  </Typography>
                </CardContent>
       
              </React.Fragment>
            </Card>
            </Link>
          </Box>
       
          
          )}
          
        </Grid>

      </Grid>
      </Box>
      </Container>

        
    </div>
    
  )
}

export default ThreadListPage