import { RECIPES } from './config.js';

export class OrderManager {
  constructor() {
    this.tickets = [];
    this.nextTicketId = 1;
    this.spawnTimer = 0;
    this.spawnInterval = 14;
    this.score = 0;
    this.tips = 0;
    this.combo = 1;
    this.completedCount = 0;
  }

  spawnOrder(forceRecipeId = null) {
    if (this.tickets.length >= 4) return null;
    let recipe;
    if (forceRecipeId) {
      recipe = RECIPES.find(r => r.id === forceRecipeId) || RECIPES[0];
    } else {
      recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    }

    const ticket = {
      id: this.nextTicketId++,
      recipe,
      remaining: recipe.patience,
      totalPatience: recipe.patience,
      status: 'waiting'
    };
    this.tickets.push(ticket);
    return ticket;
  }

  update(dt) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnOrder();
    }

    for (let i = this.tickets.length - 1; i >= 0; i--) {
      const ticket = this.tickets[i];
      ticket.remaining -= dt;
      if (ticket.remaining <= 0) {
        // Ticket expired
        this.combo = 1;
        this.tickets.splice(i, 1);
      }
    }
  }

  matchAndServe(dishIngredients) {
    for (let i = 0; i < this.tickets.length; i++) {
      const ticket = this.tickets[i];
      const required = ticket.recipe.steps;
      if (this.arraysEqual(required, dishIngredients)) {
        const timeRatio = Math.max(0, ticket.remaining / ticket.totalPatience);
        const tipEarned = Math.round(ticket.recipe.basePoints * 0.4 * timeRatio * this.combo);
        const pointsEarned = ticket.recipe.basePoints * this.combo;

        this.score += pointsEarned;
        this.tips += tipEarned;
        this.combo = Math.min(4, this.combo + 1);
        this.completedCount += 1;

        this.tickets.splice(i, 1);
        return { success: true, points: pointsEarned, tip: tipEarned, recipe: ticket.recipe.name };
      }
    }
    this.combo = 1;
    return { success: false, reason: 'Recipe mismatch' };
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
