/* tslint:disable:rule1 no-output-on-prefix */
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ZfComponentInterface,
  ZfEventData,
  ZfActions,
  createChainablePromiseCombo
} from '../interface/zf-component.interface';

export interface Term {
  value: string;
  error: boolean;
}

@Component({
  selector: 'app-zf-terms',
  templateUrl: './zf-terms.component.html',
  styles: ['ul.disabled { color: #ccc; }']
})
export class ZfTermsComponent implements ZfComponentInterface {
  @Input() public data: Term[];
  @Input() public disabled: boolean;
  @Output() public onChanges = new EventEmitter<ZfEventData>();

  public errorMessage: string;
  public locked = false;

  isDisabled(): boolean {
    return this.disabled || this.locked;
  }

  add(termInput: HTMLInputElement) {
    const { value } = termInput;
    // create new object
    const newValue: Term = {value, error: false};

    // expected component result logic
    const result = [...this.data, newValue];

    // create chainable and promise objects
    const { chainable, promise } = createChainablePromiseCombo();

    // create ZfEventData
    const eventData: ZfEventData = {
      action: ZfActions.Add,
      oldValue: null,
      newValue,
      result,
      chainable
    };

    // resolve logic
    promise
      .then(res => {
        termInput.value = '';
        this.errorMessage = '';
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = err.message;
      })
      .then(() => {
        this.locked = false;
      });

    // Update component's state to reflect the async action
    this.locked = true;

    // Emit event to upstream component
    this.onChanges.emit(eventData);
  }

  update(termSelect: HTMLSelectElement, updateInput: HTMLInputElement) {
    if (!termSelect.value || !updateInput.value) {
      this.errorMessage = 'Both fields are required';
      return;
    }

    const idx = +termSelect.value;
    const {value} = updateInput;

    // save oldValue
    const oldValue = this.data[idx];

    // create the updated object
    const newValue = { ...oldValue, value, error: false };

    // expected component result logic
    const result = [...this.data];
    result[idx] = newValue;

    // create chainable and promise objects
    const { chainable, promise } = createChainablePromiseCombo();

    // create ZfEventData
    const eventData: ZfEventData = {
      action: ZfActions.Update, // comunicate action to upstream component
      oldValue,  // this is useful when oldValue has an id
      newValue,  // the updated data
      result,    // use result to mutate data on upstream so it can be propagated
      chainable, // use chainable object
    };
    // resolve logic
    promise
    // Use for cleanup component's state like lock/unlock.
    // Do not mutate `this.data`,
    // this changes must come from upstream component/viewController
    .then(() => {
      // unlock component
      this.locked = false;
      updateInput.value = '';
    })
    // Handle error. The main advantage is that now
    // we have the context of the error.
    .catch ((err) => {
      console.error(err);
      this.errorMessage = err.message;
      oldValue.error = true;
      // unlock/enabled component
      this.locked = false;
    });
    // Update component's state to reflect the async action
    // lock/disable component
    this.locked = true;
    // Emit event to upstream component
    this.onChanges.emit(eventData);
  }

  remove(idx: number) {
    const result: Term[] = [...this.data];
    const oldValue: Term = result.splice(idx, 1)[0];

    oldValue.error = false;

    const { chainable, promise} = createChainablePromiseCombo();
    const eventData: ZfEventData = {
      action: ZfActions.Delete,
      oldValue,
      newValue: null,
      result,
      chainable
    };

    promise
      .then(() => {
        this.errorMessage = '';
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = err.message;
        oldValue.error = true;
      })
      .then(() => {
        this.locked = false;
      });

    this.locked = true;
    this.onChanges.emit(eventData);
  }
}
