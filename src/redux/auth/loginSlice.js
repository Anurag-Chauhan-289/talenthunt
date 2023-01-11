import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
    userJSON: null,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.userJSON = action.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const { loginUser } = loginSlice.actions

export default loginSlice.reducer