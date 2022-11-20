import { NgModule } from '@angular/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [],
    imports: [
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatTooltipModule,
        MatListModule,
        MatPaginatorModule,
        MatCardModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatDialogModule,
        MatSliderModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatTooltipModule,
        MatListModule,
        MatPaginatorModule,
        MatCardModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatDialogModule,
        MatSliderModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AngularMaterialModule {
}
