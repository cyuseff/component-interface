import { Subject } from 'rxjs';
import { ZfActions } from '../constants/zf-actions.constant';

export interface ZfError {
  readonly message: string;
  error: Error;
  meta?: any;
}

export interface ZfData {
  readonly action: ZfActions | string | number;
  readonly oldValue: any;
  readonly newValue: any;
  readonly result: any;
  readonly error: ZfError;
}

export interface ZfComponentInterface {
  data: any;
  disabled: boolean;
  error: Subject<ZfError> | Promise<ZfError> | ZfError;
  changes: Subject<ZfData>;
}
