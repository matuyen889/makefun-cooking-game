import { INGREDIENT_KINDS, STATIONS } from './config.js';

export class InputHandler {
  constructor(canvas, kitchen, orders, assembly, audio) {
    this.canvas = canvas;
    this.kitchen = kitchen;
    this.orders = orders;
    this.assembly = assembly;
    this.audio = audio;

    this.bindEvents();
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.handleClick(e));
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  handleClick(e) {
    const { x, y } = this.getCanvasCoords(e);

    // 1. Check Prep Station
    if (x >= STATIONS.PREP.x && x <= STATIONS.PREP.x + STATIONS.PREP.w &&
        y >= STATIONS.PREP.y && y <= STATIONS.PREP.y + STATIONS.PREP.h) {
      if (y < STATIONS.PREP.y + 260) {
        // Chopping board clicked
        if (this.kitchen.chop()) {
          this.audio.playChop();
        } else {
          this.kitchen.addPrepItem('tomato');
        }
      } else {
        // Bins clicked
        if (y < STATIONS.PREP.y + 360) {
          if (x < STATIONS.PREP.x + 120) {
            this.assembly.addIngredient(INGREDIENT_KINDS.TOMATO_SLICE);
          } else {
            this.assembly.addIngredient(INGREDIENT_KINDS.LETTUCE);
          }
        } else {
          if (x < STATIONS.PREP.x + 120) {
            this.assembly.addIngredient(INGREDIENT_KINDS.CHEESE);
          } else {
            this.assembly.addIngredient(INGREDIENT_KINDS.PICKLES);
          }
        }
      }
      return;
    }

    // 2. Check Grill Station
    if (x >= STATIONS.GRILL.x && x <= STATIONS.GRILL.x + STATIONS.GRILL.w &&
        y >= STATIONS.GRILL.y && y <= STATIONS.GRILL.y + STATIONS.GRILL.h) {
      if (y < STATIONS.GRILL.y + 320) {
        // Grill slots
        const slotIdx = (x < STATIONS.GRILL.x + STATIONS.GRILL.w / 2) ? 0 : 1;
        const slot = this.kitchen.grillSlots[slotIdx];
        if (slot.state === 'empty') {
          if (this.kitchen.placeOnGrill(slotIdx)) {
            this.audio.playSizzle();
          }
        } else if (slot.state === 'grilled') {
          if (this.kitchen.flipGrillSlot(slotIdx)) {
            this.assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
            this.audio.playDing();
          }
        }
      } else {
        // Buns bin
        this.assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
      }
      return;
    }

    // 3. Check Assembly Station
    if (x >= STATIONS.ASSEMBLY.x && x <= STATIONS.ASSEMBLY.x + STATIONS.ASSEMBLY.w &&
        y >= STATIONS.ASSEMBLY.y && y <= STATIONS.ASSEMBLY.y + STATIONS.ASSEMBLY.h) {
      if (!this.assembly.isCovered && this.assembly.plate.length > 0) {
        this.assembly.addIngredient(INGREDIENT_KINDS.BUN_TOP);
      }
      return;
    }

    // 4. Check Service Station (Bell / Serve button)
    if (x >= STATIONS.SERVICE.x && x <= STATIONS.SERVICE.x + STATIONS.SERVICE.w &&
        y >= STATIONS.SERVICE.y && y <= STATIONS.SERVICE.y + STATIONS.SERVICE.h) {
      this.serveDish();
      return;
    }
  }

  handleKeyDown(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.serveDish();
    } else if (e.key === '1') {
      this.assembly.addIngredient(INGREDIENT_KINDS.BUN_BOTTOM);
    } else if (e.key === '2') {
      this.kitchen.placeOnGrill(0);
      this.audio.playSizzle();
    } else if (e.key === '3') {
      this.kitchen.flipGrillSlot(0);
      this.assembly.addIngredient(INGREDIENT_KINDS.GRILLED_PATTY);
    } else if (e.key === '4') {
      this.assembly.addIngredient(INGREDIENT_KINDS.CHEESE);
    } else if (e.key === '5') {
      this.assembly.addIngredient(INGREDIENT_KINDS.TOMATO_SLICE);
    } else if (e.key === '6') {
      this.assembly.addIngredient(INGREDIENT_KINDS.LETTUCE);
    } else if (e.key === '7') {
      this.assembly.addIngredient(INGREDIENT_KINDS.BUN_TOP);
    } else if (e.key === 'c' || e.key === 'C') {
      if (this.kitchen.chop()) this.audio.playChop();
      else this.kitchen.addPrepItem('tomato');
    }
  }

  serveDish() {
    this.audio.playDing();
    const ingredients = this.assembly.getIngredients();
    if (ingredients.length === 0) return;

    const res = this.orders.matchAndServe(ingredients);
    if (res.success) {
      this.audio.playSuccess();
      this.assembly.clear();
    } else {
      // Clear incorrect dish
      this.assembly.clear();
    }
  }
}
