<script setup lang='ts'>

</script>

<template>
  <div class="px-4 py-2 w-full flex justify-between items-center">
    <CommonTooltip placement="bottom" content="Bold">
      <button class="btn-icon" aria-label="Bold">
        <Icon name="material-symbols:format-bold" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Italic">
      <button class="btn-icon" aria-label="Italic">
        <Icon name="material-symbols:format-italic" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Underline">
      <button class="btn-icon" aria-label="Underline">
        <Icon name="majesticons:underline-line" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Code Block">
      <button class="btn-icon" aria-label="Code Block">
        <Icon name="mdi:code" size="1.2rem" />
      </button>
    </CommonTooltip>
    <div class="divider-vertical" />
    <CommonTooltip placement="bottom" content="Header Large">
      <button class="btn-icon" aria-label="Header Large">
        <Icon name="ci:heading-h1" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Header Medium">
      <button class="btn-icon" aria-label="Header Medium">
        <Icon name="ci:heading-h2" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Bullet List">
      <button class="btn-icon" aria-label="Bullet List">
        <Icon name="material-symbols:format-list-bulleted" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Numbered List">
      <button class="btn-icon" aria-label="Numbered List">
        <Icon name="ic:baseline-format-list-numbered" size="1.2rem" />
      </button>
    </CommonTooltip>
  </div>
</template>
