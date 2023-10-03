<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  checked: boolean
}>(), {
  id: Math.floor(Math.random() * Date.now()).toString(36),
  checked: false,
})
</script>

<template>
  <div class="checkbox-wrapper">
    <input :id="id" :checked="checked" type="checkbox">
    <label :for="id" style="--size: 20px">
      <svg viewBox="0,0,50,50">
        <path d="M5 30 L 20 45 L 45 5" />
      </svg>
    </label>
  </div>
</template>

<style scoped>
.checkbox-wrapper *,
.checkbox-wrapper *:after,
.checkbox-wrapper *:before {
  box-sizing: border-box;
}

.checkbox-wrapper input {
  display: none;
}

.checkbox-wrapper input:checked + label svg path {
  stroke-dashoffset: 0;
}

.checkbox-wrapper input:focus + label {
  transform: scale(1.03);
}

.checkbox-wrapper input + label {
  display: block;
  border: 1px solid #333;
  width: var(--size);
  height: var(--size);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-wrapper input + label:active {
  transform: scale(1.05);
  border-radius: 12px;
}

.checkbox-wrapper input + label svg {
  pointer-events: none;
  padding: 5%;
}

.checkbox-wrapper input + label svg path {
  fill: none;
  stroke: #333;
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 101;
  transition: all 250ms cubic-bezier(1, 0, 0.37, 0.91);
}
</style>
