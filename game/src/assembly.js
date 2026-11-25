import { INGREDIENT_KINDS } from './config.js';

export class DishAssembly {
  constructor() {
    this.plate = [];
    this.isCovered = false;
  }

  addIngredient(kind) {
    if (this.isCovered) return false;
    this.plate.push(kind);
    if (kind === INGREDIENT_KINDS.BUN_TOP) {
      this.isCovered = true;
    }
    return true;
  }

  clear() {
    this.plate = [];
    this.isCovered = false;
  }

  getIngredients() {
    return [...this.plate];
  }

  isReady() {
    return this.plate.length >= 3 && this.isCovered;
  }
}
