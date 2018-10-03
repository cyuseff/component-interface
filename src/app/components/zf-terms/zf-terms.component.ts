/* tslint:disable:rule1 no-output-on-prefix */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ChainableComponentInterface, ChainableEvent } from '../../core/chainable.interface';
import { ChainActions, ChainState } from '../../core/chainable.constants';
import { Subscription, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface Term {
  value: string;
  error: boolean;
}

@Component({
  selector: 'app-zf-terms',
  templateUrl: './zf-terms.component.html',
  styles: ['ul.disabled { color: #ccc; }']
})
export class ZfTermsComponent implements ChainableComponentInterface, OnInit, OnDestroy {
  @Input() public data: Term[];
  @Input() public disabled: boolean;
  @Input() public events$: Observable<ChainableEvent>;
  @Output() public onChanges = new EventEmitter<ChainableEvent>();

  @ViewChild('termInput') private termInput: ElementRef;
  @ViewChild('updateInput') private updateInput: ElementRef;
  @ViewChild('termSelect') private termSelect: ElementRef;

  private lastEventId: string;
  private eventSub: Subscription;

  public errorMessage: string;
  private locked = false;

  ngOnInit() {
    this.eventSub = this.events$.pipe(
      // we wanna wait until the event state change
      distinctUntilChanged(
        (a, b) => (a.id === b.id && a.state === b.state)
      )
    )
      .subscribe(
        (event: ChainableEvent) => this.handleAsyncTask(event)
      );

  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  isDisabled(): boolean {
    return this.disabled || this.locked;
  }

  add() {
    // method logic
    const { value } = this.termInput.nativeElement;

    const newValue: Term = {value, error: false};
    const result = [...this.data, newValue];

    // create event
    const event = new ChainableEvent(
      ChainActions.Add,
      null,
      newValue,
      result
    );

    this.emitOnChangeEvent(event);
  }

  update() {
    const updateInput = this.updateInput.nativeElement;
    const termSelect = this.termSelect.nativeElement;
    const { value } = updateInput;

    // method logic
    if (termSelect.value === undefined || !value) {
      this.errorMessage = 'Both fields are required';
      return;
    }

    const idx = +termSelect.value;

    const oldValue = this.data[idx];
    const newValue = { ...oldValue, value, error: false };

    const result = [...this.data];
    result[idx] = newValue;

    // create event
    const event = new ChainableEvent(
      ChainActions.Update,
      oldValue,
      newValue,
      result
    );

    this.emitOnChangeEvent(event);
  }

  remove(idx: number) {
    // method logic
    const result: Term[] = [...this.data];
    const oldValue: Term = result.splice(idx, 1)[0];

    oldValue.error = false;

    // create event
    const event = new ChainableEvent(
      ChainActions.Delete,
      oldValue,
      null,
      result
    );

    this.emitOnChangeEvent(event);
  }

  private emitOnChangeEvent(event: ChainableEvent) {
    // save event id
    this.lastEventId = event.id;

    // update internal state
    this.locked = true;
    this.errorMessage = '';

    // emit data to upstream component
    this.onChanges.emit(event);
  }

  // handles the resolve or rejection of the async task
  private handleAsyncTask(event: ChainableEvent) {
    // check if the error belong to this component
    if (event.id === this.lastEventId) {
      if (event.state === ChainState.Resolved) {
        this.handleResolved(event);
      } else if ((event.state === ChainState.Rejected)) {
        this.handleRejected(event);
      } else {
        // still pending or the event was not updated
      }
    }
  }

  private handleResolved(event: ChainableEvent) {
    switch (event.action) {
      case ChainActions.Add:
        this.termInput.nativeElement.value = '';
        break;
      case ChainActions.Update:
        this.updateInput.nativeElement.value = '';
        break;
      case ChainActions.Delete:
        // nothing to do here
        break;
    }
    this.locked = false;
  }

  private handleRejected(event: ChainableEvent) {
    this.errorMessage = `Action: ${event.action} - Error: ${event.error.message}`;
    switch (event.action) {
      case ChainActions.Add:
        break;
      case ChainActions.Update:
        event.oldValue.error = true;
        break;
      case ChainActions.Delete:
        event.oldValue.error = true;
        break;
    }
    this.locked = false;
  }
}
