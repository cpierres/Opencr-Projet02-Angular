import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";
import {StatsForCountry} from "../models/stats/StatsForCountry";
import {MedalPieData} from "../models/stats/MedalPieData";
import {SeriesLine} from "../models/stats/SeriesLine";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private subject = new BehaviorSubject<Olympic[]>([]);
  olympics$ = this.subject.asObservable();

  constructor(private http: HttpClient) {
    //this.loadInitialData();
  }

  /**
   * Les données sont mises en cache dans le flux du BehaviorSubject via tap
   * afin d'avoir une gestion d'état simple
   * @private
   */
  loadInitialData() {
    console.log('appel backend');
    return this.http.get<Olympic[]>(this.olympicUrl)
      .pipe(
        catchError(err => {
          const message = "Impossible de charger les données Olympiques";
          console.log(message, err);
          return throwError(err);
        }),
        tap(olympics => this.subject.next(olympics))
      );
  }

  getOlympics() {
    return this.olympics$;
  }

  /**
   * Retourne les statistiques sur le nombre de pays ayant participé
   * et le nombre d'années différentes de participations (=nb de JOs)
   *
   * @returns Un Observable contenant le nombre de pays participants et
   *          le nombre d'années uniques de participations.
   */
  getParticipationStats(): Observable<{ countYearsJo: number, countCountries: number }> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const totalCountries = olympics.length; // Chaque entrée correspond à un pays
        const yearSet = new Set<number>(); // Utilisation d'un Set pour conserver les années uniques

        // Remplir le Set avec toutes les années de participation
        olympics.forEach((o: Olympic) => {
          o.participations.forEach(p => yearSet.add(p.year));
        });

        const totalYears = yearSet.size; // Nombre d'années uniques
        return { countYearsJo: totalYears, countCountries: totalCountries  };
      })
    );
  }

  getMedalsCountByCountry(): Observable<{id:number, country: string, medalsCount: number}[]> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) =>
        olympics.map((o: Olympic) => ({
          id: o.id,
          country: o.country, // Récupère le nom du pays
          medalsCount: o.participations.reduce((accumulator, current) => accumulator + current.medalsCount, 0), // Total des médailles
        }))
      )
    );
  }

  /**
   * Traite les données des Jeux olympiques pour créer une liste d'objets représentant
   * la distribution des médailles par pays.
   *
   * @return {Observable<MedalPieData[]>} Un observable émettant un tableau d'objets MedalPieData,
   * qui correspondent aux données requises par le composant ngx-charts-pie-chart
   */
  getMedalsPieData(): Observable<MedalPieData[]> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) =>
        olympics.map((o: Olympic) => ({
          name: o.country,
          value: o.participations.reduce((accumulator, current) => accumulator + current.medalsCount, 0), // Total des médailles
          extra: {id: o.id}
        }))
      )
    );
  }

  /**
   * Retourne les données statistiques d'un seul pays à partir de son identifiant.
   *
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les stats du pays, y compris son id et son nom.
   */
  getOlympicStatsForCountryId(id: number): Observable<StatsForCountry | undefined> {
        return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        console.log('getOlympicStatsForCountryId :', olympics);
        const country = olympics.find((o: Olympic) => o.id === id);
        return country
          ? {
            id: country.id,
            country: country.country,
            participationsCount: country.participations.length,
            medalsCount: country.participations.reduce((acc, curr) => acc + curr.medalsCount, 0),
            athletes: country.participations.reduce((acc, curr) => acc + curr.athleteCount, 0)
          }
          : undefined;
      })
    );
  }

  /**
   * Retourne les données d'un seul pays à partir de son identifiant.
   *
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les données du pays correspondant.
   */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.find((o: Olympic) => o.id === id))
    );
  }

  getMedalsSeriesLineByOlympic(olympicId: number): Observable<SeriesLine[]> {
    return this.olympics$.pipe(
      map((data) => {
        console.log('getMedalsSeriesLineByOlympic : ', data);
        // Recherche de l'Olympic au param olympicId
        const olympic: Olympic | undefined = data.find((item: Olympic) => item.id === olympicId);
        if (!olympic) {
          throw new Error(`Aucun Olympic trouvé pour l'ID ${olympicId}`);
          //return []
        }
        // Construction de l'objet SeriesLine
        const seriesLine: SeriesLine = {
          name: olympic.country,
          series: olympic.participations.map(part => ({
            name: `${part.year}`, // Convertir l'année en chaîne
            value: part.medalsCount
          }))
        };
        console.log(seriesLine);
        return [seriesLine]; // Retourner un tableau contenant SeriesLine
      })
    );
  }

}
