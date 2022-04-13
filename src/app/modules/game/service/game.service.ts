import { Injectable } from '@angular/core';
import type { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  items: Item[] = [
    { value: 2, col: 1, row: 1 },
    { value: 4, col: 2, row: 1 },
    { value: 8, col: 1, row: 3 },
    { value: 2048, col: 2, row: 4 },
  ];

  constructor() {}

  right() {
    this.items = [];
  }

  left() {}

  up() {}

  down() {}
}
