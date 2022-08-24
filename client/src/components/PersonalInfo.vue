<template>
  <div>
    <div class="card">
      <div class="card-header text-left">
        <h5 class="card-header-text text-black text-lg">Στοιχεία Χρήστη</h5>
      </div>
      <div class="card-block">
        <div id="view-info" class="p-4">
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6]"
          >
            <p class="">Όνομα</p>
            <p class="px-9">{{ userData.firstName }}</p>
          </div>
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6]"
          >
            <p class="">Επώνυμο</p>
            <p class="px-9">{{ userData.lastName }}</p>
          </div>
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6]"
          >
            <p class="">Ημερομηνία Γέννησης</p>
            <p class="px-9">XXXXX</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card my-10">
      <div class="card-header text-left">
        <h5 class="card-header-text text-black text-lg">
          Στοιχεία Επικοινωνίας
        </h5>
      </div>
      <div class="card-block">
        <div id="view-info" class="p-4">
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6] text-left"
          >
            <p>Αριθμός Τηλεφώνου</p>
            <p class="pr-9">XXXXX</p>
          </div>
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6] text-left"
          >
            <p>Email</p>
            <p class="pr-9">{{ userData.mail }}</p>
          </div>
          <div
            class="flex justify-between w-full md:w-1/2 p-3 border-t border-t-solid border-t-[#ebeae6] text-left"
          >
            <p>LinkedIn</p>
            <p class="pr-9">XXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonalInfo",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  box-sizing: inherit;

  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 2.94px 0.06px rgba(4, 26, 55, 0.16);
  border: none;
}
.card-header {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  word-wrap: break-word;
  box-sizing: inherit;
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}
.card-block {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  word-wrap: break-word;
  box-sizing: inherit;
}
.media-object {
  margin: 2px 10px;
}
</style>
