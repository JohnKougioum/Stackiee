<template>
  <div
    class="flex flex-col h-auto md:flex-row md:justify-between px-5 mx-auto pt-36 lg:px-36"
  >
    <!-- LEFT SIDE START -->
    <div class="profile-nav w-full md:w-1/3">
      <!-- PROFIL DETAILS -->
      <div
        class="panel h-auto mx-auto my-4 w-3/5 md:w-full lg:w-2/3 bg-white border border-solid border-transparent rounded"
      >
        <div
          class="p-7 bg-white text-black text-center border border-solid border-[#ebeae6]"
        >
          <a href="#" class="rounded-full">
            <img
              class="w-28 h-28 rounded-full mx-auto"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
          </a>
          <h1 class="text-base font-medium my-2">Μαλούδης Απόστολος</h1>
          <p class="text-sm">{{ this.userId }}</p>
          <div class="flex justify-around mt-5 mx-6">
            <button
              type="button"
              class="btn btn-follow btn-sm border border-black text-white rounded-lg px-2.5"
            >
              Follow
            </button>
            <button
              type="button"
              class="btn btn-message btn-sm bg-blue-700 border border-black text-white rounded-lg px-2.5"
            >
              Message
            </button>
          </div>
        </div>
        <ul class="z-0 side-menu block mt-px">
          <li
            class="float-none block relative border-b border-b-solid border-b-[#ebeae6] leading-7"
          >
            <a
              v-on:click="sidebarToggler('panel1')"
              id="first"
              class="side-menu block relative py-2.5 px-3.5 no-underline bg-[#f8f7f5]"
            >
              <i class="fa fa-user text-sm ml-1 pr-3.5"></i> Πληροφορίες
              Χρήστη</a
            >
          </li>
          <li
            class="float-none block relative border-b border-b-solid border-b-[#ebeae6] leading-7"
          >
            <a
              v-on:click="sidebarToggler('panel2')"
              id="second"
              class="side-menu block relative py-2.5 px-3.5 no-underline bg-[#f8f7f5]"
            >
              <i class="material-icons text-lg pr-2.5">&#xe0bf;</i> Δημοσιεύσεις
              <span
                class="mt-0.5 text-white text-sm bg-blue-700 pull-right r-activity inline"
                >9</span
              ></a
            >
          </li>
          <li class="float-none">
            <a
              v-on:click="sidebarToggler('panel3')"
              id="third"
              class="side-menu block relative py-2.5 px-3.5"
            >
              <i class="material-icons text-lg pr-2.5">&#xe7fb;</i>
              Φίλοι</a
            >
          </li>
        </ul>
      </div>
      <!-- FRIENDS LIST -->
      <div
        class="panel my-8 mx-auto w-3/5 md:w-full lg:w-2/3 bg-white border border-solid border-transparent rounded"
      >
        <div class="card">
          <div class="card-header">
            <h5 class="card-header-text text-black text-lg">Friends</h5>
          </div>
          <div class="card-block friend-box flex flex-wrap p-2">
            <img
              class="media-object img-radius w-10 rounded-full"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
            <img
              class="media-object img-radius w-10 rounded-full"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
            <img
              class="media-object img-radius w-10 rounded-full"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
            <img
              class="media-object img-radius w-10 rounded-full"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
            <img
              class="media-object img-radius w-10 rounded-full"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <!-- RIGHT SIDE START -->
    <div class="profile-info h-auto md:w-2/3">
      <div class="panels block w-full md:pl-7 mx-auto my-4" id="panel1">
        <FetchJson :url="`http://localhost:5000/api/user/${this.userId}`">
          <template v-slot="{ json: profile, loading }">
            <SpinnerLoader class="relative center" v-if="loading" />
            <PersonalInfo v-else :userData="profile" />
          </template>
        </FetchJson>
      </div>
      <div class="panels hidden w-full md:pl-7 mx-auto my-4" id="panel2">
        <div class="custom-width">
          <PostsArea :posts="getProfilePosts" />
        </div>
      </div>
      <div class="panels hidden w-full md:pl-7 mx-auto my-4" id="panel3">
        {{ this.user }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PostsArea from "../components/PostsArea.vue";
import FetchJson from "../components/FetchJson.vue";
import SpinnerLoader from "../components/SpinnerLoader.vue";
import PersonalInfo from "../components/PersonalInfo.vue";
export default {
  name: "Profile",
  components: {
    PostsArea,
    FetchJson,
    SpinnerLoader,
    PersonalInfo,
  },
  mounted() {
    this.$store.dispatch("FETCH_PROFILE_POSTS", this.userId);
  },
  computed: {
    ...mapGetters(["getProfilePosts"]),
  },
  methods: {
    sidebarToggler(panel) {
      var panelContent = document.getElementsByClassName("panels");
      for (var i = 0; i < panelContent.length; i++)
        panelContent[i].style.display = "none";
      document.getElementById(panel).style.display = "block";
    },
    ...mapActions(["FETCH_POSTS", "FETCH_PROFILE_INFO"]),
  },
  data() {
    return {
      userId: this.$route.params.user,
    };
  },
};
</script>

<style scoped>
.side-menu a:hover,
.side-menu li.active a {
  background-color: #eeeeee;
  border-left: 4px solid black;
}
.r-activity {
  display: inline;
  padding: 0.2em 0.6em 0.3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
}

.btn-follow {
  background-color: #12ab12;
}
</style>
