import {Component, Input, OnInit} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import {NgIf} from "@angular/common";
import {DetailGraph} from "../../../core/models/stats/DetailGraph";

/**
 * DetailGraphComponent est un composant Angular standalone utilisé pour afficher une visualisation
 * graphique détaillée à l'aide du LineChartModule. Il est configurable via une propriété d'entrée
 * chartLineData pour afficher des ensembles de données spécifiques avec des étiquettes pour les axes x et y.
 *
 * Le composant comprend :
 * - Un sélecteur `app-detail-graph` pour une intégration facile dans les modèles.
 *
 * - Dépendance à des modules tels que NgIf pour les directives structurelles et LineChartModule pour le rendu graphique.
 * - Style via un fichier SCSS associé et un template défini pour la structure.
 *
 * Propriétés d'entrée :
 * - chartLineData : accepte un objet DetailGraph ou undefined/null. Fournit les données nécessaires au rendu
 * du graphique en courbes, y compris les étiquettes des axes x et y ainsi que les données de série pour le traçage.
 * La structure de données permet la personnalisation de plusieurs séries de points dans le graphique.
 */
@Component({
  selector: 'app-detail-graph',
  standalone: true,
  imports: [
    NgIf,
    LineChartModule
  ],
  templateUrl: './detail-graph.component.html',
  styleUrls: ['./detail-graph.component.scss'],
  providers: []
})

export class DetailGraphComponent implements OnInit {
  @Input() chartLineData: DetailGraph | undefined | null = {
    xAxisLabel: 'Axe des X',
    yAxisLabel: 'Axe des Y',
    serieNames: [
      {
        name: 'France',
        series: [
          {name: '2012', value: 100},
          {name: '2016', value: 200},
          {name: '2021', value: 210},
          {name: '2024', value: 220}
        ]
      },
      // {
      //   name: 'Moyenne autres pays',
      //   serieNames: [
      //     {name: '2012', value: 120},
      //     {name: '2016', value: 180},
      //     {name: '2021', value: 200},
      //     {name: '2024', value: 190}
      //   ]
      // },
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
    //console.log('DetailGraphComponent.ngOnInit');
  }
}
