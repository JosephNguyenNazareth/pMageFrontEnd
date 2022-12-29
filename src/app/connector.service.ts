import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { Connector } from './connector';
import { environment } from 'src/environments/environment';
import { UserPMage } from './interface/userpmage';

@Injectable({providedIn: 'root'})
export class ConnectorService {
    private apiServerUrl = environment.apiBaseUrl ;

    constructor(private http: HttpClient) { }

    public getConnectors(): Observable<Connector[]> {
        return this.http.get<Connector[]>(`${this.apiServerUrl}/api/pmage`);
    }

    public addConnector(user: UserPMage): Observable<string> {
        return this.http.post<string>(`${this.apiServerUrl}/api/pmage/add`, user);
    }

    public updateConnector(connectorId: string, user : UserPMage): Observable<void> {
        return this.http.put<void>(`${this.apiServerUrl}/api/pmage/update/${connectorId}`, user);
    }

    public deleteConnector(connectorId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/pmage/delete/${connectorId}`);
    }
}