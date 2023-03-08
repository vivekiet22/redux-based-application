import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotifications] = allNotifications
    const latestTimeStamp = latestNotifications ? latestNotifications.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimeStamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      // Sort with newest First
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})


export const { allNotificationsRead } = notificationsSlice.actions


export default notificationsSlice.reducer
export const selectAllNotifications = (state) => state.notifications
