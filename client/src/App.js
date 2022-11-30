import {useEffect, useState} from "react"
import ListHeader from "./components/ListHeader"
import ListItem from "./components/ListItem"
import Auth from "./components/Auth"
import {useCookies} from "react-cookie"

const App = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [tasks, setTasks] = useState(null)

    const authToken = cookies.AuthToken
    const userEmail = cookies.Email

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
            if (response.status === 200) {
                const json = await response.json()
                setTasks(json)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => getData, [])

    console.log(tasks)

    return (
        <div className="app">
            {!authToken && <Auth/>}
            {authToken &&
            <>
                <ListHeader listName={'🏝️ Holiday Tick List'} getData={getData}/>
                <p className="user-email">Welcome back {userEmail}</p>
                {tasks?.map(task => (
                    <ListItem key={task.id} task={task} getData={getData}/>
                ))}
            </>}
        </div>
    )
}

export default App
