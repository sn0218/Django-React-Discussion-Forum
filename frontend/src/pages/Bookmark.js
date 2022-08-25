import React, {useState, useEffect, useContext} from 'react'
import BookmarkThreadListItem from '../components/BookmarkThreadListItem'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import AuthContext from '../context/AuthContext'
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';


const Bookmark = () => {
  let {user} = useContext(AuthContext)
  // initalize thread and posts component state
  let [threads, setThreads] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)


  useEffect(() => {
    const getThreads = async () => {
        try {
             // fetch the threads from api endpoint
            const response = await fetch(`/api/bookmark/${user['user_id']}?page=${page}`)

            // parse the data in json
            let data = await response.json()
        
            // update the state of threads
            setThreads(data.results)

            // check if there is more posts
            if (data.next === null) {
                setHasMore(false)
            }
            setPage(page + 1)

        } catch (err) {
            console.log("Unauthenticated user accesses.")
        }
       
    }
    getThreads()

}, [])

// fetch next page threads
const getMoreThreads = async () => {
    // fetch the threads from api endpoint
    const response = await fetch(`/api/bookmark/${user['user_id']}?page=${page}`)
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
        {user?  <>
        <Container>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container >
    
        
        <Grid item xs={12} >
          <div className='d-flex justify-content-between mb-3'>
          <Typography variant="h5" >Bookmarked Threads</Typography>
          </div>
          <Item >    
            <InfiniteScroll
            dataLength={threads.length} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: 'center', marginTop: 20}}>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center', marginTop: 20}}>
                <span>You have seen all the bookmarked threads.</span>
                </p>
            }>
              {threads.map((thread, index) => (
                <BookmarkThreadListItem key={index} thread={thread}/>
              ))}
            </InfiniteScroll>
          </Item>
        </Grid>
        </Grid>
        </Box>
        </Container></>
        : <></>}
    </div>   
  )
}

export default Bookmark