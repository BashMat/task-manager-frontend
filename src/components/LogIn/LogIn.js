import './LogIn.css';
import '../../styles.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogIn(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("")

    function cleanData() {
        setUser("");
        setPassword("");
    }

    function LogIn(e)
    {
        e.preventDefault();

        if (user === "")
        {
            setMessage("Введите имя пользователя!")
            cleanData();
            return;
        }

        if (password === "")
        {
            setMessage("Введите пароль!")
            cleanData();
            return;
        }

        if (password.length < 6)
        {
            setMessage("Пароль слишком короткий!")
            cleanData();
            return;
        }

        console.log("Sending POST");

        let httpBody = JSON.stringify({ "logInData": user, "password": password });

        console.log("Body: ", httpBody);
        fetch("https://localhost:7285/api/auth/login/",
            {
                method: 'POST',
                mode: 'cors',
                body: httpBody,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                }
            }).then(response => {
                if (!response.ok) {
                    cleanData();
                    setMessage("Неверное имя пользователя или пароль!");
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    localStorage.setItem("token", data.data);

                    navigate("/board");
                })
            .catch((error) => {
                console.log("Неверное имя пользователя или пароль!");
                setMessage("Неверное имя пользователя или пароль!");
            });

            // console.log(response);

            // if (response.ok)
            // {
            //     const result = await response.json();
            //     console.log("Success:", result);
            // }
            // else if (response.status === 400)
            // {
            //     setMessage("Такой пользователь уже существует");
            // }
    }

    function ResetPassword()
    {
        setMessage("Функционал пока не реализован 😭")
    }

    return (
        <div className="log-in">
            <form onSubmit={LogIn} className="form-authorization">
                <div className="form-authorization-row">
                    <label htmlFor="input-user">Имя пользователя:</label>
                    <input id="input-user" type="text" placeholder="User..." value={user} onChange={e => setUser(e.target.value)} />
                </div>
                <div className="form-authorization-row">
                    <label htmlFor="input-password">Пароль:</label>
                    <input id="input-password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <p className="message">{message}</p>
                <button className="btn">Войти</button>
            </form>
            <div>
                <button className="btn" onClick={() => ResetPassword()}>Забыли пароль?</button>
                <button className="btn" onClick={() => props.Switch(false)}>Зарегистрироваться</button>
            </div>
        </div>
    )
}

export default LogIn;