import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { api } from '@env/environment';


import { ApiService } from './api.service';

describe('ApiService', () => {
    // let myApiService: ApiService;
    let injector: TestBed;
    let myApiService: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });

        // for convenience we saved the injector and the providers we'll use in our tests in variables
        injector = getTestBed();
        myApiService = injector.get(ApiService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        // We also run HttpTestingController#verify to make sure that there are no outstanding requests
        httpMock.verify();
    });

    it('should be created', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));

    it('should call #getDomains on ApiService', () => {
        const dummyResponse = [
            {login: 'John'},
            {login: 'Doe'}
        ];

        const params = {
            skip: 0,
            limit: 10
        };
        myApiService.getDomains(params).subscribe(response => {
            // Testeo la respuesta
            console.log('respuesta');
            console.log(response);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body).toEqual(dummyResponse);
        });

        // HttpTestingController to mock requests
        const req = httpMock.expectOne(api.url + 'domains?skip=0&limit=10');
        console.log('request');
        console.log(JSON.stringify(req.request));
        expect(req.request.method).toBe('GET');
        // Testeo los parámetros de la petición
        expect(req.request.responseType).toEqual('json');
        // flush method to provide dummy values as responses
        req.flush(dummyResponse);
    });
});
