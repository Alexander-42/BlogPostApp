import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'


const LoginForm = ({
  setUser,
  setErrorMessage,
  setSuccessMessage
  }) => {
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
      setSuccessMessage('Login successful!')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch (exception) {
      setErrorMessage('Incorrect username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

    return(
      <div>
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
          <button type="submit">Login</button>
        </form>
      </div>
  )
}

export default LoginForm