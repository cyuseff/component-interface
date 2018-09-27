import { EventEmitter } from '@Angular/core';

export interface ZfChain {
  readonly resolve: (value?: any) => void;
  readonly reject: (reason?: any) => void;
}

/**
 * Object emited by ZfChainableComponentInterface
 */
export interface ZfChainableEvent {
  readonly action:  | string;
  readonly oldValue: any;
  readonly newValue: any;
  readonly result: any;
  readonly chainable: ZfChain;
}

/**
 * ZfChainableComponentInterface sets an standart way that Angular
 * component should be implemented.
 *
 * @param data - `@Input` data that the component specs
 * @param disabled - `@Input` disables component interactions
 * @param onChanges - `@Output` event that emits any change
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
