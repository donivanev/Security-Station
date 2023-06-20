import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css'
import validator from 'validator'

const Register = () => {

    const navigate = useNavigate("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        if (!validator.isEmail(email)) {
            M.toast({ html: "Invalid email!", classes: '#c62828 red darken-3' })
            return
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                // avatar: url
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: '#c62828 red darken-3' })
            }
            else {
                M.toast({ html: data.message, classes: '#43a047 green darken-1' })
                navigate('/login')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Register</h2>
                <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Register</button>
                <h5>
                    <Link to="/login" style={{color: 'teal'}}>Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Register