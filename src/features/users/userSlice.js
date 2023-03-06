import { createSlice } from "@reduxjs/toolkit";


const initialState =
    [
        { id: '0', name: 'Vivek Maddeshiya' },
        { id: '1', name: 'Anshul Gupta' },
        { id: '2', name: 'Pranjul Pal' },
        { id: '3', name: 'Gaurav Chaudhary' }
      ]

const userSlice = createSlice({
    name:"users",
    initialState,
    reducers:{

    }
})

export default userSlice.reducer