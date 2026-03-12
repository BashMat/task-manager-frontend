import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService
{
  GetAccessToken(): string | null
  {
    let localStorageEntry = localStorage.getItem('token');
    if (!localStorageEntry || localStorageEntry === null || localStorageEntry === "null")
    {
      return null;
    }
    return localStorageEntry;
  }

  GetRefreshToken(): string | null
  {
    let localStorageEntry = localStorage.getItem('refreshToken');
    if (!localStorageEntry || localStorageEntry === null || localStorageEntry === "null")
    {
      return null;
    }
    return localStorageEntry;
  }

  SetTokens(accessToken: string, refreshToken: string)
  {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  DeleteTokens()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  // TODO: This should be in some Auth service
  HasValidToken(): boolean
  {
    let token = this.GetRefreshToken();
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
