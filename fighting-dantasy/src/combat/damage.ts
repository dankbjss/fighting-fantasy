const DAMAGE_CONTEXT = {
  TAKE: 'TAKE',
  DEAL: 'DEAL',
} as const;

export type DamageContext =
  (typeof DAMAGE_CONTEXT)[keyof typeof DAMAGE_CONTEXT];

type LuckModifier = 'LUCKY' | 'UNLUCKY' | 'NORMAL';

const TAKE = {
  NORMAL: -2,
  LUCKY: 1,
  UNLUCKY: 1,
} as const;

const DEAL = {
  NORMAL: -2,
  LUCKY: -2,
  UNLUCKY: 1,
} as const;

const DAMAGE_MATRIX = {
  TAKE: {
    NORMAL: TAKE.NORMAL,
    LUCKY: TAKE.LUCKY,
    UNLUCKY: TAKE.UNLUCKY,
  },
  DEAL: {
    NORMAL: DEAL.NORMAL,
    LUCKY: DEAL.LUCKY,
    UNLUCKY: DEAL.UNLUCKY,
  },
} as const;

interface IDamage {
  context: DamageContext;
  luckModifier: LuckModifier;
  modifier: number;
}

export class Damage implements IDamage {
  private _context: DamageContext;
  private _luckModifier: LuckModifier;
  private _damage: number;

  constructor(context: DamageContext, luckModifier: LuckModifier) {
    this._context = context;
    this._luckModifier = luckModifier;
    this._damage = DAMAGE_MATRIX[this._context][this._luckModifier];
  }

  public get context(): DamageContext {
    return this._context;
  }
  public get luckModifier(): LuckModifier {
    return this._luckModifier;
  }

  public get modifier(): number {
    return this._damage;
  }
}
