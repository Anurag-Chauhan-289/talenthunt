import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
    dashboardJSON: null,
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        dashboardObj: (state, action) => {
            state.dashboardJSON = action.payload
        },

    },
})

export const { dashboardObj } = dashboardSlice.actions

export default dashboardSlice.reducer