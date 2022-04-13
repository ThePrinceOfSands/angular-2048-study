export interface Item {
  value: number;
  row: number;
  col: number;
  // Must be deleted on next tick if true
  isOnDelete?: boolean;
}
