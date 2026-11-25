import { GRILL_TIMINGS, CHOP_CLICKS_NEEDED } from './config.js';

export class KitchenState {
  constructor() {
    this.prepBoard = {
      activeItem: null, // 'tomato'
      clicksDone: 0,
      readySlices: 0
    };

    this.grillSlots = [
      { id: 0, item: null, elapsed: 0, state: 'empty' },
      { id: 1, item: null, elapsed: 0, state: 'empty' }
    ];

    this.assemblyPlate = {
      ingredients: [],
      readyToServe: false
    };

    this.inventory = {
      buns: 10,
      rawPatties: 8,
      cheeseSlices: 10,
      tomatoes: 6,
      lettuceLeaves: 10,
      pickles: 10,
      sauceDrips: 10
    };

    this.particles = [];
  }

  addPrepItem(item) {
    if (this.prepBoard.activeItem === null) {
      this.prepBoard.activeItem = item;
      this.prepBoard.clicksDone = 0;
      return true;
    }
    return false;
  }

  chop() {
    if (!this.prepBoard.activeItem) return false;
    this.prepBoard.clicksDone += 1;
    if (this.prepBoard.clicksDone >= CHOP_CLICKS_NEEDED) {
      this.prepBoard.readySlices += 3;
      this.prepBoard.activeItem = null;
      this.prepBoard.clicksDone = 0;
    }
    return true;
  }

  placeOnGrill(slotId) {
    const slot = this.grillSlots[slotId];
    if (slot && slot.state === 'empty' && this.inventory.rawPatties > 0) {
      this.inventory.rawPatties -= 1;
      slot.item = 'patty';
      slot.elapsed = 0;
      slot.state = 'raw';
      return true;
    }
    return false;
  }

  flipGrillSlot(slotId) {
    const slot = this.grillSlots[slotId];
    if (slot && slot.state === 'grilled') {
      // Pick up cooked patty
      slot.state = 'empty';
      slot.item = null;
      slot.elapsed = 0;
      return true;
    }
    return false;
  }

  updateGrill(dt) {
    for (const slot of this.grillSlots) {
      if (slot.state === 'empty') continue;
      slot.elapsed += dt;
      if (slot.elapsed >= GRILL_TIMINGS.BURN_TIME) {
        slot.state = 'burned';
      } else if (slot.elapsed >= GRILL_TIMINGS.COOK_TIME) {
        slot.state = 'grilled';
      } else {
        slot.state = 'cooking';
      }

      // Add sizzle smoke particles
      if (slot.state === 'cooking' || slot.state === 'grilled') {
        if (Math.random() < 0.25) {
          this.particles.push({
            x: 390 + slot.id * 110 + (Math.random() * 40 - 20),
            y: 350 + (Math.random() * 20 - 10),
            vx: (Math.random() - 0.5) * 15,
            vy: -40 - Math.random() * 30,
            life: 1.0,
            color: 'rgba(230, 230, 230, 0.4)',
            size: 6 + Math.random() * 6
          });
        }
      }
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.size += dt * 4;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}
