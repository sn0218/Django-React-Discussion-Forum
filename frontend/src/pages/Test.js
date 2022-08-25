import React, {useEffect, useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ThreadListItem from '../components/ThreadListItem'

const Test = () => {

    const [threads, setThreads] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const getThreads = async () => {
            // fetch the threads from api endpoint
            const response = await fetch(`/api/threads/?page=${page}`)
            // parse the data in json
            let data = await response.json()
            console.log('Data:', data)
            // update the state of threads
            setThreads(data.results)
        }
        getThreads()

    }, [])

    // fetch next page threads
    const getMoreThreads = async () => {
        // update page state
        setPage(page + 1)
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


  return (
    <InfiniteScroll
        dataLength={threads.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
            <p style={{ textAlign: 'center', marginTop: 20}}>
            <span>You have seen all the threads.</span>
            </p>
        }
        /*
        // below props only if you need pull down functionality
        refreshFunction={this.refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
        */
        >
        {threads.map((thread, index) => (
                <ThreadListItem key={index} thread={thread}/>
              ))}

    </InfiniteScroll>
  )
}

export default Test