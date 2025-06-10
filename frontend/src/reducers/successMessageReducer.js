import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const successMessageSlice = createSlice({
    name: 'successMessage',
    initialState,
    reducers: {
        newSuccessMessage(state, action) {
            return action.payload
        },
        resetSuccessMessage(state, action) {
            return null
        }
    }
})

export const { newSuccessMessage, resetSuccessMessage} = successMessageSlice.actions

export const setSuccessMessage = (message, duration) => {
    return dispatch => {
        dispatch(newSuccessMessage(message))
        setTimeout(() => {
            dispatch(resetSuccessMessage())
        }, duration*1000)
    }
}

export default successMessageSlice.reducer