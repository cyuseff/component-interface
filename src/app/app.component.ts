import { Component } from '@angular/core';
import { ZfChainableEvent } from './core/zf-chainable.interface';
import { ZfChainActions } from './core/zf-actions';
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
    private countriesService: CountriesService,
    private peopleService: PeopleService
  ) {
    countriesService.getCountries().subscribe(
      coutries => (this.coutries = coutries)
    );
    peopleService.getPeople().subscribe(
      people => (this.people = people)
    );
  }

  // handles responses with observables
  public coutriesChange(data: ZfChainableEvent) {
    this.disabled = true;

    // check data.action to know how to handle the event
    switch (data.action) {
      case ZfChainActions.Add:
        this.countriesService.postCountry(data.result) // this should be {data.newValue}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      case ZfChainActions.Update:
        this.countriesService.updateCountries(data.result) // this should be {oldValue.id, data.newValue}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      case ZfChainActions.Delete:
        this.countriesService.deleteCountry(data.result) // this should be {oldValue.id}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      default:
        data.chainable.reject(new Error('Action not supported'));
        break;
    }
  }

  public peopleChange(data: ZfChainableEvent) {
    this.disabled = true;

    // check data.action to know how to handle the event
    switch (data.action) {
      case ZfChainActions.Add:
        this.peopleService.postPeople(data.result) // this should be {data.newValue}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      case ZfChainActions.Update:
        this.peopleService.updatePeople(data.result) // this should be {oldValue.id, data.newValue}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      case ZfChainActions.Delete:
        this.peopleService.deletePeople(data.result) // this should be {oldValue.id}
          .subscribe(
            (res) => {
              this.disabled = false;
              data.chainable.resolve(res);
            },
            (err) => {
              console.error(err);
              this.disabled = false;
              data.chainable.reject(err);
            }
          );
        break;

      default:
        data.chainable.reject(new Error('Action not supported'));
        break;
    }
  }

}
