<template>
    <div class="game-board">
        <RemainCards />

        <div class="control">
            <input v-model.number="cardStore.playerCount" type="number" min="2" max="11" />
            <button @click="startGame">Reset</button>
            <button @click="cardStore.dealCardsForPlayer">Dealing PlayerCards</button>
            <button @click="cardStore.dealCummunityCards">Dealing CommunityCard</button>
        </div>

        <Table />

        <p>{{ error }}</p>
        <ul class="info">
            <li>Winner : <span class="winner">Win</span></li>
            <li>Runner Runner : <span class="runner">RR</span></li>
            <li>Drawing Dead : <span class="drawingDead">DD</span></li>
            <li>Outs 있을때 : <span class="outs">Outs</span></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Table from '@/components/Table.vue';
import { useCardStore } from '@/stores/card.store';
import RemainCards from '@/components/RemainCards.vue';

const error = ref('');
const cardStore = useCardStore();

onMounted(() => {
    startGame();
});

watch(
    () => cardStore.playerCount,
    () => {
        startGame();
    },
);

function startGame() {
    if (cardStore.playerCount < 2 || cardStore.playerCount > 11) {
        error.value = '플레이어 수는 2에서 11사이여야 합니다.';
        return;
    }
    cardStore.initCards();
    cardStore.players = Array.from({ length: cardStore.playerCount }, (x, i) => ({ playerId: i, cards: [null, null], win: 0, winCount: 0, tie: 0, tieCount: 0, rank: 0, outs: [], hand: '', kicker: [] }));
    cardStore.shuffleDeck();
}
</script>

<style scoped lang="scss">
.game-board {
    width: 600px;
    margin: 0 auto;
}
.control {
    display: flex;
    gap: 4px;
    justify-content: center;
    margin: 16px auto 40px;
    button {
        cursor: pointer;
    }
    & > * {
        height: 40px;
        text-align: center;
    }
}

.info {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    li {
        span {
            border: 1px solid #000;
            border-radius: 50%;
            padding: 5px;
            font-size: 12px;
        }
        .winner {
            color: #fff;
            background: #ff6000;
        }
        .drawingDead {
            background: black;
            color: #fff;
        }
        .runner {
            background: cadetblue;
            color: #fff;
        }
        .outs {
            background: bisque;
            color: #000;
        }
    }
}
</style>
