import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {OlympicCountryDetailComponent} from "./pages/olympic-country-detail/olympic-country-detail.component";
import {AppRoutes} from "./app.routes";

const routes: Routes = [
  {path: '', redirectTo: AppRoutes.OLYMPIC_STATS, pathMatch: 'full'},
  {path: AppRoutes.OLYMPIC_STATS, component: HomeComponent},
  {path: AppRoutes.OLYMPIC_COUNTRY_DETAIL, component: OlympicCountryDetailComponent},
  {path: AppRoutes.NOT_FOUND, component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
