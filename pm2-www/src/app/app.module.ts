import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/angular-material.module';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        ConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        AngularMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        CoreModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmDialogComponent]
})
export class AppModule {
}
