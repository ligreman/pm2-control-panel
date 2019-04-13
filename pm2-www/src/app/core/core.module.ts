/* 3rd party libraries */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

/* our own custom services  */

/**
 * Todos los servicios Singleton
 */
@NgModule({
    imports: [
        /* 3rd party libraries */
        CommonModule,
        HttpClientModule
    ],
    exports: [HttpClientModule],
    declarations: [],
    providers: [
        /* our own custom services  */
    ]
})

/**
 * Clase del Módulo Core
 */
export class CoreModule {
    /* make sure CoreModule is imported only by one NgModule the AppModule */
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}
