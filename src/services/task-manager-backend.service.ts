import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Board } from "../boards-page/board.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BoardDto } from "../boards-page/board-dto.interface";
import { Column } from "../board/column.interface";
import { Card } from "../column/card.interface";

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

    columns = "columns";
    columnsEndpoint = `${this.apiUrl}/${this.boards}/${this.columns}`;

    cards = "cards";
    cardsEndpoint = `${this.apiUrl}/${this.boards}/${this.cards}`;

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

    AddColumn(boardId: number, columnTitle: string): Observable<{data: Column, message: string, success: boolean}> 
    {
        console.log("Adding column", columnTitle);
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
            "Title": columnTitle,
            "Description": null,
            "BoardId": boardId
        }
    
        return this.httpClient.post<{data: Column, message: string, success: boolean}>(this.columnsEndpoint, body, requestOptions);
    }
    
    DeleteColumn(columnId: number): Observable<Column[]>
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
    
        return this.httpClient.delete<Column[]>(`${this.columnsEndpoint}/${columnId}`, requestOptions);
    }

    AddCard(columnId: number, cardTitle: string): Observable<{data: Card, message: string, success: boolean}> 
    {
        console.log("Adding card", cardTitle);
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
            "Title": cardTitle,
            "Description": null,
            "ColumnId": columnId
        }
    
        return this.httpClient.post<{data: Card, message: string, success: boolean}>(this.cardsEndpoint, body, requestOptions);
    }

    DeleteCard(cardId: number): Observable<Card[]>
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
    
        return this.httpClient.delete<Card[]>(`${this.cardsEndpoint}/${cardId}`, requestOptions);
    }

    MoveCard(cardToMove: Card, columnId: number, orderIndex: number): Observable<Card>
    {
        console.log("Start moving Card to Column", columnId, "at order index", orderIndex);

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
            "Title": cardToMove.title,
            "Description": cardToMove.description,
            "ColumnId": columnId,
            "OrderIndex": orderIndex
        }
    
        return this.httpClient.put<Card>(`${this.cardsEndpoint}/${cardToMove.id}`, body, requestOptions);
    }
}