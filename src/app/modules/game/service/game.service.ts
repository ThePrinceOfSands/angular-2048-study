import { Injectable } from '@angular/core';

import type { Item } from '../models/item';

type TDim = 'col' | 'row';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {
    this.generateAvailableCells();
    this.generateItems();
  }

  private readonly size = 4;
  private availableCells: number[] = [];

  items: Item[] = [];
  isEnd = false;

  private get emptyCells(): number[] {
    const notEmptyCells = this.notEmptyCells;

    return this.availableCells.filter(
      (position) => !notEmptyCells.includes(position)
    );
  }

  private get notEmptyCells(): number[] {
    return this.items.map((item) => item.row * 10 + item.col);
  }

  right() {
    this.move('row', 'col', true);
  }

  left() {
    this.move('row', 'col');
  }

  up() {
    this.move('col', 'row');
  }

  down() {
    this.move('col', 'row', true);
  }

  private move(dimX: TDim, dimY: TDim, reverse = false) {
    if (this.isEnd || !this.checkMove(dimX, false, reverse)) {
      return;
    }

    this.clearDeletedItems();

    const mergedItems: Item[] = [];

    for (let x = 1; x <= this.size; x++) {
      const rowItems = this.items
        .filter((item) => item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);

      if (reverse) {
        rowItems.reverse();
      }

      let y = reverse ? this.size : 1;
      let merged = false;
      let prevItem: Item | null = null;

      for (let i = 0; i < rowItems.length; i++) {
        const item: Item = rowItems[i];

        if (prevItem) {
          if (merged) {
            merged = false;
          } else if (item.value === prevItem.value) {
            prevItem.isOnDelete = true;
            item.isOnDelete = true;
            reverse ? y++ : y--;
            mergedItems.push({
              value: item.value * 2,
              [dimY]: y,
              [dimX]: x,
            } as any);
          }
        }

        item[dimY] = y;
        reverse ? y-- : y++;
        prevItem = item;
      }
    }

    this.items = [...this.items, ...mergedItems];

    this.generateItems();

    this.isEnd = this.endGames();
  }

  private endGames() {
    return !(this.checkMove('row') || this.checkMove('col'));
  }

  private checkMove(dimX: TDim, skipDir = true, forward = true) {
    const dimY = dimX === 'row' ? 'col' : 'row';

    for (let x = 1; x <= this.size; x++) {
      const items = this.items
        .filter((item) => !item.isOnDelete && item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);

      if (items.length !== this.size) {
        if (skipDir) {
          return true;
        }
        const length = items.length;
        const lockedPositions: number[] = [];

        const start = forward ? this.size + 1 - length : 1;
        const end = forward ? this.size : length;

        for (let i = start; i <= end; i++) {
          lockedPositions.push(i);
        }

        if (items.find((item) => !lockedPositions.includes(item[dimY]))) {
          return true;
        }
      }

      let prevValue = 0;

      for (let i = 0; i < items.length; i++) {
        if (items[i].value === prevValue) {
          return true;
        }

        prevValue = items[i].value;
      }

      return true;
    }

    return false;
  }

  private clearDeletedItems() {
    this.items = this.items.filter((item) => !item.isOnDelete);
  }

  private generateItems(length = 2) {
    const positions: number[] = this.emptyCells
      .sort(() => Math.random() - 0.5)
      .slice(0, length);

    this.items = [
      ...this.items,
      ...positions.map<Item>((position) => ({
        value: 2,
        col: position % 10,
        row: (position - (position % 10)) / 10,
      })),
    ];
  }

  private generateAvailableCells() {
    for (let row = 1; row <= this.size; row++) {
      for (let col = 1; col <= this.size; col++) {
        this.availableCells.push(row * 10 + col);
      }
    }
  }
}
