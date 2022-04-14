import { Injectable } from '@angular/core';
import type { Item } from '../models/item';

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
    this.move();
  }

  left() {
    this.move();
  }

  up() {
    this.move();
  }

  down() {
    this.move();
  }

  private move() {
    this.clearDeletedItems();

    const mergedItems: Item[] = [];

    for (let row = 1; row <= this.size; row++) {
      const rowItems = this.items
        .filter((item) => item.row === row)
        .sort((a, b) => a.col - b.col);

      let col = 1;
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
            col--;
            mergedItems.push({ value: item.value * 2, col, row });
          }
        }

        item.col = col;
        col++;
        prevItem = item;
      }
    }

    this.items = [...this.items, ...mergedItems];

    this.generateItems();
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
