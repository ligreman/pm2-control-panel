import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';


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

});
