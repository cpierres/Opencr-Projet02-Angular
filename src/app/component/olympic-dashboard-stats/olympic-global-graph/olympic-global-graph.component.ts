import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AppRoutes} from "../../../app.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MedalPieData} from "../../../core/models/stats/MedalPieData";
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-olympic-global-graph',
  standalone: true,
  imports: [
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule,
  ],
  templateUrl: './olympic-global-graph.component.html',
  styleUrls: ['./olympic-global-graph.component.scss', '../olympic-shared-graph.component.scss'],
  providers: [
    LoadingService
  ]
})
export class OlympicGlobalGraphComponent implements OnInit {

  @Input()
  medalPieData: MedalPieData[]  | null | undefined;

  // Événement de sortie : pour transmettre l'élément sélectionné
  @Output() sliceSelected = new EventEmitter<MedalPieData>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log('OlympicGlobalGraphComponent.ngOnInit');
  }

   // Gestionnaire local de l'événement "select"
  onSelectSlicePie(event: MedalPieData): void {
    // Vous pouvez effectuer des traitements supplémentaires si nécessaire ici
    console.log('Slice sélectionné :', event);
    // Émettre l'événement au composant parent
    this.sliceSelected.emit(event);
  }
}
