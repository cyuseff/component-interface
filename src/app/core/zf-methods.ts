import { EventEmitter } from '@angular/core';
import { ZfChainActions } from './zf-actions';
import { ZfChain, ZfChainableEvent } from './zf-chainable.interface';

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
 * Creates an `ZfChainableEvent` object and emit it.
 *
 * `emiter` - used to comunicate to upstream component
 * `action`
 * `oldValue`
 * `newValue`
 * `result`
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
