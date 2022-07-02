<template>
  <div class="flex flex-col h-auto px-8 md:px-12 py-7">
    <div>
      <h1 class="text--gray__color text-sm">
        Δημοσιευτηκε απο
        <span class="text-blue-600"
          ><i>{{ postData.user }}</i></span
        >
        πριν 2 ωρες
      </h1>
    </div>
    <div class="py-6 md:post--content__margin">
      <div class="flex flex-col pb-4">
        <h1 class="text-xl font-medium">{{ postData.title }}</h1>
      </div>
      <div>
        <p>
          {{ postData.body }}
        </p>
      </div>
    </div>
    <div>
      <div class="flex flex-row">
        <img src="../assets/images/commentIcon.svg" alt="HTML5" />
        <span class="pl-2 text-sm italic">5 σχολια</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostView",
  props: {
    postData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.post--content__margin {
  margin: 2rem 0rem 3rem 2rem;
}
</style>
