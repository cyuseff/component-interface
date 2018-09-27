/* tslint:disable:rule1 no-redundant-jsdoc */
import { EventEmitter } from '@Angular/core';

export enum ZfChainActions {
  Add = 'add',
  Update = 'update',
  Delete = 'delete'
}

export interface ZfChain {
  readonly resolve: (value?: any) => void;
  readonly reject: (reason?: any) => void;
}

/**
 * @interface
 * Object emited by ZfChainableComponentInterface
 */
export interface ZfChainableEvent {
  readonly action: ZfChainActions | string;
  readonly oldValue: any;
  readonly newValue: any;
  readonly result: any;
  readonly chainable: ZfChain;
}

/**
 * @interface
 * ZfChainableComponentInterface sets an standart way that Angular
 * component should be implemented.
 *
 * @param {any} data - `@Input` data that the component specs
 * @param {boolean} disabled - `@Input` disables component interactions
 * @param {EventEmitter<ZfChainableEvent>} onChanges - `@Output` event that emits any change
 *
 * @usageNotes
 *
 * The following example receives a complex object and
 * performs an update operation on them.
 *
 * During the async task, lock the component using the `locked` property.
 *
 * ```typescript
 * ```
 */
export interface ZfChainableComponentInterface {
  data: any;
  disabled: boolean;
  onChanges: EventEmitter<ZfChainableEvent>;
}

/**
 * Convinient method to create `chaninable` and `promise` objects
*/
const createChainablePromiseCombo: () => {
  chainable: ZfChain,
  promise: Promise<any>
} = () => {
  let chainable: ZfChain;
  const promise = new Promise((resolve, reject) => {
    chainable = {resolve, reject};
  });
  return {chainable, promise};
};

/**
 * @function
 * Creates an `ZfChainableEvent` object and emit it.
 *
 * @param emiter - used to comunicate to upstream component
 * @param action
 * @param oldValue
 * @param newValue
 * @param result
*/
export const emitChanableEvent: (
  emiter: EventEmitter<ZfChainableEvent>,
  action: ZfChainActions | string,
  oldValue: any,
  newValue: any,
  result: any
) => Promise<any> = (emiter, action, oldValue, newValue, result) => {

  const { chainable, promise } = createChainablePromiseCombo();

  const eventData: ZfChainableEvent = {
    action,
    oldValue,
    newValue,
    result,
    chainable
  };

  emiter.emit(eventData);

  return promise;
};
