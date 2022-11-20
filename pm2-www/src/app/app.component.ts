import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ApiService } from '@app/core/http/api.service';
import { api, version } from '@env/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    currentDate = new Date();
    version = version;
    options: string[] = api.servers;
    serverControl = new UntypedFormControl();
    filteredOptions: Observable<string[]>;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        // Pongo por defecto el primer servidor
        this.serverControl.setValue(api.servers[0]);

        // Cambio de valor del input
        this.filteredOptions = this.serverControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    _changeServer(value: string) {
        this.apiService.setApiUrl(value);
    }
}
