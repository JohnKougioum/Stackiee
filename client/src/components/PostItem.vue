<template>
  <div
    @click="gotoPost"
    class="md:w-full flex flex-col bg-white rounded-2xl shadow-lg p-2 cursor-pointer"
  >
    <div class="flex flex-row p-3">
      <div class="pl-2 pr-2 md:pr-4 flex">
        <img src="../assets/images/UserIcon.svg" alt="HTML5" />
      </div>
      <div class="flex flex-col">
        <div>
          <h1 class="text-sm text--gray__color">
            Δημοσιευτηκε απο
            <span class="text-blue-600">{{ details.user }}</span> στις
            {{ String(details.createtAt).substring(0, 10) }}
          </h1>
        </div>
        <div>
          <span class="text-xs bg-gray-300 rounded p-0.5">Student</span>
        </div>
      </div>
    </div>
    <div class="px-7 md:pl-20 md:pr-14 md:text-2xl">
      <h1>{{ details.title }}</h1>
    </div>
    <div class="break-line py-1 flex justify-center">
      <div class="h-0.5 border bg-gray-300 rounded w-5/6"></div>
    </div>
    <div class="flex flex-col px-7 md:pl-20 md:pr-14">
      <div>
        <p class="md:text-lg">
          {{ details.body }}
        </p>
      </div>
      <div class="pt-6 pb-2">
        <div class="flex flex-row">
          <img src="../assets/images/commentIcon.svg" alt="HTML5" />
          <span class="pl-2 text-sm italic">5 σχολια</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostItem",
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  methods: {
    gotoPost() {
      this.$router.push({ name: "Post", params: { id: this.details._id } });
    },
  },
};
</script>

<style lang="scss"></style>
