import './AuthorizationPage.css';
import '../../styles.css';
import { useEffect, useState } from 'react';
import LogIn from '../LogIn/LogIn';
import SignUp from '../SignUp/SignUp';
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

function AuthorizationPage(props) {
    const [option, setOption] = useState(true)
    const [token, setToken] = useState(GetToken())

    function GetToken()
    {
        let token = localStorage.getItem("token");

        if (token && token !== "null")
        {
            console.log("Returning token: ", token);
            return token;
        }
        console.log("Returning empty");
        return "";
    }

    let decodedToken = token;
    console.log("Token", decodedToken);
    if (decodedToken !== "")
    {
        console.log("Predecoded Token", decodedToken);
        decodedToken = jwtDecode(token);
        console.log("Decoded Token", decodedToken);
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime())
        {
            console.log("Token expired.");
        } 
        else 
        {
            console.log("Valid token");
            // TODO: add request to check token at backend
            return <Navigate to='/board' />
        }
    }
    else
    {
        console.log("token is empty")
    }

    return (
        <div className="authorization-page">
            <div className="authorization-page-header">
                <h1>Welcome to Yet Another Task Manager</h1>
            </div>

            <div className="authorization-page-body">
                {option
                    ?
                    (
                        <LogIn Switch={setOption} />
                    )
                    :
                    (
                        <SignUp Switch={setOption} />
                    )
                }
            </div>
        </div>
    )
}

export default AuthorizationPage;