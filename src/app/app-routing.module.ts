import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {OlympicCountryDetailComponent} from "./pages/olympic-country-detail/olympic-country-detail.component";
import {AppRoutes} from "./app.routes";

/**
 * Représente la configuration de routage de l'application.
 *
 * La variable `routes` est un tableau de configurations d'itinéraires utilisé pour définir les
 * chemins de navigation et leurs composants correspondants pour l'application.
 *
 * - route `''`: redirige vers l'itinéraire par défaut défini par `AppRoutes.OLYMPIC_STATS` si aucun chemin spécifique
 * n'est fourni.
 * - route `AppRoutes.OLYMPIC_STATS`: charge le `HomeComponent` pour afficher les statistiques olympiques.
 * - route `AppRoutes.OLYMPIC_COUNTRY_DETAIL`: charge le `OlympicCountryDetailComponent` pour afficher les détails sur
 * les performances d'un pays spécifique.
 * - route `AppRoutes.NOT_FOUND`: charge le `NotFoundComponent` pour gérer les itinéraires non valides ou inexistants.
 */
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
