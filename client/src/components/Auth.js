import {useState} from "react"
import {useCookies} from "react-cookie"

const Auth = () => {
    const [cookies, setCookies, removeCookies] = useCookies(["user"])
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if (!isLogin && password !== confirmPassword) {
            setError("Make sure passwords match")
            return
        }

        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        })

        const data = await response.json()

        if (data.detail) {
            setError(data.detail)
        } else {
            setCookies("Email", data.email)
            setCookies("AuthToken", data.token)

            window.location.reload()
        }
    }

    const viewLogin = (status) => {
        setError(null)
        setIsLogin(status)
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form className="auth-container-form" onSubmit={e => handleSubmit(e, isLogin ? "login" : "signup")}>
                    <h2>{isLogin ? "Please log in" : "Please sign up"}</h2>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin &&
                    <input
                        type="text"
                        id="password-check"
                        name="password-check"
                        placeholder="confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    }
                    {error && <p>* {error}</p>}
                    <input type="submit" value="GO!" className="create"/>
                </form>
                <div className="auth-options">
                    <button
                        onClick={() => viewLogin(false)}
                        style={{backgroundColor: !isLogin ? "rgb(255,255,255" : "rgb(188, 188, 188"}}
                    >Sign Up
                    </button>
                    <button
                        onClick={() => viewLogin(true)}
                        style={{backgroundColor: isLogin ? "rgb(255,255,255" : "rgb(188, 188, 188"}}
                    >Login
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Auth
