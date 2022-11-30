import {useState} from "react"
import {useCookies} from "react-cookie"

const Modal = ({mode, setShowModal, task, getData}) => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const editMode = mode === "edit"

    const [data, setData] = useState({
        user_email: cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : null
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setData((data) => ({
            ...data,
            [name]: value,
            date: new Date(),
        }))
    }

    console.log(data)
    const postData = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.SERVERURL}/todos`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                setShowModal(null)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editData = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.SERVERURL}/todos/${task.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's {mode} your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>
                <form>
                    <input
                        required
                        maxLength={30}
                        placeholder="Your task goes here"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                    />
                    <label for="range">Drag to select your current progress</label>
                    <input
                        required
                        id="range"
                        type="range"
                        min="0"
                        max="100"
                        name="progress"
                        value={data.progress}
                        onChange={handleChange}
                    />
                    <input
                        className={mode}
                        type="submit"
                        onClick={editMode ? editData : postData}
                    />
                </form>

            </div>
        </div>
    )
}
export default Modal