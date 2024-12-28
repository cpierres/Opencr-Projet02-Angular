import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartPie} from "../../../core/models/stats/ChartPie";
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-olympic-global-graph',
  standalone: true,
  imports: [
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule,
  ],
  templateUrl: './olympic-global-graph.component.html',
  styleUrls: ['./olympic-global-graph.component.scss'],
  providers: [
    LoadingService
  ]
})
export class OlympicGlobalGraphComponent implements OnInit {

  @Input()
  medalPieData: ChartPie[]  | null | undefined;

  // Événement de sortie : pour transmettre l'élément sélectionné
  @Output() sliceSelected = new EventEmitter<ChartPie>();

  constructor() {
  }

  ngOnInit(): void {
    //console.log('OlympicGlobalGraphComponent.ngOnInit');
  }

  /**
   *  Gestion de l'événément de sélection d'un slice de pie
   *  à transmettre en output du composant parent
   * @param event
   */
  onSelectSlicePie(event: ChartPie): void {
    // Vous pouvez effectuer des traitements supplémentaires si nécessaire ici
    //console.log('Slice sélectionné :', event);
    // Émettre l'événement au composant parent
    this.sliceSelected.emit(event);
  }
}
