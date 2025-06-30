import { Injectable } from '@angular/core';
import { PageLayout } from './page-layout.enum';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PageLayoutService 
{
    private layoutSubject = new Subject<PageLayout>();
    
    public layout = this.layoutSubject.asObservable();
    
    setLayout(value: PageLayout)
    {
        this.layoutSubject.next(value);
    }
}