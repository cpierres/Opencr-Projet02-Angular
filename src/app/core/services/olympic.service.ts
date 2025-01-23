import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, delay, finalize, map, Observable, take, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";
import {GlobalGraph} from "../models/stats/GlobalGraph";
import {LoadingService} from "./loading.service";
import {BoxStats} from "../models/stats/BoxStats";
import {MessagesService} from "./messages.service";
import {DetailGraph} from "../models/stats/DetailGraph";
import {SerieData} from "../models/stats/SerieData";

/**
 * Service métier destiné à gérer les données liées aux Jeux Olympiques (Olympics). Il utilise un BehaviorSubject pour
 * mettre en cache localement les données, afin de limiter les requêtes HTTP et de fournir un accès centralisé et
 * réactif aux données.
 * Ce service inclut plusieurs fonctionnalités, telles que le calcul des données statistiques pour un tableau de bord
 * ou des graphiques.
 */
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
    Attention dans ce dernier cas, les développeurs ne devront pas oublier de faire le take(1) afin de
    limiter la souscription à un seul événement pour empêcher des écoutes inutiles ou récurrentes,
    et terminer la souscription proprement (en évitant ainsi des fuites mémoires).
    Pour prévenir de cette mauvaise utilisation potentielle, j'ai refactorisé vers une méthode
    refreshDataCache() public qui s'occupe de la gestion du BehaviorObject.
     */
    //console.log('OlympicService constructor (Singleton) ; appel de refreshDataCache() => loadInitialData');
    this.refreshDataCache();
  }

  /**
   * Rafraichit les données dans le cache (en s'assurant de bien gérer le BehaviorSubject sous-jacent)
   * Utiliser cette méthode de préférence pour actualiser le flux
   * @return {void} Cette méthode ne renvoie aucune valeur mais recharge les données et enregistre la sortie pour le débogage
   */
  public refreshDataCache() {
    // méthode 1
    //  this.loadInitialData().pipe(
    //   take(1)// Prend juste la 1ère donnée et se complète automatiquement (=> unsubscribe)
    //   // On met take(1) ici et non pas dans loadInitialData pour plus de flexibilité
    // ).subscribe(data => console.log('OlympicService.refreshDataCache() ; Data reçues dans subscribe : ', data));

    //solution 2 pour loading (moins intrusive)
    this.loadingService.showLoaderUntilCompleted(//"ajoute/greffe" au cycle de vie de l'observable en paramètre la gestion du loading
      this.loadInitialData().pipe(
        take(1)// Prend juste la 1ère donnée et se complète automatiquement (=> unsubscribe)
        // On met take(1) ici et non pas dans loadInitialData pour plus de flexibilité
      )
    ).subscribe(data => console.log('OlympicService.refreshDataCache() ; Data reçues dans subscribe : ', data));

  }

  /**
   * Les données sont mises en cache dans le BehaviorSubject via tap
   * afin d'avoir une gestion d'état simple et éviter des appels http get trop nombreux.
   * Les données sont ainsi accessibles à tout moment via l'observable olympics$.
   * La méthode {@link refreshDataCache()} est plus "safe" car elle récupère le flux et limite à une lecture en
   * évitant d'enregistrer trop d'éléments (inutiles) dans le cache et en fermant .
   * QUESTION : j'hésite à mettre cette méthode de service en private car elle est susceptible d'une mauvaise
   * utilisation si le développeur oublie de faire un take(1). De plus, si elle est appelée intempestivement
   * plusieurs fois sans le take(1), elle peut déclencher des écoutes multiples non souhaitées.
   */
  loadInitialData(): Observable<Olympic[]> {
    //console.log('OlympicService.loadInitialData() : appel backend')
    //this.loadingService.loadingOn();//SOLUTION 1 pour LOADING
    //return this.http.get<Olympic[]>('FichierInexistant.json')//pour simuler 404
    return this.http.get<Olympic[]>(this.olympicUrl)
      .pipe(
        //delay(2000), // délai de 2 secondes pour test affichage du loading
        catchError(err => {
          const message = "Impossible de charger les données Olympiques";
          //affichage de l'erreur pour l'utilisateur
          this.messagesService.showErrors(message);//service réactif partagé
          //Temporaire : Affichage de l'erreur technique dans la console
          //TODO à remplacer par un log serveur (elastik stack, sentry) dans la vraie vie
          console.error(message, err);
          return throwError(err);
        }),
        tap(olympics => {
          //console.log('OlympicService.loadInitialData() tap : data (mise en cache dans le BehaviorSubject)', olympics);
          this.subject.next(olympics)//dès lors qu'on inscrit le flux Observable de http.get vers le cache
                                     //BehaviorSubject, l'observable olympics$ en variable membre est associé à ce sujet
                                     //en tant que simple Observable (sans possibilité de le modifier)
                                     //Toutes nos méthodes de service se reposent sur olympics$ (non modifiable)
        }),
        //finalize(()=>this.loadingService.loadingOff())  //SOLUTION 1 pour LOADING
      );
  }

  /**
   * Statistiques à présenter sur le dashboard principal (Home)
   * Pour l'instant, il y a deux statistiques :
   * - Nombre de JOs
   * - Nombre de pays
   * La structure est évolutive. Il suffit d'ajouter une statistique dans le tableau retourné
   * et elles seront dynamiquement affichées dans le composant d'affichage réutilisable.
   * @returns Un Observable incluant un tableau de BoxStat avec le nombre de pays participants et
   *          le nombre d'années uniques de participations.
   */
  getHomeStats(): Observable<BoxStats> {
    //console.log('appel OlympicService.getHomeStats()');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const totalCountries = olympics.length; // Chaque entrée correspond à un pays
        const yearSet = new Set<number>(); // Utilisation d'un Set pour conserver les années uniques

        // Remplir le Set avec les différentes années de participation
        olympics.forEach((o: Olympic) => {
          o.participations.forEach(p => yearSet.add(p.year));
        });

        const totalYears = yearSet.size; // Nombre d'années uniques
        return {
          name: 'Médailles par pays',
          stats: [{label: 'Nombre de JOs', value: totalYears}, {label: 'Nombre de pays', value: totalCountries}]
        };
      }),
      tap(stats => {
        //console.log('OlympicService.getHomeStats data', stats)
      })
    );
  }

  /**
   * Traite les données des Jeux olympiques pour créer une liste d'objets représentant
   * la distribution des médailles par pays.
   *
   * @return {Observable<GlobalGraph>} Un observable émettant un GlobalGraph, contenant SerieData[]),
   * qui correspondent aux données requises composant ngx-charts-pie-chart
   */
  getMedalsGlobalGraph(): Observable<GlobalGraph> {
    //console.log('appel OlympicService.getMedalsGlobalGraph()');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        // Construction des objets SerieData[] pour les données du pie chart
        const datas: SerieData[] = olympics.map((o: Olympic) => ({
          name: o.country,
          value: o.participations.reduce(
            (accumulator, current) => accumulator + current.medalsCount,
            0
          ), // Total des médailles
          extra: { id: o.id }
        }));

        // Construction de l'objet GlobalGraph à retourner
        return {
          serieDatas: datas
        } as GlobalGraph;
      }),
      tap(data => {
        //console.log('OlympicService.getMedalsGlobalGraph data', data)
      })
    );
  }

  /**
   * Données statistiques d'un seul pays à partir de son identifiant.
   * @param id L'identifiant du pays.
   * @returns Un Observable contenant les stats du pays, y compris son id et son nom.
   */
  getOlympicStatsOfCountryId(id: number): Observable<BoxStats | undefined> {
    console.log('appel OlympicService.getOlympicStatsOfCountryId(' + id + ')');
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find((o: Olympic) => o.id === id);
        if (country) {
          const totalParticipations = country.participations.length;
          const totalAthletes = country.participations.reduce((acc, curr) => acc + curr.athleteCount, 0);
          const totalMedals = country.participations.reduce((acc, curr) => acc + curr.medalsCount, 0);
          const averageAthletesPerParticipation = totalParticipations > 0 ? (totalAthletes / totalParticipations) : 0;
          const averageMedalsPerParticipation = totalParticipations > 0 ? (totalMedals / totalParticipations) : 0;

          return {
            name: country.country,
            stats: [
              {label: 'Nombre de participations', value: totalParticipations},
              {label: 'Nombre total de médailles',value: totalMedals},
              {label: 'Nombre total d\'athlètes', value: totalAthletes},
              // {label: 'Moyenne d\'athlètes par participation',value: parseFloat(averageAthletesPerParticipation.toFixed(0))},
              // {label: 'Moyenne de médailles par participation',value: parseFloat(averageMedalsPerParticipation.toFixed(0))}
            ]
          };
        }
        return undefined;
      }),
      tap(data => {
        //console.log('OlympicService.getOlympicStatsOfCountryId => data : ', data)
      })
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
   * Récupère les données de la série de médailles (graphe Line) pour un événement olympique (country) spécifique.
   *
   * @param {number} olympicId - ID de l'Olympic
   * @return {Observable<DetailGraph>} Observable émettant un DetailGraph avec son array d'objets SerieName
   * contenant les informations de médaille pour le country/olympic
   */
  getMedalsChartLineByOlympic(olympicId: number): Observable<DetailGraph | undefined> {
    //console.log('appel OlympicService.getMedalsChartLineByOlympic(' + olympicId + ')');
    return this.olympics$.pipe(
      map((data) => {
        // Recherche de l'Olympic au param olympicId
        const olympic: Olympic | undefined = data.find((item: Olympic) => item.id === olympicId);
        if (!olympic) {
          //throw new Error(`Aucun Olympic trouvé pour l'ID ${olympicId}`);
          return undefined; // En cas d'actualisation, retourner undefined pour respecter le type Observable<DetailGraph | undefined>.
        }
        // Construction de l'objet SerieName
        const chartLine: DetailGraph = {
          xAxisLabel: 'Dates',
          yAxisLabel: 'Nombre de médailles',
          serieNames: [
            {
              name: olympic.country,
              series:
                olympic.participations.map(part => ({
                  name: `${part.year}`, // Convertir l'année en chaîne
                  value: part.medalsCount
                }))
            }
          ]
        };
        return chartLine; // Retourner un descriptif de chart avec les données de séries
      }),
      tap(data => {
        //console.log('OlympicService.getMedalsChartLineByOlympic => data : ', data)
      })
    );
  }

  /**
   *  Méthode pour démo d'évolutivité possible grâce à la souplesse du composant.
   *  Ici on ajoute sans difficulté une 2ème série représentant la moyenne du nombre de médailles pour les autres
   *  pays.
   * @param olympicId =id du pays
   */
  getMedalsChartLineByOlympicV2(olympicId: number): Observable<DetailGraph | undefined> {
    return this.olympics$.pipe(
      map((data) => {
        // Recherche de l'Olympic pour l'ID donné
        const olympic: Olympic | undefined = data.find((item: Olympic) => item.id === olympicId);
        if (!olympic) {
          // Aucun Olympic trouvé pour cet ID
          return undefined;
        }

        // Calcul de la moyenne de médailles par année pour tous les pays, sauf celui en cours
        const excludedOlympicId = olympic.id; // ID du pays à exclure
        const averageSeries = olympic.participations.map(participation => {
          const year = participation.year;

          // Calculer la moyenne pour cette année
          const totalMedals = data
            .filter(o => o.id !== excludedOlympicId) // Exclure le pays en cours
            .reduce((sum, otherCountry) => {
              const yearParticipation = otherCountry.participations.find(p => p.year === year);
              return sum + (yearParticipation ? yearParticipation.medalsCount : 0);
            }, 0);

          // Nombre total de pays participant cette année (hors exclu)
          const participatingCountries = data.filter(o => o.id !== excludedOlympicId)
            .filter(o => o.participations.some(p => p.year === year)).length;

          const avgMedals = participatingCountries > 0 ? totalMedals / participatingCountries : 0;

          return {
            name: `${year}`,
            value: avgMedals // Moyenne de médailles
          };
        });

        // Construction des données pour le graphique
        const detailChart: DetailGraph = {
          xAxisLabel: 'Dates',
          yAxisLabel: 'Nombre de médailles',
          serieNames: [
            {
              name: olympic.country, // Série pour le pays sélectionné
              series: olympic.participations.map(part => ({
                name: `${part.year}`, // Année
                value: part.medalsCount // Médailles pour cette année
              }))
            },
            {
              name: 'Moyenne globale (hors pays sélectionné)', // Série pour la moyenne
              series: averageSeries
            }
          ]
        };
        return detailChart;
      }),
      tap(data => {
        //console.log('OlympicService.getMedalsChartLineByOlympic => data : ', data)
      })
    );
  }

  getOlympics() {
    return this.olympics$;
  }
}
