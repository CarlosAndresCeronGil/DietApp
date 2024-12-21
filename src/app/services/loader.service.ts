import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    generalLoader = signal(false);
    tableLoader = signal(false);

    showGeneralLoader() {
        this.generalLoader.set(true);
    }

    hideGeneeralLoader() {
        this.generalLoader.set(false);
    }

    showTableLoader() {
        this.tableLoader.set(true);
    }

    hideTableLoader() {
        this.tableLoader.set(false);
    }
}