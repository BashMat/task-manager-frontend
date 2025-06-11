import { Injectable } from "@angular/core";

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
}