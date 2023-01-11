import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './auth/loginSlice'
import dashboardReducer from './dashboard/dashboardSlice'


export const store = configureStore({
    reducer: {
        loginData: loginReducer,
        dashboardData: dashboardReducer
    },
})