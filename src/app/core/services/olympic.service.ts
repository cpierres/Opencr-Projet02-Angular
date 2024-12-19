import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";
import {StatsForCountry} from "../models/stats/StatsForCountry";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private subject = new BehaviorSubject<Olympic[]>([]);
  olympics$ = this.subject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  /**
   * Les données sont mises en cache dans le flux du BehaviorSubject via tap
   * afin d'avoir une gestion d'état simple
   * @private
   */
  private loadInitialData(): void {
    console.log('appel backend');
    this.http.get<Olympic[]>(this.olympicUrl)
      .pipe(
        catchError(err => {
          const message = "Impossible de charger les données Olympiques";
          console.log(message, err);
          return throwError(err);
        }),
        tap(olympics => this.subject.next(olympics))
      ).subscribe();
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
   * Retourne les données statistiques d'un seul pays à partir de son identifiant.
   *
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les stats du pays, y compris son id et son nom.
   */
  getOlympicStatsForCountryId(id: number): Observable<StatsForCountry | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
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

}
