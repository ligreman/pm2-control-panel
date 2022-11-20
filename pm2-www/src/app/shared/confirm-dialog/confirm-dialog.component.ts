import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
    selector: 'pm2-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

    onAcceptClick(): void {
        this.dialogRef.close(true);
    }
}
