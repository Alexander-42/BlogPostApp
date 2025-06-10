import { configureStore } from '@reduxjs/toolkit'

import successMessageReducer from './reducers/successMessageReducer'
import errorMessageReducer from './reducers/errorMessageReducer'

const store = configureStore({
    reducer: {
        successMessage: successMessageReducer,
        errorMessage: errorMessageReducer
    }
})

export default store