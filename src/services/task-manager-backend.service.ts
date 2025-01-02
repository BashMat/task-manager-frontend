import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TaskManagerBackendService
{
    taskManagerBackendUrl = "https://localhost:5001";
    api = "api";
    apiUrl = `${this.taskManagerBackendUrl}/${this.api}`;
    auth = "auth";
    signUpEndpoint = `${this.apiUrl}/${this.auth}/signup`;
    logInEndpoint = `${this.apiUrl}/${this.auth}/login`;
    
    boards = "boards";
    boardsEndpoint = `${this.apiUrl}/${this.boards}`;

    LogIn(logInData: string, password: string): void
    {
        console.log("Start Logging In");
        if (logInData === "")
        {
            console.log("Log In data cannot be empty");
            return;
        }
    
        if (password === "")
        {
            console.log("Password data cannot be empty");
            return;
        }

        if (password.length < 4)
        {
            console.log("Password cannot be shorter than 4 characters");
            return;
        }

        console.log("Sending POST");

        let httpBody = JSON.stringify({ "logInData": logInData, "password": password });

        console.log("Body: ", httpBody);
        fetch(this.logInEndpoint,
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
                    console.log("Неверное имя пользователя или пароль!");
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    localStorage.setItem("token", data.data);
                })
            .catch((error) => {
                console.log("Неверное имя пользователя или пароль!");
            });
        console.log("Finish Logging In");
    }

    SignUp(email: string, userName:string, password: string): void
    {
        console.log("Start Signing Up");
        if (email === "" || !email.includes("@"))
        {
            console.log("Email is invalid");
            return;
        }
    
        if (userName === "")
        {
            console.log("Username cannot be empty");
            return;
        }

        if (password === "")
        {
            console.log("Password data cannot be empty");
            return;
        }

        if (password.length < 4)
        {
            console.log("Password cannot be shorter than 4 characters");
            return;
        }

        console.log("Sending POST");

        let httpBody = JSON.stringify({ "email": email, "userName": userName, "password": password });

        console.log("Body: ", httpBody);
        fetch(this.signUpEndpoint,
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
                    console.log("Регистрация успешно завершена! Перейдите на страницу входа")
                    return;
                }
                else {
                    console.log("Такой пользователь уже существует!")
                    return;
                }
            }
            ).catch((e) => {
                console.log(e);
            });
        console.log("Finish Logging In");
    }
}