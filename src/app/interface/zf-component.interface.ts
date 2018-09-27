/* tslint:disable:rule1 no-redundant-jsdoc */
import { EventEmitter } from '@Angular/core';

export enum ZfActions {
  Add = 'add',
  Update = 'update',
  Delete = 'delete'
}

export interface ZfChainable {
  resolve?: (value?: any) => void;
  reject?: (reason?: any) => void;
}

/**
 * @interface
 * Object emited by ZfComponentInterface
 */
export interface ZfEventData {
  readonly action: ZfActions | string;
  readonly oldValue: any;
  readonly newValue: any;
  readonly result: any;
  readonly chainable: ZfChainable;
}

/**
 * @interface
 * ZfComponentInterface sets an standart way that Angular
 * component should be implemented.
 *
 * @usageNotes
 *
 * The following example receives a complex object and
 * performs an update operation on them.
 *
 * During the async task, lock the component using the `locked` property.
 *
 * ```typescript
 * class ZfTerms implements ZfComponentInterface {
 *   @Input() public data: Array<{value: string, error: boolean}>;
 *   @Input() public disabled: boolean;
 *   @Output() public onChanges: EventEmitter<ZfEventData> = new EventEmitter<ZfEventData>();
 *   private locked: boolean = false;
 *
 *   private update(idx: number, value: string) {
 *     // save oldValue
 *     const oldValue = this.data[idx];
 *
 *     // create the updated object
 *     const newValue = {...oldValue, value, error: false};
 *
 *     // expected component result logic
 *     const result = [...this.data];
 *     result[idx] = newValue;
 *
 *     // create chainable and promise objects
 *     const { chainable, promise} = createChainablePromiseCombo();
 *
 *     // create ZfEventData
 *     const eventData: ZfEventData = {
 *       action: ZfActions.Update, // comunicate action to upstream component
 *       oldValue,  // this is useful when oldValue has an id
 *       newValue,  // the updated data
 *       result,    // use result to mutate data on upstream so it can be propagated
 *       chainable, // use chainable object
 *     };
 *
 *     // resolve logic
 *     promise
 *       // Use for cleanup component's state like lock/unlock.
 *       // Do not mutate `this.data`,
 *       // this changes must come from upstream component/viewController
 *       .then(() => {
 *         // unlock component
 *         this.locked = false;
 *       })
 *       // Handle error. The main advantage is that now
 *       // we have the context of the error.
 *       .catch((err) => {
 *         oldValue.error = true;
 *
 *         // unlock/enabled component
 *         this.locked = false;
 *       });
 *
 *     // Update component's state to reflect the async action
 *     // lock/disable component
 *     this.locked = true;
 *
 *     // Emit event to upstream component
 *     this.onChanges.emit(eventData);
 *   }
 * }
 * ```
 *
 * @interface
 * @param {any} data - `@Input` data that the component specs
 * @param {boolean} disabled - `@Input` disables component interactions
 * @param {EventEmitter<ZfEventData>} onChanges - `@Output` event that emits any change
 */
export interface ZfComponentInterface {
  data: any;
  disabled: boolean;
  onChanges: EventEmitter<ZfEventData>;
}

/**
 * @function
 * Convinient function to create `ZfChainable` and `Promise<any>` combo.
 * Both of this object are used by ZfComponentInterface object
 * to perform async tasks and emit events.
 */
export const createChainablePromiseCombo: () => {
  chainable: ZfChainable,
  promise: Promise<any>
} = () => {
  const chainable: ZfChainable = {};
  const promise = new Promise((resolve, reject) => {
    chainable.resolve = resolve;
    chainable.reject = reject;
  });
  return {chainable, promise};
};
