import { ZfError } from '../interface/zf-component.interface';

export class ErrAdd implements ZfError {
  message = 'We could not add the new term';
  error: Error;
  meta: {newValue: string};

  constructor(meta: {newValue: string}) {
    this.meta = meta;
  }
}

export class ErrUpdate implements ZfError {
  message = 'We could not update term';
  error: Error;
  meta: {
    idx: number,
    oldValue: string,
    newValue: string
  };

  constructor(meta: {idx: number, oldValue: string, newValue: string}) {
    this.meta = meta;
  }
}

export class ErrDelete implements ZfError {
  message = 'We could not delete term';
  error: Error;
  meta: {idx: number};

  constructor(meta: {idx: number}) {
    this.meta = meta;
  }
}
