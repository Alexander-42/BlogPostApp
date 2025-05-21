const SuccessMessage = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div>
            {message}
        </div>
    )
}

export default SuccessMessage