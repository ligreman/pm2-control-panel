import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { Injectable } from "@angular/core";

/**
 * Sobrescribo la clase original para añadir los textos en español
 */
@Injectable()
export class matPaginatorIntlSpanish extends MatPaginatorIntl {
    itemsPerPageLabel = 'Elementos por página:';
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';
}
