import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, delay, finalize, map, Observable, take, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";
import {MedalPieData} from "../models/stats/MedalPieData";
import {SeriesLine} from "../models/stats/SeriesLine";
import {LoadingService} from "./loading.service";
import {Stats} from "../models/stats/Stats";
import {MessagesService} from "./messages.service";

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private subject = new BehaviorSubject<Olympic[]>([]);
  olympics$ = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService) {
    /*
    Faire le subscribe dans le constructor permet de renseigner effectivement le cache, rendant les données
    accessibles à tout moment via l'observable olympics$, sans besoin de refaire une requête HTTP.
    Tous les appels de service qui se reposent sur olympics$ sont ainsi assurés que le chargement de données est
    terminé.
    Si besoin, la méthode loadInitialData() pourrait être utilisée dans d'autres
    endroits de l'appli (par exemple sur un bouton Refresh pour obtenir les dernières données actualisées).
    Actuellement, il s'agit d'une source de données statique de toute façon.
    Attention dans ce dernier cas, les développeurs ne devront pas oublier de faire le take(1) afin de
    limiter la souscription à un seul événement pour empêcher des écoutes inutiles ou récurrentes,
    et terminer la souscription proprement (en évitant ainsi des fuites mémoires).
    Pour prévenir de cette mauvaise utilisation potentielle, j'ai refactorisé vers une méthode
    refreshDataCache() public qui s'occupe de la gestion du BehaviorObject.
     */
    console.log('OlympicService constructor (Singleton) ; appel de refreshDataCache() => loadInitialData');
    this.refreshDataCache();
  }

  /**
   * Rafraichit les données dans le cache (en s'assurant de bien gérer le BehaviorSubject sous-jacent)
   *
   * @return {void} This method does not return any value but reloads the data and logs output for debugging.
   */
  public refreshDataCache() {
     this.loadInitialData().pipe(
      //switchMap pour ne garder qu'un flux rempli et éviter l'affichage des 0 avant vraies données sur réseau lent
      //switchMap(() => this.subject.pipe(filter(data => !!data && data.length > 0))),
      take(1)// Prend juste la 1ère donnée et se complète automatiquement (=> unsubscribe)
      // On met take(1) ici et non pas dans loadInitialData pour plus de flexibilité
    ).subscribe(data => console.log('OlympicService.refreshDataCache() ; Data reçues dans subscribe : ', data));
  }

  /**
   * Les données sont mises en cache dans le BehaviorSubject via tap
   * afin d'avoir une gestion d'état simple et éviter des appels http get trop nombreux.
   * Les données sont ainsi accessibles à tout moment via l'observable olympics$.
   * La méthode {@link refreshDataCache()} est plus "safe" car elle récupère le flux et limite à une lecture en
   * évitant d'enregistrer trop d'éléments (inutiles) dans le cache et en fermant .
   * QUESTION : j'hésite à mettre cette méthode de service en public car elle est susceptible d'une mauvaise
   * utilisation si le développeur oublie de faire un take(1). De plus, si elle est appelée intempestivement
   * plusieurs fois sans le take(1), elle peut déclencher des écoutes multiples non souhaitées.
   *
   */
  loadInitialData(): Observable<Olympic[]> {
    console.log('OlympicService.loadInitialData() : appel backend')
    this.loadingService.loadingOn();
    //return this.http.get<Olympic[]>('FichierInexistant.json')//pour simuler 404
    return this.http.get<Olympic[]>(this.olympicUrl)
      .pipe(
        //filter(data => data.length > 0),
        delay(3000), // délai de 3 secondes pour test loading
        catchError(err => {
          const message = "Impossible de charger les données Olympiques";
          this.messagesService.showErrors(message);
          console.error(message, err);//à remplacer par un log serveur (elastik stack, sentry) dans la vraie vie
          return throwError(err);
        }),
        tap(olympics => {
          console.log('OlympicService.loadInitialData() tap : data (mise en cache dans le BehaviorSubject)', olympics);
          this.subject.next(olympics)//dès lors qu'on inscrit le flux Observable de http.get vers le cache
                                     //BehaviorSubject, l'observable olympics$ en variable membre est associé à ce sujet
                                     //en tant que simple Observable (sans possibilité de le modifier)
                                     //Toutes nos méthodes de service se reposent sur olympics$ (non modifiable)
        }),
        finalize(()=>this.loadingService.loadingOff())
      );
  }

  getOlympics() {
    return this.olympics$;
  }

  /**
   * statistiques sur le nombre de pays ayant participé
   * et le nombre d'années différentes de participations (=nb de JOs)
   * Ici je n'ai pas défini d'interface pour la structure du retour
   * car c'est simple.
   * @deprecated utiliser à la place {@link getHomeStats()} qui est plus évolutive
   * @returns Un Observable incluant countYearsJo (le nombre de pays participants) et
   *          countCountries (nombre d'années uniques de participations).
   */
  getParticipationStats(): Observable<{ countYearsJo: number, countCountries: number }> {
    console.log('appel OlympicService.getParticipationStats()');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const totalCountries = olympics.length; // Chaque entrée correspond à un pays
        const yearSet = new Set<number>(); // Utilisation d'un Set pour conserver les années uniques

        // Remplir le Set avec les différentes années de participation
        olympics.forEach((o: Olympic) => {
          o.participations.forEach(p => yearSet.add(p.year));
        });

        const totalYears = yearSet.size; // Nombre d'années uniques
        return {countYearsJo: totalYears, countCountries: totalCountries};
      }),
      tap(stats => console.log('OlympicService.getParticipationStats data', stats))
    );
  }

  /**
   * Statistiques à présenter sur le dashboard principal (Home)
   * Pour l'instant, il y a deux statistiques :
   * - Nombre de JOs
   * - Nombre de pays
   * La structure est évolutive. Il suffit d'ajouter une statistique dans le tableau retourné
   * et elles seront dynamiquement affichées dans le composant d'affichage réutilisable.
   * @returns Un Observable incluant un tableau de Stat avec le nombre de pays participants et
   *          le nombre d'années uniques de participations.
   */
  getHomeStats(): Observable<Stats> {
    console.log('appel OlympicService.getHomeStats()');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const totalCountries = olympics.length; // Chaque entrée correspond à un pays
        const yearSet = new Set<number>(); // Utilisation d'un Set pour conserver les années uniques

        // Remplir le Set avec les différentes années de participation
        olympics.forEach((o: Olympic) => {
          o.participations.forEach(p => yearSet.add(p.year));
        });

        const totalYears = yearSet.size; // Nombre d'années uniques
        return {name:'Médailles par pays',stats:[{label: 'Nombre de JOs', value: totalYears}, {label: 'Nombre de pays', value: totalCountries}]};
        //return {name:'Médailles par pays',stats:[{label: 'Nombre de JOs', value: totalYears}, {label: 'Nombre de pays', value: totalCountries},{label: 'stat3', value: 123}]};
      }),
      tap(stats => console.log('OlympicService.getHomeStats data', stats))
    );
  }

  getMedalsCountByCountry(): Observable<{ id: number, country: string, medalsCount: number }[]> {
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
    console.log('appel OlympicService.getMedalsPieData()');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) =>
        olympics.map((o: Olympic) => ({
          name: o.country,
          value: o.participations.reduce((accumulator, current) => accumulator + current.medalsCount, 0), // Total des médailles
          extra: {id: o.id}
        }))
      ),
      tap(data => {
        console.log('OlympicService.getMedalsPieData tap data', data)
      })
    );
  }

  /**
   * Données statistiques d'un seul pays à partir de son identifiant.
   *
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les stats du pays, y compris son id et son nom.
   */
  getOlympicStatsOfCountryId(id: number): Observable<Stats | undefined> {
    console.log('appel OlympicService.getOlympicStatsForCountryId(' + id + ')');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find((o: Olympic) => o.id === id);
        return country
          ? {
            //id: country.id,
            name: country.country,stats:[
              {label:'Nombre de participations',value:country.participations.length},
              {label:'Nombre total de médailles',value:country.participations.reduce((acc, curr) => acc + curr.medalsCount, 0)},
              {label:'Nombre total d\'athlètes',value:country.participations.reduce((acc, curr) => acc + curr.athleteCount, 0)}
            ]
          }
          : undefined;
      }),
      tap(data => console.log('OlympicService.getOlympicStatsOfCountryId => data : ', data))
    );
  }

  /**
   * Données d'un seul pays à partir de son identifiant.
   *
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les données du pays correspondant.
   */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.find((o: Olympic) => o.id === id))
    );
  }

  /**
   * Récupère les données de la série de médailles (pour le graphe Line) pour un événement olympique (country) spécifique.
   *
   * @param {number} olympicId - ID de l'Olympic
   * @return {Observable<SeriesLine[]>} Observable émettant un array d'objets SeriesLine
   * contenant les informations de médaille pour le country/olympic
   */
  getMedalsSeriesLineByOlympic(olympicId: number): Observable<SeriesLine[]> {
    console.log('appel OlympicService.getMedalsSeriesLineByOlympic(' + olympicId + ')');
    return this.olympics$.pipe(
      map((data) => {
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
        console.log('OlympicService.getMedalsSeriesLineByOlympic => SeriesLine[]', seriesLine);
        return [seriesLine]; // Retourner un tableau contenant SeriesLine
      })
    );
  }

}
