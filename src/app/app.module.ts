import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {
  OlympicGlobalGraphComponent
} from "./component/olympic-dashboard-stats/olympic-global-graph/olympic-global-graph.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {LoadingComponent} from "./component/fwk/loading/loading.component";
import {LoadingService} from "./core/services/loading.service";
import {BoxStatsComponent} from "./component/olympic-dashboard-stats/box-stats/box-stats.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, ],
  imports: [BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OlympicGlobalGraphComponent,
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule, // Module de ngx-charts pour les graphiques
    LoadingComponent, BoxStatsComponent
  ],
  providers: [LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
