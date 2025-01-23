/**
 * Structure de base attendue par les composants ngx-charts.
 *
 * Structure parente : SerieName.ts ou GlobalGraph.ts
 *
 * Une SerieName contient plusieurs SerieData.
 * Exemple de SerieData pour le composant DetailGraphComponent:
 * - name = 2020 (une année) ou bien France (un pays)
 * - value = 125 (nombre de médailles pour cette année)
 * - extra n'est pas utile
 *
 * Ci-dessous, structure de données attendue par le composant GlobalGraphComponent (ngx-charts-pie-chart ou
 * ngx-charts-pie-chart).La donnée `extra` inclut un objet `id` du pays est indispensable pour le drill-down.
 * Exemple :
 * - name = France (Pays)
 * - value = 200
 * - extra = {id=1} (id du pays à zoomer)
 */
export interface SerieData {
  name: string;
  value: number;
  extra?: {
    id: number;
  };
}
