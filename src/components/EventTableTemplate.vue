<template>
    <div class="event-table">
        <div class="dealer">D</div>
        <div :class="`players ring-${props.player}`">
            <div v-for="i in props.player" :key="i" class="player">
                {{ i + 1 }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    player: number;
}>();
</script>

<style scoped lang="scss">
.event-table {
    position: relative;
    width: 346px;
    height: 199px;
    padding: 50px;
    .hall {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-radius: 123px;
        font-size: 14px;
        cursor: pointer;
        background: $table-empty;
        color: $black;
        text-transform: uppercase;
        .room-name {
            font-size: 16px;
            line-height: 1;
        }
        .table-name {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
        }
        .seat-no {
            font-size: 30px;
            font-weight: 700;
            line-height: 1;
        }
    }
    .dealer {
        position: absolute;
        bottom: 0;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.2em;
        height: 2.2em;
        border: 1px solid $gray-3;
        box-sizing: border-box;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        transform: translate(-50%, 0);
        &.seating {
            color: $white;
            background-color: $seat-dealer;
            border: 0;
        }
    }
    .players {
        cursor: pointer;
        .player {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.2em;
            height: 2.2em;
            box-sizing: border-box;
            border-radius: 50%;
            text-align: center;
            font-size: 20px;
            line-height: 1;
            &.sit-in-before-start {
                & > span {
                    &.ready,
                    &.seated {
                        background-color: $seat-before-start;
                    }
                }
            }
            & > span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                border: 1px solid $gray-3;
                border-radius: 50%;
                background: $seat-empty;
                color: $gray-7;
                &.occupied {
                    color: $seat-occupied-text;
                    border-color: $seat-occupied;
                    background-color: $seat-occupied;
                    cursor: default;
                }
                &.ready {
                    color: $seat-wait-text;
                    background-color: $seat-seated;
                    font-size: 12px;
                }
                &.seated {
                    background-color: $seat-seated;
                    border-color: $seat-seated;

                    .warning-icon {
                        position: absolute;
                        top: 0;
                        right: 3px;
                        color: $seat-wait-text;
                        font-size: 15px;

                        &.warning {
                            color: #eb6100;
                        }
                        &.ban {
                            color: #c00402;
                        }
                    }
                }
                &.bust {
                    font-size: 12px;
                    color: $seat-out-text;
                    background-color: $seat-out;
                    border-color: $seat-out;
                }
            }
        }
        &.ring-11 {
            .position-1 {
                left: 23.958%;
                bottom: 0;
            }
            .position-2 {
                bottom: 9.5%;
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
                bottom: 9.5%;
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
}

@media (min-width: 850px) and (max-width: 1366px) {
    .event-table {
        width: 351px;
        height: 221px;
        padding: 53px 51px;
        .hall {
            border-radius: 58px;
            .room-name {
                font-size: 16px;
            }
            .table-name {
                font-size: 20px;
            }
            .seat-no {
                font-size: 30px;
            }
        }
        .dealer {
            width: 2.25em;
            height: 2.25em;
        }
        .players {
            .player {
                width: 2.25em;
                height: 2.25em;
            }
        }
    }
}
</style>
