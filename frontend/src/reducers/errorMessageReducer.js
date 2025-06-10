import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const errorMessageSlice = createSlice({
    name: 'errorMessage',
    initialState,
    reducers: {
        newErrorMessage(state, action) {
            return action.payload
        },
        resetErrorMessage(state, action) {
            return null
        }
    }
})

export const { newErrorMessage, resetErrorMessage} = errorMessageSlice.actions

export const setErrorMessage = (message, duration) => {
    return dispatch => {
        dispatch(newErrorMessage(message))
        setTimeout(() => {
            dispatch(resetErrorMessage())
        }, duration*1000)
    }
}

export default errorMessageSlice.reducer