import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartPie} from "../../../core/models/stats/ChartPie";

/**
 * Le composant GlobalGraphComponent est un composant Angular standalone utilisé pour afficher
 * une représentation graphique des données sous la forme d'un graphique à secteurs. Il intègre
 * le module NgxChartsModule pour gérer le rendu et les animations des graphiques et fournit
 * une fonctionnalité pour émettre des événements de sélection.
 *
 * Ce composant est conçu pour être configurable et communique avec son composant parent via des liaisons
 * d'entrée et des événements de sortie.
 *
 * Dépendances :
 * - BrowserAnimationsModule : requis pour les animations utilisées par NgxCharts.
 * - NgxChartsModule : fournit une prise en charge des graphiques.
 */
@Component({
  selector: 'app-global-graph',
  standalone: true,
  imports: [
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule,
  ],
  templateUrl: './global-graph.component.html',
  styleUrls: ['./global-graph.component.scss'],
  providers: []
})
export class GlobalGraphComponent implements OnInit {

  @Input()
  medalPieData: ChartPie[]  | null | undefined = [
    {
      "name": "Pays 1",
      "value": 96,
      "extra": {
        "id": 1
      }
    },
    {
      "name": "Pays 2",
      "value": 54,
      "extra": {
        "id": 2
      }
    }
  ]


  // Événement de sortie : pour transmettre l'élément sélectionné
  @Output() sliceSelected = new EventEmitter<ChartPie>();

  constructor() {
  }

  ngOnInit(): void {
    //console.log('GlobalGraphComponent.ngOnInit');
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
