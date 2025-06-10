import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useDispatch } from 'react-redux'
import { setSuccessMessage } from '../reducers/successMessageReducer'

const LoginForm = ({
  setUser,
  setErrorMessage
}) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      dispatch(setSuccessMessage('Login successful!', 5))
    } catch (exception) {
      setErrorMessage('Incorrect username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return(
    <div data-testid="LoginFormID">
      <h2>
          Login
      </h2>
      <form onSubmit={handleLogin}>
        <div>
            username
          <input
            type = "text"
            value = {username}
            name = "Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
            password
          <input
            type = "text"
            value = {password}
            name = "Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid="login-submit" type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm