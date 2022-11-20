import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

/**
 * Sobrescribo la clase original para añadir los textos en español
 */
@Injectable()
export class MatPaginatorIntlSpanish extends MatPaginatorIntl {
    itemsPerPageLabel = 'Elementos por página:';
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';
}
