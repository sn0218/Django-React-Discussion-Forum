import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import ThreadListItem from '../components/ThreadListItem'
import ThreadForm from '../components/ThreadForm'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';


const Topic = () => {
  // extract thread id
  const params = useParams();
  const topicID = params.id

  const topics = [
    "Entertainment" ,
    'Sports' ,
    'Gaming' ,
    'Music' ,
    'Technology' ,
    'News',
    'Anime' ,
    'Drama & Moive' 
  ]
    
    
  // initalize thread and posts component state
  const [threads, setThreads] = useState([])
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)

  // trigger update depends on params of URL
  useEffect(() => {
    const getThreads = async () => {
    // fetch the threads from api endpoint
    const response = await fetch(`/api/threads/topic/${topicID}?page=1`)

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

}, [params])


// fetch next page threads
const getMoreThreads = async () => {
  try {
    // fetch the threads from api endpoint
    const response = await fetch(`/api/threads/topic/${topicID}?page=${page}`)
    
    // parse the data in json
    let data = await response.json()
    console.log("fetching")
    console.log(data)
  
  return data.results
  } catch (err) {
    console.log("No next page.")
  }
  
    
}

const fetchData = async () => {
    // get more threads from next fetch
    const moreThreads = await getMoreThreads()
  
    // update the thread state by combining data
    setThreads([...threads, ...moreThreads])

    // check the fetch of last page, if yes, HasMore is false
    if (moreThreads.length === 0 || moreThreads.length < 10) {
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
        <Grid container >
    
        
        <Grid item xs={12} >
          <div className='d-flex justify-content-between mb-3'>
          <Typography variant="h5" > {topics[topicID-1]} Threads</Typography>
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
        </Grid>
        </Box>
        </Container>
       
    </div>   
  )
}

export default Topic