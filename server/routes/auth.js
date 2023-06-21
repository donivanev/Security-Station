const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/', (req, res) => {
    res.send('Hello!')
})

router.post('/register', (req, res) => {
    const {firstName, lastName, email, password, photo} = req.body
    
    if (!firstName || !lastName || !email || !password || !photo) {
        return res.status(422).json({error: "Please fill all the fields"})
    }

    User.findOne({email: email})
    .then(savedUser => {
        if (savedUser) {
            return res.status(422).json({error: "User already exists with that email"})
        }

        bcrypt.hash(password, 12).then(hashedpassword => {
            const user = new User({firstName, lastName, email, password: hashedpassword, photo})
            user.save().then(user => {res.json({message: "Successfully registered!"})}).catch(err => console.log(err))
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/login', (req, res) => {
    const {email, password} = req.body
    
    if (!email || !password) {
        return res.status(422).json({error: "Please fill all the fields"})
    }

    User.findOne({email: email})
    .then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({error: "Invalid email or password"})
        }

        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, firstName, lastName, password, email} = savedUser
                
                res.json({token, user: {_id, firstName, lastName, password, email}})
            }
            else {
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router