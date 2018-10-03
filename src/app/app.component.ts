import { Component } from '@angular/core';
import { ChainableEvent } from './core/chainable.interface';
import { ChainActions } from './core/chainable.constants';
import { Term } from './components/zf-terms/zf-terms.component';
import { CountriesService } from './services/country.service';
import { PeopleService } from './services/people.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public disabled = false;  // disable both TermComponents

  public coutries: Term[];
  public people: Term[];

  constructor(
    public countriesService: CountriesService,
    public peopleService: PeopleService
  ) {
    countriesService.getCountries().subscribe(
      coutries => (this.coutries = coutries)
    );
    peopleService.getPeople().subscribe(
      people => (this.people = people)
    );

    // subscribe to service events
    // to perform state changes
    countriesService.events$.subscribe(
      () => {
        this.disabled = false;
      }
    );

    peopleService.events$.subscribe(
      () => {
        this.disabled = false;
      }
    );
  }

  // handles responses with observables
  public coutriesChange(event: ChainableEvent) {
    this.disabled = true;

    // check event.action to know how to handle the event
    switch (event.action) {
      case ChainActions.Add:
        this.countriesService.postCountry(event);
        break;

      case ChainActions.Update:
        this.countriesService.updateCountries(event);
        break;

      case ChainActions.Delete:
        this.countriesService.deleteCountry(event) ;
        break;

      default:
        // TODO: rise an error?
        throw new Error('action not supported');
    }
  }

  public peopleChange(event: ChainableEvent) {
    this.disabled = true;

    // check event.action to know how to handle the event
    switch (event.action) {
      case ChainActions.Add:
        this.peopleService.postPeople(event);
        break;

      case ChainActions.Update:
        this.peopleService.updatePeople(event);
        break;

      case ChainActions.Delete:
        this.peopleService.deletePeople(event);
        break;

      default:
        // TODO: rise an error?
        throw new Error('action not supported');
    }
  }

}
