import { Injectable } from '@angular/core';
import { Term } from '../components/zf-terms/zf-terms.component';
import { ReplaySubject, Observable, Subject, timer } from 'rxjs';

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

  private people$: ReplaySubject<Term[]> = new ReplaySubject(1);

  constructor() {
    this.people$.next(people);
  }

  public getPeople(): Observable<Term[]> {
    return this.people$.asObservable();
  }

  // for demo all operations are handle the same way
  public postPeople(updatedPeople: Term[]): Subject<any> {
    return this.createObservableResponse(updatedPeople);
  }
  public updatePeople(updatedPeople: Term[]): Subject<any> {
    return this.createObservableResponse(updatedPeople);
  }
  public deletePeople(updatedPeople: Term[]): Subject<any> {
    return this.createObservableResponse(updatedPeople);
  }

  private createObservableResponse(updatedPeople: Term[]): Subject<any> {
    const sub: Subject<any> = new Subject();

    const delayed = timer((Math.round(Math.random() * 1500) + 500));
    delayed.subscribe(() => {
      const rnd = Math.round(Math.random());
      if (rnd) {
        // update people$
        this.people$.next(updatedPeople);
        // mock success
        sub.next();
        return;
      }
      // mock error
      sub.error(new Error(`Some random error - ${Date.now()}`));
    });

    return sub;
  }

}
