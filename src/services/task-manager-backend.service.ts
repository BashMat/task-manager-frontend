import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Board } from "../boards-page/board.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BoardDto } from "../boards-page/board-dto.interface";

@Injectable({
    providedIn: 'root'
})
export class TaskManagerBackendService
{
    token: string | null = null;

    taskManagerBackendUrl = "https://localhost:5001";
    api = "api";
    apiUrl = `${this.taskManagerBackendUrl}/${this.api}`;
    auth = "auth";
    signUpEndpoint = `${this.apiUrl}/${this.auth}/signup`;
    logInEndpoint = `${this.apiUrl}/${this.auth}/login`;
    
    boards = "boards";
    boardsEndpoint = `${this.apiUrl}/${this.boards}`;

    constructor(private httpClient: HttpClient)
    {
        this.httpClient = httpClient;
    }

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

    AddBoard(boardTitle: string) : Observable<{data: BoardDto, message: string, success: boolean}>
    {
        console.log("Adding board", boardTitle);
        const headers = {
            'Content-type': 'application/json; charset=UTF-8',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Authorization": "bearer " + this.token
          }
      
        const requestOptions = {                                                                                                                                                                                 
            headers: new HttpHeaders(headers), 
        };

        const body = {
            "Title": boardTitle,
            "Description": null
        }
    
        return this.httpClient.post<{data: BoardDto, message: string, success: boolean}>(this.boardsEndpoint, body, requestOptions);
    }

    GetBoards(): Observable<BoardDto[]>
    {
        const headers = {
            'Content-type': 'application/json; charset=UTF-8',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Authorization": "bearer " + this.token
          }
      
        const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headers), 
        };
    
        return this.httpClient.get<BoardDto[]>(this.boardsEndpoint, requestOptions);
    }

    private ConvertToBoardArray(data: any) : Array<Board>
    {
        console.log("Converting...")
        return data.map((board: Board) =>
            {
                return {id: board.id, title: board.title, columns: board.columns.map((column: { id: any; title: any; cards: any[]; }) =>
                    {
                        return {id: column.id, title: column.title, cards: column.cards.map((card: { id: any; title: any; orderIndex: any; }) =>
                            {
                                return {id: card.id, title: card.title, orderIndex: card.orderIndex};
                            }).sort((lhs: { orderIndex: number; }, rhs: { orderIndex: number; }) => lhs.orderIndex < rhs.orderIndex ? -1 : 1)};
                    }).sort((lhs: { id: number; }, rhs: { id: number; }) => lhs.id < rhs.id ? -1 : 1)};
            }).sort((lhs: { id: number; }, rhs: { id: number; }) => lhs.id < rhs.id ? -1 : 1);
    }

    DeleteBoard(boardId: number): Observable<BoardDto[]>
    {
        const headers = {
            'Content-type': 'application/json; charset=UTF-8',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Authorization": "bearer " + this.token
          }
      
        const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headers), 
        };
    
        return this.httpClient.delete<BoardDto[]>(`${this.boardsEndpoint}/${boardId}`, requestOptions);
    }
}