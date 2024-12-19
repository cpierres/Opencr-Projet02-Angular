import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {OlympicCountryDetailComponent} from "./pages/olympic-country-detail/olympic-country-detail.component";

const routes: Routes = [
  {path: '', redirectTo: 'olympicstats', pathMatch: 'full'},
  {path: 'olympicstats', component: HomeComponent},
  {path: 'olympicstats/:id', component: OlympicCountryDetailComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
