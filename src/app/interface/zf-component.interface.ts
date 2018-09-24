import { Subject } from 'rxjs';
import { ZfActions } from '../constants/zf-actions.constant';

export class ZfData {
  public promise?: {resolve: any, reject: any};

  constructor(
    public action: ZfActions | string | number,
    public oldValue: any,
    public newValue: any,
    public result: any
  ) {}
}

export interface ZfComponentInterface {
  data: any;
  disabled: boolean;
  changes: Subject<ZfData>;
}
