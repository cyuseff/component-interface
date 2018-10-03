/* tslint:disable:max-line-length */
import { EventEmitter } from '@angular/core';
import { ChainActions, ChainState } from './chainable.constants';
import { Observable } from 'rxjs';

interface ChainableEventInterface {
  readonly id: string;
  readonly action: ChainActions | string;
  readonly oldValue: any;
  readonly newValue: any;
  readonly result: any;
  state: ChainState;
  error: Error;
}

export class ChainableEvent implements ChainableEventInterface {
  public id: string;
  public state: ChainState;
  public error: Error;

  constructor(
    public action: ChainActions | string,
    public oldValue: any,
    public newValue: any,
    public result: any
  ) {
    // just a ramdom ID
    this.id = `event-${Date.now()}`;
    this.state = ChainState.Pending;
  }
}

export interface ChainableComponentInterface {
  data: any;
  disabled: boolean;
  onChanges: EventEmitter<ChainableEvent>;
  events$: Observable<ChainableEvent>;
}
