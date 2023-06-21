import React, { useEffect, useReducer, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { reducer, initialState } from './reducers/userReducer'
import Header from './components/header'
import NavBar from './components/navbar'
import Footer from './components/footer'
import Home from './components/screens/home'
import About from './components/screens/about'
import Login from './components/screens/login'
import Register from './components/screens/register'
import Monitor from './components/screens/monitor'
import './App.css'

export const UserContext = createContext()

const Routing = () => {
  
  const navigate = useNavigate("")
  const {state, dispatch} = useContext(UserContext)

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('user')))
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({type: 'USER', payload: user })
    }
    else {
      navigate('/login')
    }
  }, [])

  return (
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/monitor' element={<Monitor />}></Route>
      </Routes>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Header />
        <NavBar />
        <Routing />
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App
