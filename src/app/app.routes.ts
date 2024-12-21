import { Routes } from '@angular/router';
import { UserInfoFormComponent } from './components/user-info-form/user-info-form.component';
import { macrosResolver } from './components/user-info-form/resolver/macros.resolver';
import { foodListResolver } from './components/user-info-form/resolver/food-list.resolver';

export const routes: Routes = [
    {
        path: '',
        component: UserInfoFormComponent,
    },
    {
        path: 'food-table',
        loadComponent: () => import('./components/food-table/food-table.component').then((m) => m.FoodTableComponent),
        resolve: {
            macros: macrosResolver,
            foodList: foodListResolver,
        }
    }
];
