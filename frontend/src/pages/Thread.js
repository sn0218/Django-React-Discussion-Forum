import React, {useEffect, useState, useContext} from 'react'
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PostCardItem from '../components/PostCardItem'
import ReplyForm from '../components/ReplyForm'
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@mui/material/Grid';
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';



const Thread = () => {
  let {user} = useContext(AuthContext)

  // extract thread id
  let params = useParams()
  let threadID = params.id

  // initalize thread and posts component state
  let [thread, setThread] = useState(null)
  let [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [pin, setPin] = useState(false)

  
  // update bookmark icon for the thread
  useEffect( ()=> {
    let getBookmark = async () => {
      if (user !== null) {
        let response = await fetch(`/api/pin/${threadID}&&${user['user_id']}`)
        let data = await response.json()
        setPin(JSON.parse(data.pinned))
      }
    }
    getBookmark()

  },[threadID]) 


  // trigger thread update
  useEffect(() => {
      let getThread = async () => {
          let response = await fetch(`/api/threads/${threadID}`)
          let data = await response.json()
          setThread(data)
         
      }
      
      getThread()
  }, [threadID])
  
  // trigger posts update
  useEffect(() => {
      let getPosts = async () => { 
          // fetch the posts from api endpoint
          let response = await fetch(`/api/threads/${threadID}/posts?page=${page}`)
          
          // parse the data in json
          let data = await response.json()

          // update the state of threads
          setPosts(data.results)

          // check if there is more posts
          if (data.next === null) {
            setHasMore(false)
          }
          setPage(page + 1)
      }
      getPosts()
  }, [threadID])


  // fetch next posts
  const getMorePosts = async () => {
    try{
      // fetch the posts from api endpoint
    const response = await fetch(`/api/threads/${threadID}/posts?page=${page}`)

    // parse the data in json
    let data = await response.json()
    console.log("fetching")

    return data.results

    } catch (err) {
      console.log("No next page.")
    }
    
  } 

  const fetchData = async () => {
      // get more posts from next fetch
      let morePosts = await getMorePosts()

      // update the thread state by combining data
      setPosts([...posts, ...morePosts])
   
      // check the fetch of last page, if yes, HasMore is false
      if (morePosts.length === 0 || morePosts.length < 10) {
          setHasMore(false)
      }
      setPage(page + 1)  
  }

 
  // handle bookmark button
  const handleBookmark = async() => {
    // update bookmark
    setPin(!pin)

    const response = await fetch(`/api/pin/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user: user['user_id'], 
          thread: threadID,
          pin: pin? false: true
      })   
    })
    const data = await response.json()
    console.log(data)
  }
 
  return (
    <div style={{ marginTop: 100 }}>
      <Container>
        <Card sx={{ minWidth: 300, marginTop: 3 }} elevation={3}>
       
          <CardContent>
            <Grid container justifyContent="space-between">
              <Typography sx={{ m: 1, p: 1 }} variant="h6" component="div">
                {thread?.subject} 
                
              </Typography>
              
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Grid>
       
            <Typography style={{whiteSpace: 'pre-line'}} sx={{ m: 1, p: 1 }} variant="body1">
            {thread?.content}
            </Typography>

            <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
            <Link to={`/profile/${thread?.creator_id}`} style={{  color: "grey"}}>
              {thread?.creator}
              </Link> posted on {thread?.created}
            </Typography>

          </CardContent>  

          
          <CardActions sx={{ marginBottom: 2, marginRight: 3}}>
          <Grid container justifyContent="flex-end">
            {user? <>
              {pin && 
                (<IconButton aria-label="bookmark"  sx={{  marginRight: 2 }}  color="secondary" onClick={handleBookmark}>
                <BookmarkAddedRoundedIcon /> 
              </IconButton >)}
            {!pin && 
              (<IconButton aria-label="bookmark"  sx={{  marginRight: 2 }} onClick={handleBookmark}>
              <BookmarkAddIcon/>
            </IconButton>)}
            </> : <div></div>}      

             <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            </Grid>
          </CardActions>
          
          
        </Card>
       
        <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: 'center', marginTop: 20}}>Loading...</h4>}
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

export default Thread;