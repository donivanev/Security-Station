import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import M from 'materialize-css'
import validator from 'validator'
import storage from '../../firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const Register = () => {

    const navigate = useNavigate("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [photo, setPhoto] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (url) {
            uploadFields()
        }   
    }, [url])

    const uploadPhoto = () => {
        const storageRef = ref(storage, `/users/${photo.name}`)

        uploadBytes(storageRef, photo).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setUrl(url);
            })
        })
    }

    const uploadFields = () => {
        console.log(url)
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
                photo: url
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

    const PostData = () => {
        if (photo) {
            uploadPhoto()
        }
        else {
            M.toast({ html: 'No photo selected!', classes: '#c62828 red darken-3' })
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Register</h2>
                <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn" style={{ backgroundColor: '#40c4ff' }}>
                        <span>Upload Picture</span>
                        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                {/* <button onClick={() => uploadPhoto(image)}>Upload to Firebase</button> */}
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Register</button>
                <h5>
                    <Link to="/login" style={{color: 'teal'}}>Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Register