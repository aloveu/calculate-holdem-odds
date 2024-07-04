<template>
    <div class="player" :class="{ headPlayer: player.headPlayer, winner: isWinner, drawingDead: isDrawingDead, runner: isRunnerRunner, outs: hasOuts }">
        <ul class="cards">
            <li @click="toggleCardPosition(i)" v-for="(card, i) in player.cards" :key="i" :class="{ selected: selectedPosition(i) }">
                <Card v-if="card !== null" :card="card" class="player-hand" />
            </li>
        </ul>
        <div class="win">Win : {{ winRate }}%</div>
        <div class="tie">Tie : {{ tieRate }}%</div>
        <div class="hand">{{ player.hand }}</div>
        <div v-if="hasOuts" class="outs-wrapper">
            <Card v-for="(out, i) in sortedOuts" :key="i" :card="out" class="outs" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';
import { computed } from 'vue';
import { useCardStore } from '@/stores/card.store';
import type { Player } from '@/model/card';

const player = defineModel<Player>('player');
const cardStore = useCardStore();
const selectedPosition = computed(() => (cardIndex) => cardStore.manualDealingTarget.target === player.value.playerId && cardStore.manualDealingTarget.index === cardIndex);
const winRate = computed(() => ((player.value.winCount / (cardStore.combinationCount || 1)) * 100).toFixed(2));
const tieRate = computed(() => ((player.value.tieCount / (cardStore.combinationCount || 1)) * 100).toFixed(2));
const isWinner = computed(() => Number(winRate.value) == 100 || Number(tieRate.value) === 100);
const isDrawingDead = computed(() => cardStore.communityCardsCount !== 5 && cardStore.isPossibleCalulateOdds && !player.value?.winCount && !player.value?.tieCount && player.value?.cards.every((x) => x !== null));
const isRunnerRunner = computed(() => !player.value.headPlayer && cardStore.communityCardsCount === 3 && (player.value?.winCount || player.value?.tieCount) && !player.value?.outs.length);
const sortedOuts = computed(() => player.value.outs.sort((a, b) => a - b));
const hasOuts = computed(() => !player.value.headPlayer && sortedOuts.value.length && cardStore.communityCardsCount < 5);

function toggleCardPosition(cardIndex) {
    cardStore.manualDealingTarget = { target: player.value.playerId, index: cardIndex };

    // 이미 있으면 덱에 넣고 플레이어 카드 제거
    if (!!player.value.cards[cardIndex]) {
        // 일단 푸쉬인데 나중에 섞을지...
        cardStore.deck.push(player.value.cards[cardIndex]);
        player.value.cards[cardIndex] = null;

        cardStore.reCalculateWinRate();
    }
}
</script>

<style scoped lang="scss">
.player {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 110px;
    height: 105px;
    text-align: center;
    font-size: 12px;
    line-height: 1;
    padding: 5px;
    &.headPlayer {
        .cards li {
            border-color: #ff7800;
        }
        .win,
        .tie {
            font-weight: 700;
        }
    }
    &::after {
        position: absolute;
        right: 0;
        padding: 5px;
        border: 1px solid #000;
        border-radius: 50%;
    }
    &.winner {
        &::after {
            content: 'Win';
            color: #fff;
            background: #ff6000;
            border-color:#ff6000;
        }
    }
    &.drawingDead {
        &::after {
            content: 'DD';
            background: black;
            color: #fff;
        }
    }
    &.runner {
        &::after {
            content: 'RR';
            background: cadetblue;
            color: #fff;
        }
    }
    &.outs {
        &::after {
            content: 'Outs';
            background: bisque;
            color: #000;
        }
    }
    .cards {
        display: flex;
        justify-content: center;
        gap: 4px;
        li {
            border: 1px solid #000;
            border-radius: 3px;
            width: 35px;
            height: 50px;
            &.selected {
                border-color: #c00402;
            }
        }
    }
    .win {
    }
    .tie {
    }
    .hand {
        font-size: 14px;
        font-weight: 700;
    }

    .outs-wrapper {
        display: none;
        position: absolute;
        top: 30px;
        right: 0;
        z-index: 2;
        transform: translateX(calc(50% - 20px));
        flex-wrap: wrap;
        gap: 4px;
        max-width: 96px;
        padding: 5px;
        border: 1px solid #000;
        border-radius: 5px;
        background: bisque;
    }
    &:hover {
        .outs-wrapper {
            display: flex;
        }
    }
}
</style>
