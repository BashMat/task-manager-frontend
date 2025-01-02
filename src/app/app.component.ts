import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardsPageComponent } from "../boards-page/boards-page.component";
import { jwtDecode } from 'jwt-decode';
import { AuthorizationPageComponent } from '../authorization-page/authorization-page.component';

@Component({
  selector: 'app',
  imports: [RouterOutlet, AuthorizationPageComponent, BoardsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent
{
  accessToken: string | null = this.GetAccessToken();
  hasValidAccessToken: boolean = this.IsValidToken(this.accessToken);

  GetAccessToken(): string | null
  {
    let localStorageEntry = localStorage.getItem('token');
    if (!localStorageEntry || localStorageEntry === null || localStorageEntry === "null")
    {
      return null;
    }
    return localStorageEntry;
  }

  IsValidToken(token: string | null): boolean
  {
    if (token === null)
    {
      console.log("Token is null");
      return false;
    }

    let decodedToken = jwtDecode(token);
    let currentDate = new Date();

    if (decodedToken.exp === null)
    {
      console.log("Token invalid.");
      return false;
    }

    if (decodedToken.exp! * 1000 < currentDate.getTime())
    {
        console.log("Token expired.");
        return false;
    } 
    else 
    {
        console.log("Valid token");
        // TODO: add request to check token at backend
        return true;
    }
  }
}