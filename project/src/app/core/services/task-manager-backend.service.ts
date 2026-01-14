import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TrackingLogDto } from "./tracking-log-dto.interface";
import { TrackingLogEntry } from "./tracking-log-entry-dto.interface";
import { Status } from "./tracking-log-entry-status-dto.interface";
import { Card } from "../../features/tasks/column/card.interface";

@Injectable({
    providedIn: 'root'
})
export class TaskManagerBackendService {
    token: string | null = null;

    taskManagerBackendUrl = "http://localhost:5000";
    api = "api";
    apiUrl = `${this.taskManagerBackendUrl}/${this.api}`;
    auth = "auth";
    signUpEndpoint = `${this.apiUrl}/${this.auth}/signup`;
    logInEndpoint = `${this.apiUrl}/${this.auth}/login`;

    tracking = "tracking";
    logs = "logs";
    trackingLogsEndpoint = `${this.apiUrl}/${this.tracking}/${this.logs}`;

    logEntryStatuses = "statuses";
    trackingLogEntryStatusesEndpoint = `${this.apiUrl}/${this.tracking}/${this.logEntryStatuses}`;

    logEntries = "log-entries";
    trackingLogEntriesEndpoint = `${this.apiUrl}/${this.tracking}/${this.logEntries}`;

    constructor(private httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    LogIn(logInData: string, password: string): Observable<{ data: string, message: string, success: boolean } | null> {
        console.log("Start Logging In");
        if (logInData === "") {
            console.log("Log In data cannot be empty");
            return of(null);
        }

        if (password === "") {
            console.log("Password data cannot be empty");
            return of(null);
        }

        if (password.length < 8) {
            console.log("Password cannot be shorter than 4 characters");
            return of(null);
        }

        console.log("Sending POST");

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

        let body = JSON.stringify({ "logInData": logInData, "password": password });

        console.log("Body: ", body);
        return this.httpClient
            .post<{ data: string, message: string, success: boolean }>(this.logInEndpoint, body, requestOptions)
            .pipe(map(result => {
                localStorage.setItem("token", result.data);
                return result; // return back same result.
            }
            )
            );
    }

    SignUp(email: string, userName: string, password: string): void {
        console.log("Start Signing Up");
        if (email === "" || !email.includes("@")) {
            console.log("Email is invalid");
            return;
        }

        if (userName === "") {
            console.log("Username cannot be empty");
            return;
        }

        if (password === "") {
            console.log("Password data cannot be empty");
            return;
        }

        if (password.length < 4) {
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

    AddBoard(title: string, description: string | null): Observable<{ data: TrackingLogDto, message: string, success: boolean }> {
        console.log("Adding board", title);
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
            "Title": title,
            "Description": this.processNullableString(description)
        }

        return this.httpClient.post<{ data: TrackingLogDto, message: string, success: boolean }>(this.trackingLogsEndpoint, body, requestOptions);
    }

    processNullableString(str: string | null)
    {
        return str === null ? null : (str.trim() === "" ? null : str)
    }

    GetBoards(): Observable<TrackingLogDto[]> {
        console.log("Getting boards");
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

        return this.httpClient.get<TrackingLogDto[]>(this.trackingLogsEndpoint, requestOptions);
    }

    DeleteBoard(boardId: number): Observable<TrackingLogDto[]> {
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

        return this.httpClient.delete<TrackingLogDto[]>(`${this.trackingLogsEndpoint}/${boardId}`, requestOptions);
    }

    AddColumn(boardId: number, title: string, description: string | null): Observable<{ data: Status, message: string, success: boolean }> {
        console.log("Adding column", title);
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
            "Title": title,
            "Description": this.processNullableString(description),
            "TrackingLogId": boardId
        }

        return this.httpClient.post<{ data: Status, message: string, success: boolean }>(this.trackingLogEntryStatusesEndpoint, body, requestOptions);
    }

    DeleteColumn(columnId: number): Observable<{ data: Array<Status>, message: string, success: boolean }> {
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

        return this.httpClient.delete<{ data: Array<Status>, message: string, success: boolean }>(`${this.trackingLogEntryStatusesEndpoint}/${columnId}`, requestOptions);
    }

    AddCard(boardId: number, columnId: number, title: string, description: string | null, orderIndex: number): Observable<{ data: TrackingLogEntry, message: string, success: boolean }> {
        console.log("Adding card", title);
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
            "Title": title,
            "Description": this.processNullableString(description),
            "TrackingLogId": boardId,
            "StatusId": columnId,
            "OrderIndex": orderIndex
        }

        return this.httpClient.post<{ data: TrackingLogEntry, message: string, success: boolean }>(this.trackingLogEntriesEndpoint, body, requestOptions);
    }

    DeleteCard(cardId: number): Observable<TrackingLogEntry[]> {
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

        return this.httpClient.delete<TrackingLogEntry[]>(`${this.trackingLogEntriesEndpoint}/${cardId}`, requestOptions);
    }

    MoveCard(cardToMove: Card, columnId: number, orderIndex: number): Observable<{ data: TrackingLogEntry, message: string, success: boolean }> {
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
            "TrackingLogId": cardToMove.boardId,
            "StatusId": columnId,
            "Priority": cardToMove.priority,
            "OrderIndex": orderIndex,
            "UpdatedAt": cardToMove.updatedAt
        }

        return this.httpClient.put<{ data: TrackingLogEntry, message: string, success: boolean }>(`${this.trackingLogEntriesEndpoint}/${cardToMove.id}`, body, requestOptions);
    }
}