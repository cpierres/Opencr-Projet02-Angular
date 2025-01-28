import {Observable} from "rxjs";

export interface ILoadingService {
  loadingOn():void;
  loadingOff():void;
  showLoaderUntilCompleted<T>(observable$: Observable<T>): Observable<T>;
}
