import { createAsyncThunk,createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import { client } from '../../api/client'

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost =>{
    // We send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts',initialPost)
    // The response includes the complete post object, including unique ID
        return response.data
    }
)

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        }
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find((post) => id === post.id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },  
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled,(state,action)=>{
        // We can directly add the new post object to our posts array
        state.posts.push(action.payload)
      })
  },
})


export const { postAdded, postUpdated, reactionAdded } = postSlice.actions
export default postSlice.reducer

export const selectAllPost = (state) => state.posts.posts
export const selectPostById = (state, postId) =>state.posts.posts.find((post) => post.id === postId)

export const selectPostByUser = createSelector([selectAllPost,(state,userId)=>userId],(posts,userId)=>posts.filter(post=>post.user===userId))
