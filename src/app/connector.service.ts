import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Connector } from './connector';
import { environment } from 'src/environments/environment';
import { Bridge } from './interface/bridge';
import { Alignment } from './interface/alignment';
// import { PMSConnection } from './interface/pmsconnection';

@Injectable({providedIn: 'root'})
export class ConnectorService {
    private apiServerUrl = environment.apiBaseUrl ;

    constructor(private http: HttpClient) { }

    public getConnectors(): Observable<Connector[]> {
        return this.http.get<Connector[]>(`${this.apiServerUrl}/api/pmage`);
    }

    public addConnector(bridge : Bridge): Observable<string> {
        return this.http.post(`${this.apiServerUrl}/api/pmage/add`, bridge, {responseType: 'text'});
    }

    public addSuppConnector(bridge: Bridge, baseConnectorId: string): Observable<string> {
        return this.http.post(`${this.apiServerUrl}/api/pmage/add-supp/${baseConnectorId}`, bridge, {responseType: 'text'});
    }

    public updatePMSConfig(pmsConfig: string): Observable<string> {
        return this.http.post(`${this.apiServerUrl}/api/pmage/pms-config`, pmsConfig, {responseType: 'text'});
    }

    public updateConnector(connectorId: string, bridge : Bridge, taskArtifact: string): Observable<void> {
        return this.http.put<void>(`${this.apiServerUrl}/api/pmage/update/${connectorId}`, bridge, {params: {taskArtifact: taskArtifact}});
    }

    public updateSuppConnector(connectorId: string, bridge : Bridge, baseConnectorId: string, taskArtifact: string): Observable<void> {
        return this.http.put<void>(`${this.apiServerUrl}/api/pmage/update-supp/${connectorId}`, bridge, { params: {baseConnectorId: baseConnectorId, taskArtifact: taskArtifact }});
    }

    public deleteConnector(connectorId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/pmage/delete/${connectorId}`);
    }

    public generateActionLinkage(connectorId: string): Observable<string> {
        return this.http.get(`${this.apiServerUrl}/api/pmage/${connectorId}/generate-table`, {responseType: 'text'});
    }

    public startMonitoring(connectorId: string): Observable<void> {
        return this.http.get<void>(`${this.apiServerUrl}/api/pmage/${connectorId}/monitor`);
    }

    public stopMonitoring(connectorId: string): Observable<void> {
        return this.http.get<void>(`${this.apiServerUrl}/api/pmage/${connectorId}/end-monitor`);
    }

    public addAction(connectorId: string, actionDesc: string): Observable<void> {
        return this.http.put<void>(`${this.apiServerUrl}/api/pmage/${connectorId}/add-table`, {}, { params: {actionDescription: actionDesc} });
    }

    public getConnectorHistory(connectorId: string): Observable<void> {
        return this.http.get<void>(`${this.apiServerUrl}/api/pmage/${connectorId}/history`);
    }

    public downloadConnectorHistory(connectorId: string): Observable<Alignment[]> {
        return this.http.get<Alignment[]>(`${this.apiServerUrl}/api/pmage/${connectorId}/collect-hist`);
    }

    public getCaseId(pmsName: string, pmsUrl: string, usernamePms: string, passwordPms: string, processDef: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiServerUrl}/api/pmage/caseid`, { params: {pmsName: pmsName, pmsURL: pmsUrl, usernamePMS: usernamePms, passwordPMS: passwordPms, processDef: processDef}});
    }
}