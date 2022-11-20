import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/http/api.service';
import { DefaultResponse } from '@app/core/interfaces/default-response';
import { UtilsService } from '@app/core/utils/utils.service';
import { NewProcessDialogComponent } from '@app/routes/home/new-process-dialog/new-process-dialog.component';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { matPaginatorIntlSpanish } from '@app/shared/spanish-paginator-intl';
import { Duration } from 'luxon';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'pm2-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [
        {provide: MatPaginatorIntl, useClass: matPaginatorIntlSpanish}
    ]
})

export class HomeComponent implements OnInit, AfterViewInit {
    firstLoad = true;
    isLoadingTable = false;
    dataProcesses: Array<object>;
    machineInfo: object;
    displayedColumns: string[] = ['name', 'status', 'mode', 'restarted', 'time', 'memory', 'cpu', 'actions', 'logs'];

    // Librería Math para poder acceder desde el template
    Math = Math;
    // Librería Luxon
    Duration = Duration;

    // MatPaginator
    // pageEvent: PageEvent;
    pageSize = 5;
    pageIndex = 0;
    paginationLength = 0;

    // Constructor. Inicializo propiedades
    constructor(private apiService: ApiService,
                private activatedRoute: ActivatedRoute, private router: Router,
                private snackBar: MatSnackBar, private dialog: MatDialog) {
        console.log('CONSTRUCTOR');
    }

    /**
     * Al inicializarse el componente, asigno valores iniciales a las cosas
     */
    ngOnInit(): void {
        /*
        Si dieramos este valor inicial en el ngAfterViewInit se produciría un error de ExpressionChangedAfterItHasBeenCheckedError
        Esto se debe a lo que explica este post
        https://blog.angular-university.io/angular-debugging/

        Como siempre se hace una petición al inicio, lo pongo aquí. Podría hacer la petición en el ViewInit
        con un timeout por ejemplo y valdría también
         */
        this.isLoadingTable = true;

    }

    /**
     * Una vez se han cargado todos los views hijos (como directivas, etc)
     */
    ngAfterViewInit() {
        this.getProcessData();
        this.getMachineInfo();
    }

    /**
     * Obtiene la información del proceso
     * @param event Evento del paginador
     */
    public getProcessData(event?: any) {
        this.isLoadingTable = true;

        // Parámetros por defecto
        const params = {
            page: 0,
            limit: 5
        };

        // Si viene evento
        if (event && !isNaN(event.pageIndex) && !isNaN(event.pageSize)) {
            params.page = event.pageIndex;
            params.limit = event.pageSize;

            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
        }

        // Pido los totales al api para pintarlos
        this.apiService.getCurrentProcesses(params).subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                if (!response['body'] || response['status'] !== 200) {
                    // Muestro un toast
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });

                    this.dataProcesses = [];
                    this.isLoadingTable = false;
                    this.firstLoad = false;
                } else {
                    // Correcto
                    const body = response['body'];

                    // Todo OK
                    this.dataProcesses = body.data.processes;

                    // Total de resultados
                    this.paginationLength = body.data.total;

                    this.isLoadingTable = false;
                    this.firstLoad = false;
                }
            },
            error => {
                console.log('Error: ' + error);
                this.isLoadingTable = false;
                this.firstLoad = false;
            }
        );
    }

    /**
     * Diálogo para crear un proceso nuevo
     */
    public newProcessDialog() {
        let max = 1;
        if (this.machineInfo && this.machineInfo['cpus']) {
            max = this.machineInfo['cpus'].length;
        }

        const dialogRef = this.dialog.open(NewProcessDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {processName: '', processScript: '', processInstances: 1, maxInstances: max}
        });

        dialogRef.afterClosed().subscribe(returnedValue => {
            // Mando la petición al API
            if (returnedValue && returnedValue.processName && returnedValue.processScript) {
                this.newProcess(returnedValue.processName, returnedValue.processScript, returnedValue.processInstances);
            }
        });
    }

    /**
     * Crea un proceso nuevo
     * @param name Nombre del proceso
     * @param script Script que ejecutará
     * @param instances Número de instancias creadas para el proceso
     */
    public newProcess(name: string, script: string, instances: number) {
        this.isLoadingTable = true;

        // Pido los totales al api para pintarlos
        this.apiService.createNewProcess({
            name: name,
            script: script,
            instances: instances
        }).subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                this.isLoadingTable = false;

                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });

                    // Pido los datos de nuevo
                    this.getProcessData();
                } else {
                    // Correcto, voy a pedir los datos de nuevo
                    this.getProcessData();
                    this.snackBar.open('Proceso ' + name + ' creado', '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 1000,
                        panelClass: ['snackbar-success']
                    });
                }

            },
            error => {
                console.log('Error: ' + error);
                this.isLoadingTable = false;
            }
        );
    }

    /**
     * Inicia nuevos procesos
     * @param id ID del proceso
     */
    public startProcess(id: string) {
        this.isLoadingTable = true;

        this.apiService.startProcess({id: id}).subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                this.isLoadingTable = false;
                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });
                } else {

                    // Correcto, voy a pedir los datos de nuevo
                    this.getProcessData();
                }


            },
            error => {
                console.log('Error: ' + error);
                this.isLoadingTable = false;
            }
        );
    }

    /**
     * Detiene un proceso
     * @param id ID del proceso
     */
    public stopProcess(id: string) {
        this.isLoadingTable = true;

        this.apiService.stopProcess({id: id}).subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                this.isLoadingTable = false;
                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });
                } else {

                    // Correcto, voy a pedir los datos de nuevo
                    this.getProcessData();
                }
            },
            error => {
                this.isLoadingTable = false;
                console.log('Error: ' + error);
            }
        );
    }

    /**
     * Recarga el script de un proceso y lo reinicia
     * @param id ID del proceso
     */
    public reloadProcess(id: string) {
        this.isLoadingTable = true;

        this.apiService.reloadProcess({id: id}).subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                this.isLoadingTable = false;
                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });
                } else {
                    // Correcto, voy a pedir los datos de nuevo
                    this.getProcessData();

                    this.snackBar.open('Proceso recargado', '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 1000,
                        panelClass: ['snackbar-success']
                    });
                }

            },
            error => {
                this.isLoadingTable = false;
                console.log('Error: ' + error);
            }
        );
    }

    /**
     * Flush al proceso (elimina los logs)
     * @param name Nombre del proceso
     */
    public flushProcess(name: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
                title: '¿Eliminar los logs del proceso?',
                message: 'Confirma que quieres eliminar todos los logs de PM2 del proceso ' + name + '. No se eliminarán los logs que cree el script de dicho proceso, sólo los que genera PM2.',
                acceptButton: 'Eliminar logs'
            }
        });

        dialogRef.afterClosed().subscribe(returnedValue => {
            // Mando la petición al API
            if (returnedValue === true) {

                this.isLoadingTable = true;

                this.apiService.flushProcess({name: name}).subscribe(
                    (response: HttpResponse<DefaultResponse>) => {
                        this.isLoadingTable = false;
                        if (!response['body'] || response['status'] !== 200) {
                            // ERROR
                            this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                                horizontalPosition: 'end',
                                verticalPosition: 'bottom',
                                duration: 3000,
                                panelClass: ['snackbar-warn']
                            });
                        } else {

                            // Correcto, voy a pedir los datos de nuevo
                            this.getProcessData();
                            this.snackBar.open('Logs eliminados', '', {
                                horizontalPosition: 'end',
                                verticalPosition: 'bottom',
                                duration: 1000,
                                panelClass: ['snackbar-success']
                            });
                        }

                    },
                    error => {
                        this.isLoadingTable = false;
                        console.log('Error: ' + error);
                    }
                );
            }
        });
    }

    /**
     * Elimina un proceso
     * @param id ID del proceso
     * @param name Nombre del proceso
     */
    public deleteProcess(id: string, name: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
                title: '¿Eliminar el proceso?',
                message: 'Confirma que quieres eliminar el proceso ' + name,
                acceptButton: 'Eliminar proceso'
            }
        });

        dialogRef.afterClosed().subscribe(returnedValue => {
            // Mando la petición al API
            if (returnedValue === true) {
                this.isLoadingTable = true;

                this.apiService.deleteProcess({id: id}).subscribe(
                    (response: HttpResponse<DefaultResponse>) => {
                        this.isLoadingTable = false;
                        if (!response['body'] || response['status'] !== 200) {
                            // ERROR
                            this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                                horizontalPosition: 'end',
                                verticalPosition: 'bottom',
                                duration: 3000,
                                panelClass: ['snackbar-warn']
                            });
                        } else {
                            // Correcto, voy a pedir los datos de nuevo
                            this.getProcessData();

                            this.snackBar.open('Proceso eliminado', '', {
                                horizontalPosition: 'end',
                                verticalPosition: 'bottom',
                                duration: 1000,
                                panelClass: ['snackbar-success']
                            });
                        }


                    },
                    error => {
                        this.isLoadingTable = false;
                        console.log('Error: ' + error);
                    }
                );
            }
        });
    }

    /**
     * Obtiene un log del proceso
     * @param id ID del proceso
     * @param name Nombre del proceso
     * @param type 'out' ' error' según el log que queramos
     */
    public getProcessLog(id: string, name: string, type: string) {
        this.apiService.getProcessLog({id: id, type: type})
            .subscribe((response) => {
                    if (!response['body'] || response['status'] !== 200) {
                        // ERROR
                        this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                            horizontalPosition: 'end',
                            verticalPosition: 'bottom',
                            duration: 3000,
                            panelClass: ['snackbar-warn']
                        });
                    } else {
                        // Correcto, descargo el fichero. El body ya viene como Blob gracias a la petición al api
                        const fileName = UtilsService.getFileNameFromResponseContentDisposition(response);
                        UtilsService.saveFile(response['body'], name + '_' + fileName + '.txt');
                    }
                },
                error => {
                    console.log('Error: ' + error);
                }
            );
    }

    /**
     * Obtiene la información de la máquina
     */
    public getMachineInfo() {
        this.apiService.getMachineInfo().subscribe(
            (response: HttpResponse<DefaultResponse>) => {
                if (!response['body'] || response['status'] !== 200) {
                    // ERROR
                    this.snackBar.open('Error al consultar al API: ' + response['error']['error_message'], '', {
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                        duration: 3000,
                        panelClass: ['snackbar-warn']
                    });
                } else {
                    const body = response['body'];

                    // Todo OK
                    this.machineInfo = body.data;
                }
            },
            error => {
                console.log('Error: ' + error);
            }
        );
    }
}
