import { Component } from '@angular/core';
import { ZfChainActions, ZfChainableEvent } from './interface/zf-component.interface';
import { Term } from './zf-terms/zf-terms.component';
import { CountriesService } from './service/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public disabled = false;  // disable both TermComponents

  public coutries: Term[];
  public people: Term[] = [
    {value: 'Crist', error: false},
    {value: 'Kav', error: false},
    {value: 'Robbie', error: false}
  ];

  constructor(private countriesService: CountriesService) {
    countriesService.getCountries().subscribe(
      coutries => (this.coutries = coutries)
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

  // handles responses with promises/async pattern
  public peopleChange(data: ZfChainableEvent) {
    this.allMethodsHandler(data, 'people');
  }

  private allMethodsHandler(data: ZfChainableEvent, target: string) {
    this.disabled = true;

    this.createPromise()
      .then(() => {
        this[target] = data.result;
        data.chainable.resolve({status: 200});
      })
      .catch(err => {
        data.chainable.reject(err);
      })
      .then(() => {
        this.disabled = false;
      });
  }

  // mock async call
  private createPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          const rnd = Math.round(Math.random());
          if (rnd) {
            return resolve();
          }
          return reject(new Error(`Some random error - ${Date.now()}`));
        },
        (Math.round(Math.random() * 1500) + 500)
      );
    });
  }
}
