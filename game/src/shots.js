import { INGREDIENT_KINDS } from './config.js';

export function stageScene(shotName, kitchen, orders, assembly) {
  orders.tickets = [];
  kitchen.particles = [];
  assembly.clear();

  // Common orders on the board
  orders.spawnOrder('classic_burger');
  orders.spawnOrder('double_deluxe');
  orders.spawnOrder('garden_stack');

  if (orders.tickets[0]) orders.tickets[0].remaining = 24.5;
  if (orders.tickets[1]) orders.tickets[1].remaining = 16.0;
  if (orders.tickets[2]) orders.tickets[2].remaining = 8.5;

  orders.score = 480;
  orders.tips = 68;
  orders.combo = 2;

  // Staged patties on grill
  kitchen.grillSlots[0] = { id: 0, item: 'patty', elapsed: 7.2, state: 'grilled' };
  kitchen.grillSlots[1] = { id: 1, item: 'patty', elapsed: 4.1, state: 'cooking' };

  // Chopping board
  kitchen.prepBoard.activeItem = 'tomato';
  kitchen.prepBoard.clicksDone = 2;
  kitchen.prepBoard.readySlices = 4;

  // Pre-seed some smoke particles
  for (let i = 0; i < 15; i++) {
    kitchen.particles.push({
      x: 380 + Math.random() * 140,
      y: 330 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 10,
      vy: -20 - Math.random() * 20,
      life: 0.8,
      color: 'rgba(220, 220, 220, 0.4)',
      size: 8 + Math.random() * 6
    });
  }

  if (shotName === '1' || shotName === 'start' || shotName === 'kitchen') {
    // Shot 1: Kitchen & Order Board overview with dish beginning
    assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
    assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
  } else if (shotName === '2' || shotName === 'mid' || shotName === 'assembly') {
    // Shot 2: Exact requirement: "one dish mid-assembly"
    assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
    assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
    assembly.addIngredient(INGREDIENT_KINDS.CHEESE);
    assembly.addIngredient(INGREDIENT_KINDS.TOMATO_SLICE);
    assembly.addIngredient(INGREDIENT_KINDS.LETTUCE);
  } else if (shotName === '3' || shotName === 'rush') {
    // Shot 3: Rush service & high combo
    orders.combo = 3;
    orders.score = 840;
    orders.tips = 124;
    assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
    assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
    assembly.addIngredient(INGREDIENT_KINDS.CHEESE);
  } else if (shotName === '4' || shotName === 'plate' || shotName === 'ready') {
    // Shot 4: Plate ready to serve with complete dish
    assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
    assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
    assembly.addIngredient(INGREDIENT_KINDS.CHEESE);
    assembly.addIngredient(INGREDIENT_KINDS.TOMATO_SLICE);
    assembly.addIngredient(INGREDIENT_KINDS.LETTUCE);
    assembly.addIngredient(INGREDIENT_KINDS.BUN_TOP);
  }
}
