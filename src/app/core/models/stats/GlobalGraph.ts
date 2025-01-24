import {SerieData} from "./SerieData";

/**
 * Pour le GlobalGraphComponent, il n'y a qu'un seul tableau de série de données.
 * Note : pour le DetailGraphComponent, on préfère prévoir potentiellement plusieurs (noms) de séries. C'est pourquoi,
 * il y a une structure intermédiaires SerieName.
 * Cet intermédiaire est inutile pour le GlobalGraphComponent et on pointe directement sur les séries de datas.
 * Structure de données attendue par le composant ngx-charts-pie-chart qui est inclus dans notre
 * composant GlobalGraphComponent.
 */
export interface GlobalGraph {
  serieDatas: SerieData[]; // Données adaptées pour un graphique d'accueil à une seule série
}
