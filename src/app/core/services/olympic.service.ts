import {HttpClient} from '@angular/common/http';
import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject, delay, finalize, map, Observable, take, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";
import {GlobalGraph} from "../models/stats/GlobalGraph";
//import {LoadingService} from "./loading.service";
import {BoxStats} from "../models/stats/BoxStats";
//import {MessagesService} from "./messages.service";
import {DetailGraph} from "../models/stats/DetailGraph";
import {SerieData} from "../models/stats/SerieData";
import {IMessagesService} from "./messages.service.interface";
import {ILoadingService} from "./loading.service.interface";
import { ILoadingServiceToken, IMessagesServiceToken } from './tokens';


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
    @Inject(ILoadingServiceToken) private loadingService: ILoadingService,
    @Inject(IMessagesServiceToken) private messagesService: IMessagesService) {
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
    ).subscribe(data => {
      //console.log('OlympicService.refreshDataCache() ; Data reçues dans subscribe : ', data));
    });

  }

  /**
   * Les données sont mises en cache dans le BehaviorSubject via tap
   * afin d'avoir une gestion d'état simple et éviter des appels http get trop nombreux.
   * Les données sont ainsi accessibles à tout moment via l'observable olympics$.
   * La méthode {@link refreshDataCache()} est plus "safe" car elle récupère le flux et limite à une lecture en
   * évitant d'enregistrer trop d'éléments (inutiles) dans le cache et en fermant .
   * Décision : je mets cette méthode de service en private car elle est susceptible d'une mauvaise
   * utilisation si le développeur oublie de faire un take(1). De plus, si elle est appelée intempestivement
   * plusieurs fois sans le take(1), elle peut déclencher des écoutes multiples non souhaitées.
   */
  private loadInitialData(): Observable<Olympic[]> {
    //console.log('OlympicService.loadInitialData() : appel backend')
    //this.loadingService.loadingOn();//SOLUTION 1 pour LOADING
    //return this.http.get<Olympic[]>('FichierInexistant.json')//pour simuler 404
    return this.http.get<Olympic[]>(this.olympicUrl)
      .pipe(
        delay(1000), // délai de 1 secondes pour test affichage du loading
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
          extra: {id: o.id}
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
   * Permet d'inclure ou non les moyennes calculées en configurant l'option `includeAverages`.
   *
   * @param id L'identifiant du pays.
   * @param includeAverages Indique si les moyennes doivent être calculées (par défaut false).
   * @returns Un Observable contenant les stats du pays, y compris son id et son nom.
   */
  getOlympicStatsOfCountryId(
    id: number,
    includeAverages: boolean = false
  ): Observable<BoxStats | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find((o: Olympic) => o.id === id);
        if (country) {
          const totalParticipations = country.participations.length;
          const totalAthletes = country.participations.reduce((acc, curr) => acc + curr.athleteCount, 0);
          const totalMedals = country.participations.reduce((acc, curr) => acc + curr.medalsCount, 0);

          // Préparer les statistiques de base
          const stats = [
            {label: 'Nombre de participations', value: totalParticipations},
            {label: 'Nombre total de médailles', value: totalMedals},
            {label: 'Nombre total d\'athlètes', value: totalAthletes},
          ];

          // Ajouter les moyennes si demandé
          if (includeAverages && totalParticipations > 0) {
            const averageAthletesPerParticipation = totalAthletes / totalParticipations;
            const averageMedalsPerParticipation = totalMedals / totalParticipations;

            stats.push(
              {
                label: 'Moyenne d\'athlètes par participation',
                value: parseFloat(averageAthletesPerParticipation.toFixed(0)),
              },
              {
                label: 'Moyenne de médailles par participation',
                value: parseFloat(averageMedalsPerParticipation.toFixed(0)),
              }
            );
          }

          return {
            name: country.country,
            stats,
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
   * Spéc originale : Récupère les données de la série de médailles (graphe détail) pour un événement olympique
   * (country) spécifique.
   *
   * @param {number} olympicId - ID de l'Olympic
   * @return {Observable<DetailGraph>} Observable émettant un DetailGraph avec son array d'objets SerieName
   * contenant les informations de médaille pour le country/olympic
   */
  getMedalsDetailGraphOfCountry(olympicId: number): Observable<DetailGraph | undefined> {
    //console.log('appel OlympicService.getMedalsDetailGraphOfCountry(' + olympicId + ')');
    return this.olympics$.pipe(
      map((data) => {
        // Recherche de l'Olympic au param olympicId
        const olympic: Olympic | undefined = data.find((item: Olympic) => item.id === olympicId);
        if (!olympic) {
          //throw new Error(`Aucun Olympic trouvé pour l'ID ${olympicId}`);
          return undefined; // En cas d'actualisation, retourner undefined pour respecter le type Observable<DetailGraph | undefined>.
        }
        // Construction de l'objet SerieName
        const detailGraph: DetailGraph = {
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
        return detailGraph; // Retourner un descriptif de graphique avec les données de séries
      }),
      tap(data => {
        //console.log('OlympicService.getMedalsDetailGraphOfCountry => data : ', data)
      })
    );
  }

  /**
   * Pour démo : Méthode pour générer un graphique détaillé des médailles pour un pays sélectionné.
   * Le calcul des moyennes des autres pays est optionnel selon le paramètre includeAverages.
   * @param olympicId - ID du pays
   * @param includeAverages - Indique si les moyennes des médailles doivent être calculées (par défaut à false)
   * @returns Observable<DetailGraph | undefined>
   */
  getMedalsDetailGraphOfCountryV2(
    olympicId: number,
    includeAverages: boolean = false
  ): Observable<DetailGraph | undefined> {
    return this.olympics$.pipe(
      map((data) => {
        // Recherche de l'Olympic pour l'ID donné
        const olympic: Olympic | undefined = data.find((item: Olympic) => item.id === olympicId);
        if (!olympic) {
          return undefined;
        }

        // Série principale : nombre de médailles du pays sélectionné
        const countrySeries: SerieData[] = olympic.participations.map((part) => ({
          name: `${part.year}`, // Année
          value: part.medalsCount, // Nombre de médailles pour cette année
        }));

        //série optionnelle : moyenne du nombre de médailles hors pays sélectionné
        let averageSeries: SerieData[] | undefined;
        if (includeAverages) {
          // Préfiltrage : Exclure le pays sélectionné
          const otherCountries = data.filter((o) => o.id !== olympic.id);

          // Calcul de la moyenne de médailles par année
          averageSeries = olympic.participations.map((participation) => {
            const year = participation.year;

            // Calcul du total des médailles pour l'année
            const totalMedals = otherCountries.reduce((sum, otherCountry) => {
              const yearParticipation = otherCountry.participations.find((p) => p.year === year);
              return sum + (yearParticipation ? yearParticipation.medalsCount : 0);
            }, 0);

            // Calcul du nombre de pays participant pour l'année
            const participatingCountries = otherCountries.reduce((count, otherCountry) => {
              return count + (otherCountry.participations.some((p) => p.year === year) ? 1 : 0);
            }, 0);

            // Calcul de la moyenne de médailles
            const avgMedals = participatingCountries > 0 ? totalMedals / participatingCountries : 0;

            return {
              name: `${year}`,
              value: avgMedals, // Moyenne calculée pour cette année
            };
          });
        }

        // Construction de l'objet de données final
        return {
          xAxisLabel: 'Dates',
          yAxisLabel: 'Nombre de médailles',
          serieNames: [
            {
              name: olympic.country, // Série principale (médailles du pays sélectionné)
              series: countrySeries,
            },
            // Ajout conditionnel pour la moyenne seulement si includeAverages est activé
            ...(averageSeries
              ? [
                {
                  name: 'Moyenne globale (hors pays sélectionné)', // Série pour la moyenne
                  series: averageSeries,
                },
              ]
              : []),
          ],
        };
      }),
      tap((data) => {
        //console.log('OlympicService.getMedalsDetailGraphOfCountryV2 => data : ', data)
      })
    );
  }

  getOlympics() {
    return this.olympics$;
  }
}
