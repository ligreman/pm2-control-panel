import { UtilsService } from './utils.service';
import { TestBed } from '@angular/core/testing';

describe('UtilsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: UtilsService = TestBed.inject(UtilsService);
        expect(service).toBeTruthy();
    });
});
