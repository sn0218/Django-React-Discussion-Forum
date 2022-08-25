import {createContext, useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    // check existence of authToken in browser storage
    let authTokenInitState = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    // get the init user state by token
    let userState = localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null

    // set callback function to set the value once in initial load
    let [user, setUser] = useState(() => userState)
    let [authTokens, setAuthTokens] = useState(() => authTokenInitState) 

    const navigate = useNavigate();

    // handle login form from login page
    let loginUser = async (e) => {
        e.preventDefault()
        const credentials = new FormData(e.currentTarget);
        console.log(credentials)
       
        // get the api auth token from backend
        let response = await fetch(`/api/token/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': credentials.get('username'),
                'password': credentials.get('password')
            })
        })

        // get the response
        let data = await response.json()
        //console.log(data)
        
        if (response.status === 200) {
            // update the state of auth tokens from api token
            setAuthTokens(data)
            // update user information and decode the user information from token
            setUser(jwt_decode(data.access))
            // store auth token in local storage
            localStorage.setItem('authTokens', JSON.stringify(data))

            navigate('/')
        } else {
            alert('Something went wrong!')
        }
    }

    // handle the registration
    let registerUser = async (e) => {
        e.preventDefault()
        const credentials = new FormData(e.currentTarget);
        console.log(credentials)

        const response = await fetch("/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            'username': credentials.get('username'),
            'email': credentials.get('email'),
            'password': credentials.get('password'),
            'password2': credentials.get('password2'),
          })
        });

        let data = await response.json()
        console.log(data)

        if (response.status === 201) {
          navigate('/login')
        } else {
          alert("Something went wrong!");
        }
      };

    // handle logout
    let logoutUser = () => {
        // clear user and authToken state
        setAuthTokens(null)
        setUser(null)

        // remove authToken in browser
        localStorage.removeItem('authTokens')

        // redirect the user
        navigate('/')
    }
    

    // extract the decoded data
    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser

    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}

        </AuthContext.Provider>
    )
}