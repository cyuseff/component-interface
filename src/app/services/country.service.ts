import { Injectable } from '@angular/core';
import { Term } from '../components/zf-terms/zf-terms.component';
import { ReplaySubject, Observable, Subject, timer } from 'rxjs';
import { ChainableEvent } from '../core/chainable.interface';
import { ChainState } from '../core/chainable.constants';

// Initial response
const countries: Term[] = [
  {value: 'Chile', error: false},
  {value: 'USA', error: false}
];

@Injectable({providedIn: 'root'})
export class CountriesService {

  public countries$: ReplaySubject<Term[]> = new ReplaySubject(1);
  public events$: Subject<ChainableEvent> = new Subject();

  constructor() {
    // add initial data
    this.countries$.next(countries);
  }

  public getCountries(): Observable<Term[]> {
    return this.countries$.asObservable();
  }

  // for demo, all operations are handle the same way
  public postCountry(event: ChainableEvent) {
    this.createObservableResponse(event);
  }
  public updateCountries(event: ChainableEvent) {
    this.createObservableResponse(event);
  }
  public deleteCountry(event: ChainableEvent) {
    this.createObservableResponse(event);
  }

  private createObservableResponse(event: ChainableEvent) {
    const updatedCountries = event.result;

    // mock async task
    timer((Math.round(Math.random() * 1500) + 500))
      .subscribe(() => {
        const rnd = Math.round(Math.random());
        if (rnd) {
          // mark the event as reolved
          event.state = ChainState.Resolved;
          // update countries$
          this.countries$.next(updatedCountries);
        } else {
          // mark the event as rejected
          event.state = ChainState.Rejected;
          // add the error to event
          event.error = new Error(`CountriesService error - ${Date.now()}`);
        }
        // resolve / reject the event
        this.events$.next(event);
      });
  }

}
