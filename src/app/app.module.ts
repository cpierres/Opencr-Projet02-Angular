import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {
  GlobalGraphComponent
} from "./component/dashboard-stats/global-graph/global-graph.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {LoadingComponent} from "./component/fwk/loading/loading.component";
import {LoadingService} from "./core/services/loading.service";

import {BoxStatsComponent} from "./component/dashboard-stats/box-stats/box-stats.component";
import {MessagesService} from "./core/services/messages.service";

import { ILoadingServiceToken, IMessagesServiceToken } from './core/services/tokens';
import {MessagesComponent} from "./component/fwk/messages/messages.component";
import {OlympicService} from "./core/services/olympic.service";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, ],
  imports: [BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GlobalGraphComponent,
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule, // Module de ngx-charts pour les graphiques
    LoadingComponent,
    BoxStatsComponent,
    MessagesComponent
  ],
  providers: [
    MessagesService,
    LoadingService,
    OlympicService,
    { provide: ILoadingServiceToken, useClass: LoadingService },   // Direct service registration
    { provide: IMessagesServiceToken, useClass: MessagesService }  // Mapping abstraction -> implémentation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
