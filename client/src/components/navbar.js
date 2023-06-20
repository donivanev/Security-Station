import React, { useContext } from "react"
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = () => {

    const {state, dispatch} = useContext(UserContext)

    const renderList = () => {
        if (state) {
            return [
                <li key='1'><Link to='/about' style={{color: 'black', fontSize: '25px'}}>About</Link></li>,
                <li key='4'><Link to='/monitor'>
                    <i className="material-icons right" style={{color: 'black', marginLeft: '3px'}}>security</i></Link></li>,
                <li key='5'><Link to='/login' style={{color: 'black', fontSize: '25px'}} onClick={() => {
                    localStorage.clear()
                    dispatch({type: 'CLEAR'})
                    M.toast({ html: 'Successfully logged out.', classes: "#43a047 green darken-1" })
                }}>Logout</Link></li>
            ]
        }
        else {
            return [
                <li key='6'><Link to='/about' style={{color: 'black', fontSize: '25px'}}>About</Link></li>,
                <li key='7'><Link to='/register' style={{color: 'black', fontSize: '25px'}}>Register</Link></li>,
                <li key='8'><Link to='/login' style={{color: 'black', fontSize: '25px'}}>Login</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <Link to='/' className="brand-logo left" style={{color: 'black', fontSize: '35px', marginLeft: '20px'}}>Home</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
