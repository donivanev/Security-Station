import React, { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from '../../App'
import M from 'materialize-css'
import validator from "validator"

const Login = () => {

    const navigate = useNavigate("")
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const PostData = () => {
        if (!validator.isEmail(email)) {
            M.toast({html: 'Invalid email!', classes: '#c62828 red darken-3'})
            return
        }

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: '#c62828 red darken-3'})
            }
            else {
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({type: 'USER', payload: data.user})
                console.log(data.user)
                M.toast({html: 'Welcome, ' + data.user.firstName + '!', classes: '#43a047 green darken-1'})
                navigate('/')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Login</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Login</button>
                <h5>
                    <Link to="/register" style={{color: 'teal'}}>Don't have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Login