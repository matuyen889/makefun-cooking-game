import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { KitchenState } from './kitchen.js';
import { OrderManager } from './orders.js';
import { DishAssembly } from './assembly.js';
import { Renderer } from './render.js';
import { InputHandler } from './input.js';
import { SoundManager } from './audio.js';
import { stageScene } from './shots.js';

const canvas = document.getElementById('game');
const renderer = new Renderer(canvas);
const kitchen = new KitchenState();
const orders = new OrderManager();
const assembly = new DishAssembly();
const audio = new SoundManager();
const input = new InputHandler(canvas, kitchen, orders, assembly, audio);

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');

if (shotName) {
  // Staged shot mode
  stageScene(shotName, kitchen, orders, assembly);
  renderer.drawKitchen(kitchen, orders, assembly, 0);
} else {
  // Normal playable game loop
  orders.spawnOrder();
  orders.spawnOrder();

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;

    kitchen.updateGrill(dt);
    kitchen.updateParticles(dt);
    orders.update(dt);

    renderer.drawKitchen(kitchen, orders, assembly, now / 1000);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
