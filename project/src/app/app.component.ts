import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardsPageComponent } from "../boards-page/boards-page.component";
import { jwtDecode } from 'jwt-decode';
import { AuthorizationPageComponent } from '../authorization-page/authorization-page.component';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app',
  imports: [RouterOutlet, AuthorizationPageComponent, BoardsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent
{
  accessToken: string | null;
  hasValidAccessToken: boolean;

  constructor(private localStorageService: LocalStorageService)
  {
    this.localStorageService = localStorageService
    this.accessToken = this.localStorageService.GetAccessToken();
    this.hasValidAccessToken = this.IsValidToken(this.accessToken);
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