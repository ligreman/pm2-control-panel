import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { NewProcessDialogComponent } from '@app/routes/home/new-process-dialog/new-process-dialog.component';

@NgModule({
    declarations: [HomeComponent, NewProcessDialogComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        AngularMaterialModule
    ],
    // componentes que cargo sin que estén en el template directamente, como los que se crean a partir del controlador
    entryComponents: [NewProcessDialogComponent]
})
export class HomeModule {
}
