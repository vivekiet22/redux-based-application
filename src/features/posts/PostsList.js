import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { fetchPosts, selectAllPost } from './postSlice'

import { Spinner } from '../../components/Spinner'

let PostExcerpt =({post})=>{
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
PostExcerpt = React.memo(PostExcerpt)


export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPost)
  
  const postStatus = useSelector((state)=>state.posts.status)
  const error = useSelector(state=>state.posts.error)


  useEffect(()=>{
    if (postStatus==="idle"){
      dispatch(fetchPosts())
    }
  },[postStatus,dispatch])


  let content

  if (postStatus==='loading'){
    content = <Spinner text='Loading ...'/>
  }
  else if (postStatus==='succeeded'){
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post=>(
      <PostExcerpt key={post.id} post={post} />
    ))
  }
  else if (postStatus==='failed'){
    content = <div>{error}</div>
  }





  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
