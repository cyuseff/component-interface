/* tslint:disable:rule1 no-output-on-prefix */

import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ZfChainableComponentInterface, ZfChainableEvent } from '../../core/zf-chainable.interface';
import { emitChanableEvent } from '../../core/zf-methods';
import { ZfChainActions } from '../../core/zf-actions';

export interface Term {
  value: string;
  error: boolean;
}

@Component({
  selector: 'app-zf-terms',
  templateUrl: './zf-terms.component.html',
  styles: ['ul.disabled { color: #ccc; }']
})
export class ZfTermsComponent implements ZfChainableComponentInterface {
  @Input() public data: Term[];
  @Input() public disabled: boolean;
  @Output() public onChanges = new EventEmitter<ZfChainableEvent>();

  public errorMessage: string;
  private locked = false;

  isDisabled(): boolean {
    return this.disabled || this.locked;
  }

  add(termInput: HTMLInputElement) {
    // component internal logic
    const { value } = termInput;

    const newValue: Term = {value, error: false};
    const result = [...this.data, newValue];

    this.locked = true;
    this.errorMessage = '';

    // emit data to upstream component
    emitChanableEvent(this.onChanges, ZfChainActions.Add, null, newValue, result)
      .then(() => {
        termInput.value = '';
      })
      .catch(err => {
        this.errorMessage = err.message;
      })
      .then(() => {
        this.locked = false;
      });
  }

  update(termSelect: HTMLSelectElement, updateInput: HTMLInputElement) {
    if (!termSelect.value || !updateInput.value) {
      this.errorMessage = 'Both fields are required';
      return;
    }

    const idx = +termSelect.value;
    const {value} = updateInput;

    const oldValue = this.data[idx];
    const newValue = { ...oldValue, value, error: false };

    const result = [...this.data];
    result[idx] = newValue;

    this.locked = true;
    this.errorMessage = '';

    emitChanableEvent(this.onChanges, ZfChainActions.Update, oldValue, newValue, result)
      .then(() => {
        updateInput.value = '';
      })
      .catch ((err) => {
        this.errorMessage = err.message;
        oldValue.error = true;
      })
      .then(() => {
        this.locked = false;
      });
  }

  remove(idx: number) {
    const result: Term[] = [...this.data];
    const oldValue: Term = result.splice(idx, 1)[0];

    oldValue.error = false;
    this.locked = true;
    this.errorMessage = '';

    emitChanableEvent(this.onChanges, ZfChainActions.Delete, oldValue, null, result)
      .then(() => {
        // >:D
      })
      .catch(err => {
        this.errorMessage = err.message;
        oldValue.error = true;
      })
      .then(() => {
        this.locked = false;
      });
  }
}
