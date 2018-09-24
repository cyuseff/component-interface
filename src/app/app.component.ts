import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ZfData, ZfError } from './interface/zf-component.interface';
import { ZfActions } from './constants/zf-actions.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  disabled = false;

  termsData = ['term001', 'term002', 'term003'];
  termsErrors = new Subject<ZfError>();

  onChanges(data: ZfData) {
    switch (data.action) {
      case ZfActions.Add:
        this.allMethodsHandler(data);
        break;
      case ZfActions.Update:
        this.allMethodsHandler(data);
        break;
      case ZfActions.Delete:
        this.allMethodsHandler(data);
        break;
    }
  }

  allMethodsHandler(data: ZfData) {
    this.disabled = true;

    this.createPromise()
      .then(() => {
        this.termsData = data.result;
      })
      .catch(err => {
        const {error} = data;
        error.error = err;
        this.termsErrors.next(error);
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
            return resolve({});
          }
          return reject(new Error('some random error'));
        },
        2000
      );
    });
  }
}
