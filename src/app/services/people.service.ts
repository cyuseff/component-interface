import { Injectable } from '@angular/core';
import { Term } from '../components/zf-terms/zf-terms.component';
import { ReplaySubject, Observable, Subject, timer } from 'rxjs';
import { ChainableEvent } from '../core/chainable.interface';
import { ChainState } from '../core/chainable.constants';

// Initial response
const people: Term[] = [
  {value: 'Crist', error: false},
  {value: 'Kav', error: false},
  {value: 'Robbie', error: false},
  {value: 'David', error: false},
  {value: 'Seba', error: false}
];

@Injectable({providedIn: 'root'})
export class PeopleService {

  public people$: ReplaySubject<Term[]> = new ReplaySubject(1);
  public events$: Subject<ChainableEvent> = new Subject();

  constructor() {
    this.people$.next(people);
  }

  public getPeople(): Observable<Term[]> {
    return this.people$.asObservable();
  }

  // for demo all operations are handle the same way
  public postPeople(event: ChainableEvent) {
    this.createObservableResponse(event);
  }
  public updatePeople(event: ChainableEvent) {
    this.createObservableResponse(event);
  }
  public deletePeople(event: ChainableEvent) {
    this.createObservableResponse(event);
  }

  private createObservableResponse(event: ChainableEvent) {
    const updatedPeople = event.result;

    // mock async task
    timer((Math.round(Math.random() * 1500) + 500))
      .subscribe(() => {
        const rnd = Math.round(Math.random());
        if (rnd) {
          // mark the event as reolved
          event.state = ChainState.Resolved;
          // update people$
          this.people$.next(updatedPeople);
        } else {
          // mark the event as rejected
          event.state = ChainState.Rejected;
          // add the error to event
          event.error = new Error(`PeopleService - ${Date.now()}`);
        }
        // resolve / reject the event
        this.events$.next(event);
      });
  }

}
