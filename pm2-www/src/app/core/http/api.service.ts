import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { DefaultResponse } from '@app/core/interfaces/default-response';
import { api } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
    // When you provide the service at the root level, Angular creates a single,
    // shared instance of the service and injects into any class that asks for it.
    providedIn: 'root'
})

/**
 * Servicio para consultar al API
 */
export class ApiService {
    constructor(private http: HttpClient) {

    }

    getCurrentProcesses(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        // Preparo los parámetros
        let httpParams = new HttpParams();
        httpParams = httpParams.set('page', params.page);
        httpParams = httpParams.set('limit', params.limit);

        return this.http.get<DefaultResponse>(api.url + 'services', {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            params: httpParams,
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('fetched processes')),
            catchError(this.handleError('getCurrentProcesses', []))
        );
    }

    getAvailableProcesses(): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.get<DefaultResponse>(api.url + 'services/available', {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('fetched available processes')),
            catchError(this.handleError('getAvailableProcesses', []))
        );
    }

    createNewProcess(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.post<DefaultResponse>(api.url + 'services/start', params, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process created')),
            catchError(this.handleError('createNewProcess', []))
        );
    }

    stopProcess(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.post<DefaultResponse>(api.url + 'services/stop', params, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process stopped')),
            catchError(this.handleError('stopProcess', []))
        );
    }

    startProcess(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.post<DefaultResponse>(api.url + 'services/restart', params, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process restarted')),
            catchError(this.handleError('startProcess', []))
        );
    }

    reloadProcess(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.post<DefaultResponse>(api.url + 'services/reload', params, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process reloaded')),
            catchError(this.handleError('reloadProcess', []))
        );
    }

    deleteProcess(params: any): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.post<DefaultResponse>(api.url + 'services/delete', params, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process deleted')),
            catchError(this.handleError('deleteProcess', []))
        );
    }

    getMachineInfo(): Observable<any[] | HttpResponse<DefaultResponse>> {
        return this.http.get<DefaultResponse>(api.url + 'machine', {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('machine info')),
            catchError(this.handleError('getMachineInfo', []))
        );
    }

    getProcessLog(params: any): Observable<any> {
        // Preparo los parámetros
        let httpParams = new HttpParams();
        httpParams = httpParams.set('id', params.id);
        httpParams = httpParams.set('type', params.type);

        return this.http.get(api.url + 'services/log', {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            params: httpParams,
            responseType: 'blob',
            // Le digo que quiero la respuesta entera
            observe: 'response'
        }).pipe(
            // Envía la variable al log
            tap(domains => console.log('process log')),
            catchError(this.handleError('getProcessLog', []))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
