import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const initialState =[]

export const fetchUsers = createAsyncThunk('users/fetchUsers',async ()=>{
    const response = await client.get('fakeApi/users')
    return response.data
})

const userSlice = createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            return action.payload
        })
    }
})

export default userSlice.reducer