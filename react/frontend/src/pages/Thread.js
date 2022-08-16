import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PostCardItem from '../components/PostCardItem'
import ReplyForm from '../components/ReplyForm'
import InfiniteScroll from 'react-infinite-scroll-component';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Thread = () => {
    let params = useParams()
    let threadID = params.id
    //const navigate = useNavigate()

    // initalize thread and posts component state
    let [thread, setThread] = useState(null)
    let [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(2)

    // trigger update
    useEffect(() => {
        let getThread = async () => {
            let response = await fetch(`/api/threads/${threadID}`)
            let data = await response.json()
            setThread(data)
        }
        
        getThread()
    }, [threadID])

   
    useEffect(() => {
        let getPosts = async () => { 
            // fetch the posts from api endpoint
            let response = await fetch(`/api/threads/${threadID}/posts?page=1`)
            
            // parse the data in json
            let data = await response.json()

            // update the state of threads
            setPosts(data.results)

            // check if there is more posts
            if (data.next === null) {
              setHasMore(false)
            }
        }
        getPosts()
    }, [threadID])
    
    // fetch next posts
    const getMorePosts = async () => {
      // fetch the posts from api endpoint
      const response = await fetch(`/api/threads/${threadID}/posts?page=${page}`)
      // parse the data in json
      let data = await response.json()
     
      return data.results
    } 

    const fetchData = async () => {
        // get more posts from next fetch
        const morePosts = await getMorePosts()

        // update the thread state by combining data
        setPosts([...posts, ...morePosts])
        
        // check the fetch of last page, if yes, HasMore is false
        if (morePosts.length === 0 || morePosts.length < 10) {
            setHasMore(false)
        }
        setPage(page + 1)
    }


  return (
    <div>
      <Container>
        <Card sx={{ minWidth: 300, marginTop: 3 }}>
          <CardContent>
            <Typography sx={{ m: 1, p: 2 }} variant="h6" component="div">
              {thread?.subject}
            </Typography>
          
            <Typography style={{whiteSpace: 'pre-line'}} sx={{ m: 1, p: 1 }} variant="body1">
            {thread?.content}
            </Typography>

            <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
            {thread?.creator} posted on {thread?.created}
            </Typography>

          </CardContent>  
        </Card>
       
        <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center', marginTop: 40}} className="text-muted">
                You have seen all the posts.
                </p>
                
            }>

            <div style={{padding: 1}}>
              {posts.map((post, index) => (
                <PostCardItem key={index} post={post}/>
            ))}
            </div>     
          </InfiniteScroll>    

      </Container>

      <ReplyForm thread = {thread}/>    
    </div>
  )
}

export default Thread