import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const PostCardItem = ({post}) => {
    
  return (
    <div>
      <Card sx={{ minWidth: 300, marginTop: 3}} elevation={2}>
        <CardContent>
          <Typography  component="div"></Typography>
            <Typography style={{whiteSpace: 'pre-line' }} sx={{ m: 1, p: 1 }} variant="body1" >
            {post?.content}
            </Typography>

            <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
            {post?.creator} posted on {post?.created}
            </Typography>

          </CardContent>  
      </Card>
    </div>
    

  )
}

export default PostCardItem