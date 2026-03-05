import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IConfig } from './config.interface';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ConfigService {
    public config: IConfig | null;

    constructor(private http: HttpClient)
    {
        this.config = null;
    }

    async load() {
      if (this.config !== null)
      {
        return;
      }

      let response = await firstValueFrom(this.http.get<IConfig>(environment.configUrl));
      this.config =  <IConfig>response;
    }
}
