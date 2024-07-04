<template>
    <div :class="[{ red: isRed }, 'card']">
        {{ rank }}
        <span class="suit">{{ suit }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RANKS, SUITS } from '@/stores/card.store';

const card = defineModel<number>('card');

const rank = computed(() => RANKS[card.value % 13]);
const suit = computed(() => SUITS[Math.floor(card.value / 13)]);
const isRed = computed(() => suit.value === '♦' || suit.value === '♥');
</script>
<style scoped lang="scss">
.card {
    position: relative;
    display: inline-block;
    width: 33px;
    height: 48px;
    padding: 1px;
    border: 1px solid #2b2b2b;
    line-height: 1;
    font-size: 12px;
    background: #fff;
    text-align: left;
    &.red {
        color: red;
    }
    .suit {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 16px;
        transform: translate(-50%, -50%);
    }
    &.player-hand {
        width: 33px;
        height: 48px;
        padding: 2px;
        font-size: 14px;
        border: 0;
        border-radius: 3px;
        .suit {
            font-size: 20px;
        }
    }
    &.community {
        width: 40px;
        height: 58px;
        padding: 2px;
        font-weight: 700;
        font-size: 16px;
        border-radius: 4px;
        border: 0;
        .suit {
            font-size: 30px;
        }
    }
    &.outs {
        width: 18px;
        height: 24px;
        padding: 1px;
        font-size: 10px;
        border-radius: 1px;
        .suit {
            font-size: 14px;
            top:16px;
            left:65%;
        }
    }
}
</style>
