<script setup lang="ts">
import { onMounted, ref } from "vue";

const colorPalette = ["black", "white", "blue", "red", "yellow", "green"];

const canvas = ref(null);
// onMounted(() => {
// const ctx = (canvas.value as HTMLCanvasElement).getContext("2d");
// console.log(ctx);
// });
</script>
<template>
  <div class="wb--container">
    <div class="wb--container--controls">
      <div class="wb--container--controls--pen">
        <div class="wb--container--controls--pen__size"></div>
        <div class="wb--container--controls--pen__size"></div>
        <div class="wb--container--controls--pen__size"></div>
        <div class="wb--container--controls--pen__size"></div>
        <div class="wb--container--controls--pen__size"></div>
      </div>
      <div class="wb--container--controls--palette">
        <div
          v-for="(color, index) in colorPalette"
          :key="index"
          class="w-8 h-8 wb--container--controls--palette__color"
          :style="`background-color:${color}`"
        ></div>
      </div>

      <div class="wb--container--controls__clearBtn">
        <Button>Clear</Button>
      </div>
    </div>
    <div class="wb--container--canvas">
      <canvas id="canvas" ref="canvas"></canvas>
    </div>
  </div>
</template>
<style lang="scss">
.wb--container {
  display: flex;
  flex-direction: column;

  .wb--container--controls {
    padding: 1rem;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &--pen {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      &__size {
        background-color: black;
        border-radius: 50%;
        margin: 3px;
        opacity: 0.4;
      }

      &__size:nth-child(1) {
        width: 5px;
        height: 5px;
      }

      &__size:nth-child(2) {
        width: 10px;
        height: 10px;
      }

      &__size:nth-child(3) {
        width: 15px;
        height: 15px;
        opacity: 1;
      }

      &__size:nth-child(4) {
        width: 20px;
        height: 20px;
      }

      &__size:nth-child(5) {
        width: 25px;
        height: 25px;
      }

      &__size:hover {
        cursor: pointer;
        opacity: 1 !important;
      }
    }

    &--palette {
      margin: 25px 0px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0 1.5rem;

      &__color {
        margin: 0 0.04rem;
        border-radius: 0.25rem;
        transition: all 120ms;
      }
      &__color:hover {
        transform: scale(1.2);
        border-radius: 50%;
        cursor: pointer;
        z-index: 1;
      }
    }
  }

  .wb--container--canvas {
    #canvas {
      width: 100%;
      color: white;
      background-color: wheat;
    }
  }
}
</style>
