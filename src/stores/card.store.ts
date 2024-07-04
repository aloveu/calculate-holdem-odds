import { defineStore } from 'pinia';
import type { Player } from '@/model/card';

interface CardStore {
    deck: number[];
    communityCards: (number | null)[];
    combinationCards: number[][];
    manualDealingTarget: any;
    players: Player[];
    playerCount: number;
}

export const RANKS = '23456789TJQKA'; // RANKS[i % 13]
export const SUITS = '♠♣♦♥'; // SUITS[Math.floor(i / 13)]

export const useCardStore = defineStore('card', {
    state: (): CardStore => ({
        deck: [],
        communityCards: [null, null, null, null, null],
        combinationCards: [],
        manualDealingTarget: { target: null, index: null },
        players: [],
        playerCount: 2,
    }),
    getters: {
        seatedPlayers(): Player[] {
            return this.players.filter((x) => x.cards.every((y: number | null) => y !== null));
        },
        combinationCount(): number {
            return this.combinationCards.length;
        },
        communityCardsCount(): number {
            return this.communityCards.filter((x) => x !== null).length;
        },
        isPossibleCalulateOdds(): boolean {
            // 커뮤니티 카드 3장이상, 플레이어 두명이상이 두장의 카드를 받았을때만 계산하기
            return this.communityCardsCount >= 3 && (this.seatedPlayers.length || 0) >= 2;
        },
    },
    actions: {
        // 패 섞기
        shuffleDeck() {
            for (let i = this.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        },

        // 카드 초기화
        initCards() {
            this.deck = Array.from({ length: 52 }, (_, i) => i);
            this.communityCards = [null, null, null, null, null];
            this.manualDealingTarget = { target: null, index: null };
        },

        // 플레이어에게 딜링
        dealCardsForPlayer() {
            // TODO : 한장씩
            if (!this.players[0].cards[0]) {
                for (let i = 0; i < 2; i++) {
                    for (let seat = 0; seat < this.playerCount; seat++) {
                        const card = this.deck.pop();
                        this.players[seat]['cards'][i] = card;
                    }
                }
            }

            this.reCalculateWinRate();
        },

        // 커뮤니티 카드 딜링
        dealCummunityCards() {
            const deal = (numCards: number) => this.deck.splice(-numCards);

            if (!this.communityCardsCount) {
                // 프리플랍 > 플랍
                this.communityCards = [...deal(3), null, null];
            } else if (this.communityCardsCount === 3) {
                // 플랍 > 턴
                this.communityCards[3] = deal(1)[0];
            } else if (this.communityCardsCount === 4) {
                // 턴 > 리버
                this.communityCards[4] = deal(1)[0];
                this.combinationCards = [];
            }

            this.reCalculateWinRate();
        },

        // 메뉴얼로 카드 세팅
        setCard(_card: number) {
            if (this.manualDealingTarget.target !== null) {
                // 선택한 카드 덱에서 제거
                this.deck.splice(this.deck.indexOf(_card), 1);

                if (this.manualDealingTarget.target === 'c') {
                    // 커뮤니티 카드 세팅
                    this.communityCards[this.manualDealingTarget.index] = _card;

                    if (this.manualDealingTarget.index < 4) {
                        this.manualDealingTarget.index += 1;
                    } else {
                        this.manualDealingTarget = { target: null, index: null };
                    }
                } else {
                    // Player 카드 세팅
                    const currentPlayer = this.players.find((player) => player.playerId === this.manualDealingTarget.target);
                    currentPlayer.cards[this.manualDealingTarget.index] = _card;

                    if (this.manualDealingTarget.index < 1) {
                        this.manualDealingTarget.index += 1;
                    } else {
                        this.manualDealingTarget = { target: null, index: null };
                    }
                }
            }

            // 메뉴얼로 세팅할때마다 승률 계산
            this.reCalculateWinRate();
        },

        reCalculateWinRate() {
            if (this.isPossibleCalulateOdds) {
                this.combinationCards = this.getCombinations(this.deck, 5 - this.communityCardsCount);

                this.evaluateAllPlayerHands();
                this.calculateOuts();
            }
        },

        // 카드 조합 생성 함수
        getCombinations(remainingCards: number[], size: number): number[][] {
            if (size === 1) {
                return remainingCards.map((card) => [card]);
            } else if (size === 2) {
                // size < 5
                return remainingCards.flatMap((card, i) => this.getCombinations(remainingCards.slice(i + 1), size - 1).map((c) => [card, ...c]));
            }
            return [];
        },

        // 스트레이트인지? 스트레이트면 가장 높은 카드 숫자 리턴 (3이 5, 12는 A)
        getStraightHighCard(rankBits: number) {
            const straight = 0x1f; // 2진수 11111, 연속된 5개숫자, parseInt(11111, 2).toString(16)
            // 5개 숫자니깐 8번 왼쪽으로 쉬프트하면 13개 숫자 체크
            for (let i = 8; i >= 0; i--) {
                if ((rankBits & (straight << i)) === straight << i) {
                    return i + 4;
                }
            }

            if ((rankBits & 0x100f) === 0x100f) return 3; // A2345 체크 : 2진수 1 0000 0000 1111 = 0x100f

            return null;
        },

        // 족보 계산
        calculateHandRanking(hand: number[], community: (number | null)[]) {
            // 플레이어카드와 커뮤니티 카드 합친카드
            const allCards: number[] = [...hand, ...community.filter((x) => x !== null)];
            let rankBits = 0;
            const suitCounts = [0, 0, 0, 0];
            const rankCounts = new Array(13).fill(0);

            // 비교를 위해 비트로 변환
            allCards.forEach((card: number) => {
                const rank = card % 13; // 0 ~ 12
                const suit = Math.floor(card / 13); // 0 ~ 3

                rankBits = rankBits | (1 << rank); // 2진수로 변환해서 비트연산
                suitCounts[suit] += 1; // 같은 모양 카드 카운트 [5, 1, 1, 0];
                rankCounts[rank] += 1; // 같은 숫자 카드 카운트 [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
            });
            // console.log(suitCounts, rankCounts, rankBits.toString(2));

            const flush = suitCounts.findIndex((count) => count >= 5);
            const straight = this.getStraightHighCard(rankBits);

            if (flush !== -1 && straight) {
                const rankSuitBits = [0, 0, 0, 0];

                allCards.forEach((card) => {
                    const rank = card % 13;
                    const suit = Math.floor(card / 13);

                    rankSuitBits[suit] = rankSuitBits[suit] | (1 << rank);
                });
                // console.log(rankSuitBits);

                let straightFlush: null | number = null;
                rankSuitBits.forEach((bits) => {
                    // 플러시인애가 스트레이트인지 체크
                    straightFlush = this.getStraightHighCard(bits) || straightFlush;
                });

                if (straightFlush) {
                    return {
                        hand: straightFlush === 12 ? 'Royal Flush' : `${RANKS[straightFlush % 13]} Straight Flush`,
                        rank: straightFlush === 12 ? 10 : 9,
                        kicker: [straightFlush],
                    };
                }
            }

            const forCard = rankCounts.indexOf(4);
            if (forCard !== -1) {
                const kicker = rankCounts.findLastIndex((count, index) => count > 0 && index !== forCard);
                return { hand: `${RANKS[forCard % 13]} Qauds`, rank: 8, kicker: [forCard, kicker] };
            }

            const triple = rankCounts.lastIndexOf(3);
            const pairs = rankCounts.reduce((acc, currentValue, index) => (currentValue === 2 ? [...acc, index] : acc), []); // 2개 이상이면 index(rank)를 배열에 추가
            // console.log(pairs);

            // Full House
            if (triple !== -1) {
                if (pairs.length >= 1) {
                    return { hand: `${RANKS[triple % 13]} Full House`, rank: 7, kicker: [triple, Math.max(...pairs)] };
                }
                // 트립스 두개
                const secondTrips = rankCounts.lastIndexOf(3, triple - 1);
                if (secondTrips !== -1) {
                    return { hand: `${RANKS[triple % 13]} Full House`, rank: 7, kicker: [triple, secondTrips] };
                }
            }

            if (flush !== -1) {
                const flushRanks: number[] = [];

                allCards.forEach((card: number) => {
                    const suit = Math.floor(card / 13); // 0 ~ 3

                    if (suit === flush) {
                        const rank = card % 13; // 0 ~ 12
                        flushRanks.push(rank);
                    }
                });

                return { hand: `${SUITS[flush]} Flush`, rank: 6, kicker: flushRanks.sort((a, b) => b - a) };
            }

            if (straight) {
                return { hand: `${RANKS[straight % 13]} Straight`, rank: 5, kicker: [straight] };
            }

            if (triple !== -1) {
                const kickers = [];
                for (let i = 12; i >= 0 && kickers.length < 2; i--) {
                    if (i !== triple && rankCounts[i] > 0) kickers.push(i);
                }
                return { hand: `${RANKS[triple % 13]} Triple`, rank: 4, kicker: [triple, ...kickers] };
            }

            // Two pair
            if (pairs.length >= 2) {
                const kicker = rankCounts.findLastIndex((count: number) => count === 1);
                const [topPair, seconPair] = [Math.max(...pairs), pairs.sort((a, b) => b - a)[1]];

                return { hand: `${RANKS[topPair % 13]} ${RANKS[seconPair % 13]} Two Pair`, rank: 3, kicker: [topPair, seconPair, kicker || null] };
            }

            // One Pair
            if (pairs.length === 1) {
                const kickers = [];
                for (let i = 12; i >= 0 && kickers.length < 3; i--) {
                    if (i !== pairs[0] && rankCounts[i] > 0) {
                        kickers.push(i);
                    }
                }
                return { hand: `${RANKS[pairs[0] % 13]} One Pair`, rank: 2, kicker: [pairs[0], ...kickers] };
            }

            // High Card
            const highCards = [];
            for (let i = 12; i >= 0 && highCards.length < 5; i--) {
                if (rankCounts[i] > 0) highCards.push(i);
            }
            return { hand: `${RANKS[highCards[0] % 13]} High Card`, rank: 1, kicker: highCards };
        },

        // 모든 플레이어 핸드 계산
        evaluateAllPlayerHands() {
            this.players
                .filter((x) => x.cards.every((y: number) => y !== null))
                .forEach((player, i) => {
                    // 족보 계산
                    ({ hand: player.hand, kicker: player.kicker, rank: player.rank } = this.calculateHandRanking(player.cards, this.communityCards));
                    player.headPlayer = false;
                });
            // 지금 누가 이기고 있는지 계산
            this.calculateCountWinnerTie(this.players, null, true);
            // 승률 계산
            this.startCalculateWinRate();
        },

        // outs 계산
        calculateOuts() {
            // 앞으로 나올 카드의 조합을 모두 계산해서 승률 계산
            if (this.communityCardsCount === 3 || this.communityCardsCount === 4) {
                const time1 = performance.now();
                this.deck.forEach((tempCards, i) => {
                    this.seatedPlayers.forEach((player) => {
                        if (i === 0) {
                            player.outs = [];
                        }
                        ({ kicker: player.kicker, rank: player.rank } = this.calculateHandRanking(player.cards, [...this.communityCards, tempCards]));
                    });
                    this.calculateCountWinnerTie(this.players, tempCards);
                });
                const time2 = performance.now();
                console.log(`calculateOuts: ${time2 - time1}ms`);
            }
        },

        // 승률 계산 시작
        startCalculateWinRate() {
            // 앞으로 나올 카드의 조합을 모두 계산해서 승률 계산
            if (this.combinationCards.length) {
                const time1 = performance.now();
                this.combinationCards.forEach((tempCards, i) => {
                    this.seatedPlayers.forEach((player) => {
                        if (i === 0) {
                            player.winCount = 0;
                            player.tieCount = 0;
                        }
                        const res = this.calculateHandRanking(player.cards, [...this.communityCards, ...tempCards]);
                        player.kicker = res.kicker;
                        player.rank = res.rank;
                    });
                    this.calculateCountWinnerTie(this.players);
                });
                const time2 = performance.now();
                console.log(`calculateHandRanking: ${time2 - time1}ms`);
            } else {
                const time1 = performance.now();
                this.players.forEach((player) => {
                    player.winCount = 0;
                    player.tieCount = 0;
                });
                this.calculateCountWinnerTie(this.players);
                const time2 = performance.now();
                console.log(`calculateHandRanking: ${time2 - time1}ms`);
            }
        },

        // 승, 무승부 카운트 하기
        calculateCountWinnerTie(_players: any[], nextCard: number | null = null, current = false) {
            // rank가 가장 높은 패 찾기
            const highestRank = _players.reduce((acc, player) => Math.max(acc, player.rank), 0);
            // rank가 가장 높은 플레이어들 찾기
            let topPlayers = _players.filter((player) => player.rank === highestRank);
            // rank가 같은 경우 kicker 비교
            let winningPlayer = topPlayers[0];

            if (topPlayers.length > 1) {
                let isDraw = true;
                for (let i = 0; i < topPlayers[0]?.kicker.length; i++) {
                    const highestKicker = Math.max(...topPlayers.map((player) => (player.kicker[i] !== null ? player.kicker[i] : -1)));
                    const playersWithHighestKicker = topPlayers.filter((player) => player.kicker[i] === highestKicker);

                    if (playersWithHighestKicker.length === 1) {
                        winningPlayer = playersWithHighestKicker[0];
                        isDraw = false;
                        break;
                    } else {
                        topPlayers = playersWithHighestKicker;
                    }
                }

                if (isDraw) {
                    topPlayers.forEach((player) => {
                        if (current) {
                            player.headPlayer = true;
                        }
                        if (!nextCard) {
                            player.tieCount += 1;
                        } else {
                            if (!player.headPlayer) {
                                player.outs.push(nextCard);
                            }
                        }
                    });
                } else {
                    if (current) {
                        winningPlayer.headPlayer = true;
                    }
                    if (nextCard === null) {
                        winningPlayer.winCount += 1;
                    } else {
                        if (!winningPlayer.headPlayer) {
                            winningPlayer.outs.push(nextCard);
                        }
                    }
                }
            } else {
                // rank가 다른 경우 가장 높은 rank를 가진 플레이어가 승자
                if (current) {
                    winningPlayer.headPlayer = true;
                }
                if (nextCard === null) {
                    winningPlayer.winCount += 1;
                } else {
                    if (!winningPlayer.headPlayer) {
                        winningPlayer.outs.push(nextCard);
                    }
                }
            }
        },
    },
});
