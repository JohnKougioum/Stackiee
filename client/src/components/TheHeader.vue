<template>
  <nav
    class="fixed top-0 w-full bg-white border-gray-200 px-2 sm:px-4 py-4 rounded z-50"
  >
    <div
      class="container flex flex-wrap justify-between items-center mx-auto flex-row"
    >
      <div @click="gotoHome" class="flex items-center cursor-pointer">
        <img
          src="../assets/images/Logo.svg"
          class="mr-3 h-6 sm:h-9"
          alt="Stackiee Logo"
        />
      </div>
      <div class="relative flex flex-col md:order-1 pl-2 sm:w-auto md:w-2/5">
        <div class="relative mr-3 md:mr-0 md:block w-full">
          <form @submit.prevent="Search">
            <div
              class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="email-adress-icon"
              class="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              name="s"
              v-model="searchParams"
              autocomplete="off"
              @focus="this.showSearchHistory = true"
              @blur="this.showSearchHistory = false"
            />
          </form>
        </div>
        <SearchHistoryArea
          v-if="this.showSearchHistory"
          @emittedSearch="searchEmit"
          @emptyHistory="this.showSearchHistory = false"
        />
        <!-- <button
          data-collapse-toggle="mobile-menu-3"
          type="button"
          class="
            inline-flex
            items-center
            p-2
            ml-3
            text-sm text-gray-500
            rounded-lg
            md:hidden
            hover:bg-gray-100
            focus:outline-none focus:ring-2 focus:ring-gray-200
            dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600
          "
          aria-controls="mobile-menu-3"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button> -->
      </div>
      <div
        class="md:justify-between items-center md:flex md:w-auto md:order-1"
        id="mobile-menu-3"
      >
        <ul
          class="flex flex-col md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium items-center"
        >
          <li>
            <router-link
              v-if="!this.auth"
              to="/login"
              class="hidden md:block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:text-white md:p-1 md:mt-1 dark:text-white"
              aria-current="page"
              >Login</router-link
            >
          </li>
          <li class="cursor-pointer relative">
            <img
              @click="this.showMenu = !this.showMenu"
              src="../assets/images/UserIcon.svg"
              alt="user"
            />
            <div
              v-if="this.showMenu"
              class="absolute top-14 -right-1 w-32 h-40 flex flex-row justify-center pt-3 bg-white shadow-md rounded"
            >
              <div class="flex flex-col">
                <ul class="space-y-2">
                  <li class="flex flex-row items-center">
                    <img
                      src="../assets/images/profileIconMenu.svg"
                      alt="profileicon"
                    />
                    <router-link to="/profile" class="pl-2 text-base"
                      >Profile</router-link
                    >
                  </li>
                  <li class="flex flex-row items-center">
                    <img src="../assets/images/logoutIcon.svg" alt="logout" />
                    <a href="" class="pl-2 text-base">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>,
    </div>
  </nav>
</template>

<script>
import Authentication from "../auth";
import SearchHistoryArea from "./SearchHistoryArea.vue";
export default {
  name: "TheHeader",
  components: {
    SearchHistoryArea,
  },
  data() {
    return {
      searchParams: "",
      showMenu: false,
      auth: Authentication.isAuthenticated(),
      showSearchHistory: false,
    };
  },
  methods: {
    gotoHome() {
      this.searchParams = "";
      this.$router.push({ name: "Home" });
    },
    Search: function () {
      if (!this.searchParams.trim().length) return;
      this.$router.push({ name: "Search", query: { s: this.searchParams } });
    },
    searchEmit(searchTerm) {
      this.searchParams = searchTerm;
      this.Search();
    },
  },
};
</script>

<style></style>
