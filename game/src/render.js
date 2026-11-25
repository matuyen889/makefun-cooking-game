import { CANVAS_WIDTH, CANVAS_HEIGHT, STATIONS, INGREDIENT_KINDS } from './config.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  drawKitchen(kitchen, orders, assembly, time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Kitchen Background (Subway tile wall & floor)
    this.drawBackground(ctx, time);

    // 2. Order Board Rail & Tickets
    this.drawOrderBoard(ctx, orders, time);

    // 3. Countertop Stations
    this.drawPrepStation(ctx, kitchen);
    this.drawGrillStation(ctx, kitchen, time);
    this.drawAssemblyStation(ctx, assembly, time);
    this.drawServiceStation(ctx, assembly, time);

    // 4. Smoke & Sizzle Particles
    this.drawParticles(ctx, kitchen.particles);

    // 5. Header HUD: Score, Tips, Combo, Clock
    this.drawHUD(ctx, orders, time);
  }

  drawBackground(ctx, time) {
    // Upper wall tiles
    ctx.fillStyle = '#222834';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 160);

    // Tile grid lines
    ctx.strokeStyle = '#1b202a';
    ctx.lineWidth = 2;
    for (let x = 0; x < CANVAS_WIDTH; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 160);
      ctx.stroke();
    }
    for (let y = 0; y < 160; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Stainless steel counter strip
    const steelGrad = ctx.createLinearGradient(0, 150, 0, 720);
    steelGrad.addColorStop(0, '#2e3748');
    steelGrad.addColorStop(0.05, '#4a5568');
    steelGrad.addColorStop(0.1, '#3b4455');
    steelGrad.addColorStop(1, '#1a1f28');
    ctx.fillStyle = steelGrad;
    ctx.fillRect(0, 150, CANVAS_WIDTH, 570);

    // Counter edge highlight
    ctx.fillStyle = '#718096';
    ctx.fillRect(0, 158, CANVAS_WIDTH, 3);
  }

  drawOrderBoard(ctx, orders, time) {
    // Metal rail
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(40, 12, CANVAS_WIDTH - 80, 12);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(40, 14, CANVAS_WIDTH - 80, 4);

    // Render Order Tickets
    orders.tickets.forEach((ticket, idx) => {
      const tx = 60 + idx * 280;
      const ty = 20;
      const tw = 250;
      const th = 125;

      // Ticket clip
      ctx.fillStyle = '#cbd5e0';
      ctx.fillRect(tx + tw / 2 - 12, ty - 8, 24, 12);

      // Paper sheet
      ctx.fillStyle = '#f7fafc';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(tx, ty, tw, th);
      ctx.shadowColor = 'transparent';

      // Title & ID
      ctx.fillStyle = '#2d3748';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.fillText(`#${ticket.id} ${ticket.recipe.name}`, tx + 12, ty + 24);

      // Ingredients Checklist
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillStyle = '#718096';
      const stepsText = ticket.recipe.steps.map(s => s.replace('_', ' ')).slice(1, -1).join(' • ');
      ctx.fillText(stepsText, tx + 12, ty + 46, tw - 24);

      // Timer Bar
      const timerRatio = Math.max(0, ticket.remaining / ticket.totalPatience);
      ctx.fillStyle = '#edf2f7';
      ctx.fillRect(tx + 12, ty + 62, tw - 24, 14);

      // Color from green to orange to pulsing red
      if (timerRatio > 0.5) ctx.fillStyle = '#48bb78';
      else if (timerRatio > 0.25) ctx.fillStyle = '#ed8936';
      else ctx.fillStyle = (Math.sin(time * 12) > 0) ? '#e53e3e' : '#c53030';

      ctx.fillRect(tx + 12, ty + 62, (tw - 24) * timerRatio, 14);

      // Timer text
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${Math.ceil(ticket.remaining)}s remaining`, tx + 16, ty + 73);

      // Point reward badge
      ctx.fillStyle = '#2b6cb0';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText(`Points: +${ticket.recipe.basePoints}`, tx + 12, ty + 105);
    });
  }

  drawPrepStation(ctx, kitchen) {
    const s = STATIONS.PREP;
    this.drawStationFrame(ctx, s.x, s.y, s.w, s.h, s.title);

    // Cutting board (bamboo wood texture)
    const bx = s.x + 20, by = s.y + 40, bw = s.w - 40, bh = 220;
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#b7791f';
    ctx.fillRect(bx + 4, by + 4, bw - 8, bh - 8);

    // Cutting Board Content
    if (kitchen.prepBoard.activeItem) {
      // Tomato being chopped
      ctx.fillStyle = '#e53e3e';
      ctx.beginPath();
      ctx.arc(bx + bw / 2, by + bh / 2, 40, 0, Math.PI * 2);
      ctx.fill();

      // Knife chop line animation
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      for (let i = 0; i < kitchen.prepBoard.clicksDone; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2 - 35 + i * 25, by + bh / 2 - 35);
        ctx.lineTo(bx + bw / 2 - 35 + i * 25, by + bh / 2 + 35);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#cbd5e0';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Cutting Board Empty', bx + bw / 2, by + bh / 2 - 10);
      ctx.font = '12px sans-serif';
      ctx.fillText('Click to prep tomato', bx + bw / 2, by + bh / 2 + 15);
      ctx.textAlign = 'left';
    }

    // Storage Bins for Raw Ingredients
    this.drawStorageBin(ctx, s.x + 20, s.y + 280, 100, 80, 'Fresh Tomato', '#e53e3e', 'Stock: 6');
    this.drawStorageBin(ctx, s.x + 135, s.y + 280, 100, 80, 'Crisp Lettuce', '#38a169', 'Stock: 10');
    this.drawStorageBin(ctx, s.x + 20, s.y + 380, 100, 80, 'Cheddar Slices', '#ecc94b', 'Stock: 10');
    this.drawStorageBin(ctx, s.x + 135, s.y + 380, 100, 80, 'Dill Pickles', '#2f855a', 'Stock: 10');
  }

  drawGrillStation(ctx, kitchen, time) {
    const s = STATIONS.GRILL;
    this.drawStationFrame(ctx, s.x, s.y, s.w, s.h, s.title);

    // Cast-iron grill box
    const gx = s.x + 18, gy = s.y + 40, gw = s.w - 36, gh = 280;
    ctx.fillStyle = '#171923';
    ctx.fillRect(gx, gy, gw, gh);

    // Red-hot heating coils beneath
    ctx.strokeStyle = 'rgba(237, 137, 54, 0.5)';
    ctx.lineWidth = 4;
    for (let y = gy + 20; y < gy + gh; y += 30) {
      ctx.beginPath();
      ctx.moveTo(gx + 10, y);
      ctx.lineTo(gx + gw - 10, y);
      ctx.stroke();
    }

    // Grill grates
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 6;
    for (let x = gx + 15; x < gx + gw; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, gy + 5);
      ctx.lineTo(x, gy + gh - 5);
      ctx.stroke();
    }

    // 2 Grill Slots
    kitchen.grillSlots.forEach((slot, i) => {
      const cx = gx + 70 + i * 140;
      const cy = gy + 140;

      if (slot.state !== 'empty') {
        // Patty drawing
        ctx.fillStyle = (slot.state === 'grilled') ? '#7b341e' : (slot.state === 'burned') ? '#1a100a' : '#c53030';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 45, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Grill marks
        ctx.strokeStyle = '#2d1810';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 15); ctx.lineTo(cx + 30, cy + 15);
        ctx.moveTo(cx - 20, cy - 20); ctx.lineTo(cx + 40, cy + 10);
        ctx.moveTo(cx - 40, cy - 5); ctx.lineTo(cx + 20, cy + 25);
        ctx.stroke();

        // Timer dial above patty
        ctx.fillStyle = '#edf2f7';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${slot.elapsed.toFixed(1)}s`, cx, cy - 42);

        // State indicator
        if (slot.state === 'grilled') {
          ctx.fillStyle = '#48bb78';
          ctx.fillText('PERFECT FLIP!', cx, cy + 48);
        } else if (slot.state === 'burned') {
          ctx.fillStyle = '#e53e3e';
          ctx.fillText('BURNED!', cx, cy + 48);
        } else {
          ctx.fillStyle = '#ed8936';
          ctx.fillText('SIZZLING...', cx, cy + 48);
        }
        ctx.textAlign = 'left';
      } else {
        // Empty slot target
        ctx.strokeStyle = '#718096';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(cx - 50, cy - 35, 100, 70);
        ctx.setLineDash([]);
        ctx.fillStyle = '#718096';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Grill Slot ${i + 1}`, cx, cy);
        ctx.textAlign = 'left';
      }
    });

    // Patty Raw Tray
    this.drawStorageBin(ctx, s.x + 40, s.y + 350, 110, 80, 'Raw Patty', '#9b2c2c', 'Stock: 8');
    this.drawStorageBin(ctx, s.x + 175, s.y + 350, 110, 80, 'Golden Buns', '#d69e2e', 'Stock: 10');
  }

  drawAssemblyStation(ctx, assembly, time) {
    const s = STATIONS.ASSEMBLY;
    this.drawStationFrame(ctx, s.x, s.y, s.w, s.h, s.title);

    // Large Dinner Plate
    const px = s.x + s.w / 2, py = s.y + 220;
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(px, py + 20, 140, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#edf2f7';
    ctx.beginPath();
    ctx.ellipse(px, py + 20, 120, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // RENDER DISH MID-ASSEMBLY (Layered stack!)
    const ingredients = assembly.getIngredients();
    let currentY = py + 15;

    ingredients.forEach((item, idx) => {
      this.drawFoodLayer(ctx, px, currentY, item);
      currentY -= 14; // stack upward
    });

    // Mid-Assembly Label
    ctx.fillStyle = '#f7fafc';
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    if (ingredients.length === 0) {
      ctx.fillText('Plate Ready for Assembly', px, s.y + 350);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#a0aec0';
      ctx.fillText('Add bottom bun to start dish', px, s.y + 375);
    } else if (assembly.isReady()) {
      ctx.fillStyle = '#48bb78';
      ctx.fillText('✓ Dish Complete & Plated! Press Serve', px, s.y + 350);
    } else {
      ctx.fillStyle = '#ecc94b';
      ctx.fillText(`Dish Mid-Assembly: ${ingredients.length} layers placed`, px, s.y + 350);
      ctx.font = '13px monospace';
      ctx.fillStyle = '#cbd5e0';
      ctx.fillText(ingredients.map(i => i.split('_')[0]).join(' → '), px, s.y + 375);
    }
    ctx.textAlign = 'left';
  }

  drawFoodLayer(ctx, x, y, kind) {
    switch (kind) {
      case INGREDIENT_KINDS.BUN_BOTTOM:
        ctx.fillStyle = '#d69e2e';
        ctx.beginPath();
        ctx.ellipse(x, y, 75, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b7791f';
        ctx.fillRect(x - 70, y - 5, 140, 6);
        break;
      case INGREDIENT_KINDS.GRILLED_PATTY:
        ctx.fillStyle = '#5c2b16';
        ctx.beginPath();
        ctx.ellipse(x, y, 72, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case INGREDIENT_KINDS.CHEESE:
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.moveTo(x - 65, y);
        ctx.lineTo(x + 65, y);
        ctx.lineTo(x + 55, y + 12);
        ctx.lineTo(x - 55, y + 12);
        ctx.closePath();
        ctx.fill();
        break;
      case INGREDIENT_KINDS.TOMATO_SLICE:
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath();
        ctx.ellipse(x - 25, y, 35, 14, -0.1, 0, Math.PI * 2);
        ctx.ellipse(x + 25, y, 35, 14, 0.1, 0, Math.PI * 2);
        ctx.fill();
        break;
      case INGREDIENT_KINDS.LETTUCE:
        ctx.fillStyle = '#38a169';
        ctx.beginPath();
        ctx.ellipse(x, y, 80, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case INGREDIENT_KINDS.PICKLES:
        ctx.fillStyle = '#276749';
        ctx.beginPath();
        ctx.ellipse(x - 20, y, 20, 10, 0.2, 0, Math.PI * 2);
        ctx.ellipse(x + 20, y, 20, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case INGREDIENT_KINDS.SAUCE:
        ctx.fillStyle = '#c53030';
        ctx.fillRect(x - 45, y - 4, 90, 8);
        break;
      case INGREDIENT_KINDS.BUN_TOP:
        ctx.fillStyle = '#dd6b20';
        ctx.beginPath();
        ctx.ellipse(x, y - 8, 75, 32, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        // Sesame seeds
        ctx.fillStyle = '#fefcbf';
        [[-30, -22], [0, -28], [30, -20], [-15, -16], [18, -14]].forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.ellipse(x + sx, y + sy, 3, 2, 0.3, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
    }
  }

  drawServiceStation(ctx, assembly, time) {
    const s = STATIONS.SERVICE;
    this.drawStationFrame(ctx, s.x, s.y, s.w, s.h, s.title);

    // Brass Service Bell
    const bx = s.x + s.w / 2, by = s.y + 120;
    ctx.fillStyle = '#ecc94b';
    ctx.beginPath();
    ctx.arc(bx, by, 32, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(bx - 36, by - 2, 72, 8);
    // Bell button top
    ctx.fillStyle = '#718096';
    ctx.fillRect(bx - 4, by - 40, 8, 10);
    ctx.beginPath();
    ctx.arc(bx, by - 42, 7, 0, Math.PI * 2);
    ctx.fill();

    // Bell label
    ctx.fillStyle = '#edf2f7';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ORDER BELL', bx, by + 30);

    // Service Button
    const btnY = s.y + 260;
    const canServe = assembly.isReady();
    ctx.fillStyle = canServe ? '#38a169' : '#4a5568';
    ctx.fillRect(s.x + 15, btnY, s.w - 30, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('SERVE', bx, btnY + 36);
    ctx.font = '11px monospace';
    ctx.fillText('[SPACE]', bx, btnY + 50);
    ctx.textAlign = 'left';
  }

  drawStationFrame(ctx, x, y, w, h, title) {
    ctx.fillStyle = '#1e2430';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Title banner
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(x, y, w, 28);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText(title, x + 12, y + 19);
  }

  drawStorageBin(ctx, x, y, w, h, label, color, stock) {
    ctx.fillStyle = '#171923';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#2d3748';
    ctx.strokeRect(x, y, w, h);

    // Color swatch
    ctx.fillStyle = color;
    ctx.fillRect(x + 10, y + 10, 16, 16);

    ctx.fillStyle = '#cbd5e0';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(label, x + 32, y + 23);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#a0aec0';
    ctx.fillText(stock, x + 12, y + 60);
  }

  drawParticles(ctx, particles) {
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHUD(ctx, orders, time) {
    // Top right HUD bar
    ctx.fillStyle = 'rgba(23, 25, 35, 0.85)';
    ctx.fillRect(CANVAS_WIDTH - 360, 165, 340, 45);
    ctx.strokeStyle = '#4a5568';
    ctx.strokeRect(CANVAS_WIDTH - 360, 165, 340, 45);

    ctx.fillStyle = '#48bb78';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`$${orders.tips} TIPS`, CANVAS_WIDTH - 345, 194);

    ctx.fillStyle = '#ecc94b';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${orders.score} PTS`, CANVAS_WIDTH - 235, 194);

    if (orders.combo > 1) {
      ctx.fillStyle = '#ed8936';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.fillText(`COMBO x${orders.combo}!`, CANVAS_WIDTH - 120, 194);
    }
  }
}
