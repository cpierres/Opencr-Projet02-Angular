import {SerieData} from "./SerieData";

/**
 * Structure parente : DetailGraph.ts
 * Cette structure intermédiaire est intéressante, pour représenter différentes séries sur
 * le même graphe. Par exemple, actuellement le besoin pour le LineChart de DetailComponent est
 * de représenter une seule série (une seule ligne pour l'évolution du nombre de médailles par année de
 * participation).
 * Mais on ne veut pas restreindre la capacité du graphe à une seule ligne.
 *
 * Structure attendue par le composant ngx-charts-line-chart du composant DetailGraphComponent.
 * Chaque SerieName représente une série donnée dans le graphe (une ligne pour un line-charts).
 * Exemple :
 * - name = France (pays) et un 2ème SerieName 'Nombre moyen des médailles pour les autres pays'
 * - puis les données de séries : SerieData[]
 */
export interface SerieName {
  name: string; // nom d'une série. Par exemple, un pays (France ou Allemagne), une catégorie...
  series: SerieData[]; //Données de la série. Chaque élément de ce tableau représente un point de données
                       //(valeur et éventuellement une date ou un autre indicateur) sur le graphe

}
