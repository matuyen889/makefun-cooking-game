export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const INGREDIENT_KINDS = {
  BUN_BOTTOM: 'bun_bottom',
  BUN_TOP: 'bun_top',
  RAW_PATTY: 'raw_patty',
  GRILLED_PATTY: 'grilled_patty',
  CHEESE: 'cheese',
  TOMATO_WHOLE: 'tomato_whole',
  TOMATO_SLICE: 'tomato_slice',
  LETTUCE: 'lettuce',
  PICKLES: 'pickles',
  SAUCE: 'sauce'
};

export const RECIPES = [
  {
    id: 'classic_burger',
    name: 'Artisan Burger',
    patience: 35,
    basePoints: 120,
    steps: [
      INGREDIENT_KINDS.BUN_BOTTOM,
      INGREDIENT_KINDS.GRILLED_PATTY,
      INGREDIENT_KINDS.CHEESE,
      INGREDIENT_KINDS.TOMATO_SLICE,
      INGREDIENT_KINDS.LETTUCE,
      INGREDIENT_KINDS.BUN_TOP
    ]
  },
  {
    id: 'double_deluxe',
    name: 'Double Deluxe',
    patience: 42,
    basePoints: 180,
    steps: [
      INGREDIENT_KINDS.BUN_BOTTOM,
      INGREDIENT_KINDS.GRILLED_PATTY,
      INGREDIENT_KINDS.CHEESE,
      INGREDIENT_KINDS.GRILLED_PATTY,
      INGREDIENT_KINDS.CHEESE,
      INGREDIENT_KINDS.PICKLES,
      INGREDIENT_KINDS.BUN_TOP
    ]
  },
  {
    id: 'garden_stack',
    name: 'Garden Stack',
    patience: 30,
    basePoints: 100,
    steps: [
      INGREDIENT_KINDS.BUN_BOTTOM,
      INGREDIENT_KINDS.LETTUCE,
      INGREDIENT_KINDS.CHEESE,
      INGREDIENT_KINDS.TOMATO_SLICE,
      INGREDIENT_KINDS.PICKLES,
      INGREDIENT_KINDS.SAUCE,
      INGREDIENT_KINDS.BUN_TOP
    ]
  }
];

export const STATIONS = {
  PREP: { x: 50, y: 170, w: 260, h: 510, title: 'Prep Station' },
  GRILL: { x: 335, y: 170, w: 325, h: 510, title: 'Sizzle Grill' },
  ASSEMBLY: { x: 685, y: 170, w: 380, h: 510, title: 'Assembly & Plate' },
  SERVICE: { x: 1090, y: 170, w: 140, h: 510, title: 'Service Pass' }
};

export const GRILL_TIMINGS = {
  COOK_TIME: 6.0,
  BURN_TIME: 12.0
};

export const CHOP_CLICKS_NEEDED = 3;
