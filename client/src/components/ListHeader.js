import {useState} from "react"
import Modal from "./Modal"
import {useCookies} from "react-cookie"

const ListHeader = ({listName, getData}) => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [showModal, setShowModal] = useState(null)

    const signOut = () => {
        removeCookies("AuthToken")
        removeCookies("Email")
        window.location.reload()
    }

    return (
        <div className="list-header">
            <h1>{listName}</h1>
            <div className="button-container">
                <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
                <button className="signout" onClick={signOut}>SIGN OUT</button>
            </div>
            {showModal && <Modal mode={"create"} setShowModal={setShowModal} getData={getData}/>}
        </div>
    )
}

export default ListHeader
