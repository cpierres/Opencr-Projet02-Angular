import {Component, Input} from '@angular/core';
import {BoxStats} from "../../../core/models/stats/BoxStats";
import {NgForOf, NgIf} from "@angular/common";


/**
 * BoxStatsComponent est un composant Angular standalone conçu pour afficher des informations statistiques
 * de manière structurée et visuelle. Il accepte les données via la propriété d'entrée `boxStats`, qui
 * définit les statistiques à afficher.
 *
 * Le composant restitue les statistiques fournies de manière dynamique dans son modèle et applique
 * tous les styles associés à partir du fichier SCSS lié.
 *
 * Le composant
 * - Utilise les directives NgForOf et NgIf d'Angular pour parcourir et afficher conditionnellement le contenu.
 * - Accepte une propriété d'entrée `boxStats` qui détermine le contenu des statistiques.
 *
 * Entrée :
 * - `boxStats` : un objet de type `BoxStats`, qui contient un titre et un tableau d'éléments statistiques `BoxStat`.
 * Chaque élément statistique comprend un `label` et une `value`. L'entrée est nullable et peut être indéfinie.
 */
@Component({
  selector: 'app-box-stats',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './box-stats.component.html',
  styleUrl: './box-stats.component.scss'
})
export class BoxStatsComponent {
  @Input()
  boxStats: BoxStats | null | undefined = {
    name: 'Titre stats',
    stats: [
      { label: 'stat1', value: 10 },
      { label: 'stat2', value: 20 },
      { label: 'stat3', value: 20 }
    ]
  };
}
