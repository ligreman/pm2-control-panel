/* tslint:disable:no-string-literal */
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@app/core/http/api.service';
import { DefaultResponse } from '@app/core/interfaces/default-response';

@Component({
    selector: 'pm2-new-process-dialog',
    templateUrl: './new-process-dialog.component.html',
    styleUrls: ['./new-process-dialog.component.scss']
})

export class NewProcessDialogComponent implements OnInit, AfterViewInit {

    processesList: Array<string>;
    isLoadingSelect = false;

    // Validación del formulario
    // nameFormControl = new FormControl('', [Validators.required]);
    // selectFormControl = new FormControl('', [Validators.required]);


    constructor(
        private dialogRef: MatDialogRef<NewProcessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService, private snackBar: MatSnackBar) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.isLoadingSelect = true;
    }

    ngAfterViewInit() {
        // Pido la lista de scripts disponibles
        this.apiService.getAvailableProcesses().subscribe(
            (response: HttpResponse<DefaultResponse>) => {

                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    // Muestro un toast
                    this.snackBar.open('Error al consultar al API', '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 2500,
                        panelClass: ['snackbar-warn']
                    });

                    this.processesList = [];
                    this.isLoadingSelect = false;
                } else {
                    // Correcto
                    const body = response['body'];

                    // Todo OK
                    this.processesList = body.data;

                    this.isLoadingSelect = false;
                }
            },
            (error: any) => {
                console.log('Error: ' + error);
                this.isLoadingSelect = false;
            }
        );
    }
}
