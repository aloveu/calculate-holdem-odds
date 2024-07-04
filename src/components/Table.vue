<template>
    <div class="event-table">
        <ul class="hall">
            <li @click="toggleCardPosition(i)" v-for="(card, i) in cardStore.communityCards" :key="i" :class="{ flop: i === 2, selected: selectedPosition(i) }">
                <Card v-if="card !== null" :card="card" class="community" />
            </li>
        </ul>
        <div :class="['players', `ring-${cardStore.playerCount}`]">
            <Seat v-for="player in cardStore.players" :key="player.playerId" :player="player" :class="[`position-${player.playerId + 1}`]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Seat from '@/components/Seat.vue';
import Card from '@/components/Card.vue';
import { useCardStore } from '@/stores/card.store';

const cardStore = useCardStore();

const selectedPosition = computed(() => (cardIndex) => {
    return cardStore.manualDealingTarget.target === 'c' && cardStore.manualDealingTarget.index === cardIndex;
});

function toggleCardPosition(cardIndex) {
    cardStore.manualDealingTarget = { target: 'c', index: cardIndex };

    // 이미 있으면 덱에 넣고 커뮤니티카드 제거
    if (!!cardStore.communityCards[cardIndex]) {
        // 일단 푸쉬인데 나중에 섞을지...
        cardStore.deck.push(cardStore.communityCards[cardIndex]);
        cardStore.communityCards[cardIndex] = null;

        cardStore.reCalculateWinRate();
    }
}
</script>

<style scoped lang="scss">
.event-table {
    position: relative;
    width: 590px;
    height: 370px;
    padding: 105px 110px;
    .hall {
        display: flex;
        gap: 4px;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 60px;
        border: 1px solid #000;
        border-radius: 123px;
        font-size: 14px;
        cursor: pointer;
        background: #42b883;
        color: #000;
        text-transform: uppercase;
        li {
            width: 42px;
            height: 60px;
            border: 1px solid #fff;
            border-radius: 4px;
            &.flop {
                margin-right: 8px;
            }
            &.selected {
                border-color: #c00402;
            }
        }
    }
}
.players {
    cursor: pointer;
    &.ring-11 {
        .position-1 {
            left: 23.958%;
            bottom: 0;
        }
        .position-2 {
            bottom: 5%;
            left: 6.25%;
        }
        .position-3 {
            top: 38.148%;
            left: 0;
        }
        .position-4 {
            top: 9.25%;
            left: 6.25%;
        }
        .position-5 {
            top: 0;
            left: 23.958%;
        }
        .position-6 {
            left: 50%;
            top: 0;
            transform: translate(-50%, 0);
        }
        .position-7 {
            top: 0;
            right: 23.958%;
        }
        .position-8 {
            top: 9.25%;
            right: 6.25%;
        }
        .position-9 {
            top: 38.148%;
            right: 0;
        }
        .position-10 {
            bottom: 5%;
            right: 6.25%;
        }
        .position-11 {
            bottom: 0;
            right: 23.958%;
        }
    }
    &.ring-10 {
        .position-1 {
            left: 23.958%;
            bottom: 0;
        }
        .position-2 {
            left: 4.6875%;
            bottom: 7.037%;
        }
        .position-3 {
            left: 0;
            top: 36.6%;
        }
        .position-4 {
            top: 6%;
            left: 8.92%;
        }
        .position-5 {
            top: 0;
            left: 30.75%;
        }
        .position-6 {
            top: 0;
            right: 30.75%;
        }
        .position-7 {
            top: 6%;
            right: 8.92%;
        }
        .position-8 {
            right: 0;
            top: 36.6%;
        }
        .position-9 {
            right: 4.6875%;
            bottom: 7.037%;
        }
        .position-10 {
            right: 23.958%;
            bottom: 0;
        }
    }
    &.ring-9 {
        .position-1 {
            bottom: 0;
            left: 20.8333%;
        }
        .position-2 {
            bottom: 21.1667%;
            left: 2.0208%;
        }
        .position-3 {
            top: 15.5%;
            left: 2.0208%;
        }
        .position-4 {
            top: 0;
            left: 20.8333%;
        }
        .position-5 {
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
        }
        .position-6 {
            top: 0;
            right: 20.8333%;
        }
        .position-7 {
            top: 15.5%;
            right: 2.0208%;
        }
        .position-8 {
            bottom: 21.1667%;
            right: 2.0208%;
        }
        .position-9 {
            bottom: 0;
            right: 20.8333%;
        }
    }
    &.ring-8 {
        .position-1 {
            bottom: 0;
            left: 19.7917%;
        }
        .position-2 {
            bottom: 22%;
            left: 0;
        }
        .position-3 {
            top: 12.8%;
            left: 3.125%;
        }
        .position-4 {
            top: 0;
            left: 26.0417%;
        }
        .position-5 {
            top: 0;
            right: 26.0417%;
        }
        .position-6 {
            top: 12.8%;
            right: 3.125%;
        }
        .position-7 {
            bottom: 22%;
            right: 0;
        }
        .position-8 {
            bottom: 0;
            right: 19.7917%;
        }
    }
    &.ring-7 {
        .position-1 {
            bottom: 3.333%;
            left: 13.5417%;
        }
        .position-2 {
            top: 40.8333%;
            left: 0;
        }
        .position-3 {
            top: 3.333%;
            left: 13.5417%;
        }
        .position-4 {
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
        }
        .position-5 {
            top: 3.333%;
            right: 13.5417%;
        }
        .position-6 {
            top: 40.8333%;
            right: 0;
        }
        .position-7 {
            bottom: 3.333%;
            right: 13.5417%;
        }
    }
    &.ring-6 {
        .position-1 {
            bottom: 0;
            left: 15.104%;
        }
        .position-2 {
            top: 38%;
            left: 0;
        }
        .position-3 {
            top: 0;
            left: 22.396%;
        }
        .position-4 {
            top: 0;
            right: 22.396%;
        }
        .position-5 {
            top: 38%;
            right: 0;
        }
        .position-6 {
            bottom: 0;
            right: 15.104%;
        }
    }
    &.ring-5 {
        .position-1 {
            bottom: 3.333%;
            left: 13.5417%;
        }
        .position-2 {
            top: 3.333%;
            left: 13.5417%;
        }
        .position-3 {
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
        }
        .position-4 {
            top: 3.333%;
            right: 13.5417%;
        }
        .position-5 {
            bottom: 3.333%;
            right: 13.5417%;
        }
    }
    &.ring-4 {
        .position-1 {
            bottom: 0;
            left: 15.104%;
        }
        .position-2 {
            top: 0;
            left: 22.396%;
        }
        .position-3 {
            top: 0;
            right: 22.396%;
        }
        .position-4 {
            bottom: 0;
            right: 15.104%;
        }
    }
    &.ring-3 {
        .position-1 {
            top: 40.8333%;
            left: 0;
        }
        .position-2 {
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
        }
        .position-3 {
            top: 40.8333%;
            right: 0;
        }
    }
    &.ring-2 {
        .position-1 {
            top: 40.8333%;
            left: 0;
        }
        .position-2 {
            top: 40.8333%;
            right: 0;
        }
    }
}
</style>
