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
            {{ String(details.createdAt).substring(0, 30) }}
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
          <div class="flex flex-row flex-1">
            <img src="../assets/images/commentIcon.svg" alt="HTML5" />
            <h3 class="pl-2 text-sm italic">{{ details.comments }} σχολια</h3>
          </div>
          <div data-tags>

            <span v-if="details.semester" class="tag"> {{ details.semester }} </span>
            <span v-if="details.course" class="tag"> {{ details.course }} </span>
          </div>
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

<style lang="scss">
.tag{
  background-color: $main-blue;
 @apply p-2 rounded-lg text-sm ml-1;
}
</style>
