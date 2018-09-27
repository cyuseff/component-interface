import { Injectable } from '@angular/core';
import { Term } from '../components/zf-terms/zf-terms.component';
import { ReplaySubject, Observable, Subject } from 'rxjs';

// Initial response
const countries: Term[] = [
  {value: 'Chile', error: false},
  {value: 'USA', error: false}
];

@Injectable({providedIn: 'root'})
export class CountriesService {

  private countries$: ReplaySubject<Term[]> = new ReplaySubject(1);

  constructor() {
    this.countries$.next(countries);
  }

  public getCountries(): Observable<Term[]> {
    return this.countries$.asObservable();
  }

  // for demo all operations are handle the same way
  public postCountry(updatedCountries: Term[]): Subject<any> {
    return this.createObservableResponse(updatedCountries);
  }
  public updateCountries(updatedCountries: Term[]): Subject<any> {
    return this.createObservableResponse(updatedCountries);
  }
  public deleteCountry(updatedCountries: Term[]): Subject<any> {
    return this.createObservableResponse(updatedCountries);
  }

  private createObservableResponse(updatedCountries: Term[]): Subject<any> {
    const sub: Subject<any> = new Subject();

    // mock async task
    setTimeout(
      () => {
        const rnd = Math.round(Math.random());
        if (rnd) {
          // update countries$
          this.countries$.next(updatedCountries);
          // mock success
          sub.next();
          return;
        }
        // mock error
        sub.error(new Error(`Some random error - ${Date.now()}`));
      },
      (Math.round(Math.random() * 1500) + 500)
    );

    return sub;
  }

}
