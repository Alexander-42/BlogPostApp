import { useSelector } from "react-redux"

const SuccessMessage = () => {
  const successMessage = useSelector(state => state.successMessage)
  if (successMessage === null) {
    return
  }
  return (
    <div className="success">
      {successMessage}
    </div>
  )
}

export default SuccessMessage