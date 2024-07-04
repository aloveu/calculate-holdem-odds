export enum Street {
    Preflop,
    Flop,
    Turn,
    River,
}

export interface Player {
    playerId: number;
    cards: (number | null)[];
    winCount: number;
    tieCount: number;
    rank: number;
    outs: number[];
    hand: string;
    kicker: any[];
    headPlayer?: boolean;
}
