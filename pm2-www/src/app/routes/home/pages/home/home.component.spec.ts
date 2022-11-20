import { registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import localeEs from '@angular/common/locales/es';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '@app/core/http/api.service';
import { CoreModule } from '@app/core/core.module';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs/index';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;


    beforeEach(async(() => {
        registerLocaleData(localeEs);

        const testQuote = 'Test Quote';

        // Create a fake ApiService object with a `getDomains()` spy
        const myApiService = jasmine.createSpyObj('ApiService', ['getDomains', 'getDomainsStats']);
        // Make the spy return a synchronous Observable with the test data
        const getQuoteSpy = myApiService.getDomains.and.returnValue(of(testQuote));
        const getQuoteSpy2 = myApiService.getDomainsStats.and.returnValue(of(testQuote));

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                CoreModule,
                SharedModule,
                FormsModule,
                AngularMaterialModule
            ],
            providers: [
                {provide: ApiService, useValue: myApiService}
            ],
            declarations: [HomeComponent]
        })
            .compileComponents();

        // Creo el componente + html = fixture
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show results after component initialized', () => {
        fixture.detectChanges(); // onInit()

        // sync spy result shows testQuote immediately after init
        // Comprueba que en el componente hay una variable timeTaken con valor 0
        // expect(component.timeTaken).toBe(0);
    });
});
