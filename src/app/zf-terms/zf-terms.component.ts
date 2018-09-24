import { Component, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ZfComponentInterface, ZfError, ZfData } from '../interface/zf-component.interface';
import { ErrAdd, ErrUpdate, ErrDelete } from './zf-terms-errors';

import { ZfActions } from '../constants/zf-actions.constant';
import { TermsActions } from './zf-terms-actions';

@Component({
  selector: 'app-zf-terms',
  templateUrl: './zf-terms.component.html',
  styles: ['ul.disabled { color: #ccc; }']
})
export class ZfTermsComponent implements ZfComponentInterface, OnInit, OnDestroy {
  @Input() data: string[];
  @Input() disabled: boolean;
  @Input() error: Subject<ZfError>;
  @Output() changes = new Subject<ZfData>();

  @ViewChild('termInput') termInputRef: ElementRef;

  errorMessage: string;
  errorIndex: number;
  private errorSub: Subscription;

  ngOnInit() {
    if (!this.error) {
      return;
    }

    this.errorSub = this.error.subscribe(
      (err: ZfError) => {
        console.log('Err received', err);
        // handle error
        if (err instanceof ErrAdd) {
          console.log('Handle ErrAdd');
          const input = this.termInputRef.nativeElement as HTMLInputElement;
          input.value = err.meta.newValue;
          this.errorMessage = err.message;
          return;
        }

        if (err instanceof ErrUpdate) {
          console.log('Handle ErrUpdate');
          this.errorIndex = err.meta.idx;
          this.errorMessage = err.message;
          return;
        }

        if (err instanceof ErrDelete) {
          console.log('Handle ErrDelete');
          this.errorIndex = err.meta.idx;
          this.errorMessage = err.message;
          return;
        }
      }
    );
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  add(termInput: HTMLInputElement) {
    const { value } = termInput;
    const result = [...this.data, value];

    const err = new ErrAdd({newValue: value});

    const data: ZfData = {
      action: ZfActions.Add,
      oldValue: null,
      newValue: value,
      result,
      error: err
    };

    termInput.value = '';
    this.errorMessage = '';

    this.changes.next(data);
  }

  update(idx: number, updateInput: HTMLInputElement) {
    const value = updateInput.value;
    const result = [...this.data];
    const oldValue = result[idx];
    result[idx] = value;

    const err = new ErrUpdate({idx, oldValue, newValue: value});

    const data: ZfData = {
      action: ZfActions.Update,
      oldValue,
      newValue: value,
      result,
      error: err
    };

    this.errorIndex = null;

    this.changes.next(data);
  }

  remove(idx: number) {
    const result = [...this.data];
    const oldValue = result.splice(idx, 1)[0];

    const err = new ErrDelete({idx});

    const data: ZfData = {
      action: ZfActions.Delete,
      oldValue,
      newValue: null,
      result,
      error: err
    };

    this.errorIndex = null;

    this.changes.next(data);
  }
}
