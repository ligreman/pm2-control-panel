import { MatPaginatorIntl } from '@angular/material';

/**
 * Sobrescribo la clase original para añadir los textos en español
 */
export class matPaginatorIntlSpanish extends MatPaginatorIntl {
    itemsPerPageLabel = 'Elementos por página:';
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';
}
