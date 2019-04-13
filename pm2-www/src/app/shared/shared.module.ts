/* 3rd party libraries */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
/* Material components */

/* our own custom components */

/**
 * Módulo para las librerías de terceros, componentes propios que no
 * tengan dependencia con el Core ni inyecte nada...
 */
@NgModule({
    imports: [
        CommonModule

        /* 3rd party  */
    ],
    declarations: [],
    exports: [
        CommonModule

        /* 3rd party  */

        /* our own custom components */
    ]
})

/**
 * Clase del Módulo Shared
 */
export class SharedModule {
}
