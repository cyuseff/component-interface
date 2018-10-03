/**
 * Common actions performed by components
 */
export enum ChainActions {
  Add = 'add',
  Update = 'update',
  Delete = 'delete'
}

/**
 * Chainable event states
 */
export enum ChainState {
  Pending = 'pending',
  Resolved = 'resolved',
  Rejected = 'rejected'
}
