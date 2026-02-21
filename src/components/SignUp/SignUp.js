import './SignUp.css';
import '../../styles.css';
import { useState } from 'react';

function SignUp(props) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("")
    const [message, setMessage] = useState("")

    function cleanData() {
        setEmail("");
        setUsername("");
        setPassword("");
        setRepeatedPassword("");
    }

    function SignUp(e) {

        e.preventDefault();

        if (username === "")
        {
            setMessage("Введите имя пользователя!");
            cleanData();
            return;
        }

        if (repeatedPassword !== password)
        {
            setMessage("Пароли должны совпадать!");
            cleanData();
            return;
        }

        if (password.length < 6) {
            setMessage("Пароль слишком короткий!");
            cleanData()
            return;
        }

        if (email !== "" && !email.includes("@")) {
            setMessage("Недействительный почтовый адрес!");
            cleanData()
            return;
        }

        let httpBody = JSON.stringify({ "email": email, "userName": username, "password": password })
        try {
            fetch("https://localhost:7285/api/auth/signup/",
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
                    if (response.ok) {
                        setMessage("Регистрация успешно завершена! Перейдите на страницу входа")
                        return;
                    }
                    else {
                        cleanData()
                        setMessage("Такой пользователь уже существует!")
                        return;
                    }
                }
                ).catch((e) => {
                    console.log(e);
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
        catch (error) {
            console.error("Error:", error);
        }
        // response.then(response => 
        //     {
        //         console.log(response)
        //         response.json()
        //     })
        // .then(data => 
        // {
        //     console.log(data);
        //     if (data.message = "Username already exists")
        //     {
        //         setMessage(data.message)
        //     }
        // })
        // .catch((err) =>
        // {
        //     console.log(err.message);
        // });
    }

    return (
        <div className="sign-up">
            <form onSubmit={SignUp} className="form-authorization">
                <div className="form-authorization-row">
                    <label htmlFor="input-email">Email:</label>
                    <input id="input-email" type="text" placeholder="E-mail address..." value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-authorization-row">
                    <label htmlFor="input-username">Имя пользователя:</label>
                    <input id="input-username" type="text" placeholder="Username..." value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-authorization-row">
                    <label htmlFor="input-password">Пароль:</label>
                    <input id="input-password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="form-authorization-row">
                    <label htmlFor="input-repeated-password">Повторите пароль:</label>
                    <input id="input-repeated-password" type="password" value={repeatedPassword} onChange={e => setRepeatedPassword(e.target.value)} />
                </div>
                <p className="message">{message}</p>
                <button className="btn">Зарегистрироваться</button>
            </form>
            <div>
                <button className="btn" onClick={() => props.Switch(true)}>Уже зарегистрированы?</button>
            </div>
        </div>
    )
}

export default SignUp;