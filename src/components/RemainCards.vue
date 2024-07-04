<template>
    <div class="remain-card">
        <Card @click="cardStore.setCard(card)" v-for="(card, i) in allCards" :key="i" :card="card" :class="{ used: isUsedCards(card) }" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from '@/components/Card.vue';
import { useCardStore } from '@/stores/card.store';

const cardStore = useCardStore();
const allCards = ref<number[]>(Array.from({ length: 52 }, (_, i) => i));
const isUsedCards = computed(() => (x) => !cardStore.deck.includes(x));
</script>

<style scoped lang="scss">
.remain-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2px;
    width: 456px;
    margin: 0 auto;
    :deep(.card) {
        cursor: pointer;
    }
    .used {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.2;
    }
}
</style>
