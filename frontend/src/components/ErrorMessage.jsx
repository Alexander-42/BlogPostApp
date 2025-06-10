import { useSelector } from "react-redux"

const ErrorMessage = () => {
  const errorMessage = useSelector(state => state.errorMessage)
  if (errorMessage === null) {
    return null
  }

  return (
    <div className="error">
      {errorMessage}
    </div>
  )
}

export default ErrorMessage