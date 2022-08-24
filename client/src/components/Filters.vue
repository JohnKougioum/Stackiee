<template>
  <div id="sidebar" class="fixed md:w-1/6 inset-y-0 text-sm mt-32 ml-8">
    <div class="filters flex flex-col">
      <div class="filter-semester">
        <div
          class="filter-semester-header bg-white font-normal text-lg p-2.5 pl-4 border-b-2 border-b-[#243c5a] rounded flex justify-between"
        >
          <div>Εξάμηνα</div>
          <button class="bg-blue-500 w-16 mr-2 text-white text-sm rounded">
            Επιλογή
          </button>
        </div>
        <div
          class="filter-semester-body h-48 overflow-y-auto border-b-4 border-b-[#243c5a]"
        >
          <ul id="semesters">
            <li v-for="semester in filtersData" :key="semester.id">
              <div class="flex justify-between">
                <label
                  :id="`${semester.id}`"
                  for="semester_name"
                  class="ml-2"
                  >{{ semester.value }}</label
                >
                <input
                  id="semester_name"
                  type="checkbox"
                  class="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="filter-course">
        <div
          class="filter-course-header bg-white font-normal text-lg p-2.5 pl-4 border-b-2 border-b-[#243c5a] rounded"
        >
          Μαθήματα
        </div>
        <div class="filter-course-body h-auto max-h-48 overflow-y-auto">
          <ul class="">
            <li v-for="course in courses" :key="course.id">
              <div class="flex justify-between">
                <label
                  :id="`${course.id}`"
                  for="course_name"
                  class="mx-2 w-1/2"
                  >{{ course.value }}</label
                >
                <input
                  id="course_name"
                  type="checkbox"
                  class="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <button
        v-on:click="filterSearch"
        class="w-full bg-blue-600 text-white text-base font-bold mt-1 p-2.5 rounded"
      >
        Αναζήτηση
      </button>
    </div>
    <!-- filter button for small screens -->
    <button
      id="open"
      class="container-1 md:invisible"
      v-on:click="modalHandler"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="64"
        height="64"
        viewBox="0 0 128 128"
        style="fill: #000000"
      >
        <path
          fill="#fff"
          d="M64 14A50 50 0 1 0 64 114A50 50 0 1 0 64 14Z"
        ></path>
        <path
          fill="#444b54"
          d="M64,117c-29.2,0-53-23.8-53-53s23.8-53,53-53s53,23.8,53,53S93.2,117,64,117z M64,17c-25.9,0-47,21.1-47,47s21.1,47,47,47s47-21.1,47-47S89.9,17,64,17z"
        ></path>
        <path
          fill="#444b54"
          d="M86.5 52h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3S88.2 52 86.5 52zM86.5 67h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3S88.2 67 86.5 67z"
        ></path>
        <g>
          <path
            fill="#444b54"
            d="M86.5,82h-45c-1.7,0-3-1.3-3-3s1.3-3,3-3h45c1.7,0,3,1.3,3,3S88.2,82,86.5,82z"
          ></path>
        </g>
      </svg>
    </button>
    <!-- filter's div for small screens -->
    <div
      class="modal modal_container h-auto overflow-y-auto md:invisible z-50"
      id="modal_container"
    >
      <div class="modal_header">
        <div class="title">Φίλτρα</div>
        <button
          id="close-button"
          class="close-button"
          v-on:click="modalHandler"
        >
          <svg
            class="h-8 w-8 text-black"
            width="12"
            height="12"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="modal-text h-screen pb-4">
        <div class="semester">
          <button class="collapsible">Εξάμηνο</button>
          <div class="content">
            <ul id="post_semester">
              <li v-for="semester in filtersData" :key="semester.id">
                <div class="flex justify-between">
                  <label
                    :id="`${semester.id}`"
                    for="semester_name"
                    class="ml-2"
                    >{{ semester.value }}</label
                  >
                  <input
                    id="semester_name"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div id="course" class="course">
          <button class="collapsible">Μάθημα</button>
          <div id="course1" class="content">
            <ul class="">
              <li v-for="course in courses" :key="course.id">
                <div class="flex justify-between">
                  <label
                    :id="`${course.id}`"
                    for="course_name"
                    class="mx-2 w-1/2"
                    >{{ course.value }}</label
                  >
                  <input
                    id="course_name"
                    type="checkbox"
                    class="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <button
          v-on:click="searchHandler"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Search
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import filtersData from "../assets/data/data.json";
import { mapActions } from "vuex";

export default {
  name: "Filters",
  mounted() {
    //access to semesters to check the changes
    const selectElement = document.getElementById("semesters");
    selectElement.addEventListener("change", (event) => {
      this.fillFilters();
    });
    const selectElement1 = document.getElementById("post_semester");
    selectElement1.addEventListener("change", (event) => {
      this.fillFilters();
    });
    //collapsible menu functionality
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var div_content = this.nextElementSibling;

        if (div_content.style.maxHeight) {
          div_content.style.maxHeight = null;
        } else {
          div_content.style.maxHeight = div_content.scrollHeight + "px";
        }
      });
    }
  },
  data() {
    return {
      filtersData: filtersData,
      selectedSemesters: [],
      courses: [],
      selectedCourses: [],
    };
  },
  methods: {
    ...mapActions(["FILTERING_POSTS"]),
    //modal handler open-close
    modalHandler() {
      const modal_container = document.getElementById("modal_container");
      modal_container.classList.toggle("active");
    },
    //funtion to fill all the semester, course options from data
    fillFilters() {
      this.selectedSemesters = [];
      this.courses = [];
      //GET ALL THE SELECTED SEMESTER CHECKBOXES
      var semesterCheckboxes = document.querySelectorAll(
        'input[id="semester_name"]:checked'
      );

      for (var checkbox of semesterCheckboxes) {
        //GET THE SEMESTER NAME OF THE SELECTED CHECKBOX
        var semester = checkbox.previousElementSibling;
        this.selectedSemesters.push({
          id: semester.id,
          value: semester.innerHTML,
        });

        //FILL THE COURSES' ARRAY
        for (var object of filtersData) {
          if (object.value == semester.innerHTML) {
            for (var course of object.courses) {
              this.courses.push({ id: course.id, value: course.value });
            }
          }
        }
      }
    },
    //filter functionality for sm screens (MODAL)
    searchHandler() {
      this.filterSearch();
      this.modalHandler();
    },
    //filter functionality
    filterSearch() {
      this.selectedCourses = [];

      var courseCheckboxes = document.querySelectorAll(
        'input[id="course_name"]:checked'
      );
      for (var checkbox of courseCheckboxes) {
        //GETS THE COURSE NAME OF THE SELECTED CHECKBOX
        var course = checkbox.previousElementSibling;
        this.selectedCourses.push({ id: course.id, value: course.value });
      }
      let obj = {
        prop1: this.selectedSemesters,
        prop2: this.selectedCourses,
      };
      this.$store.dispatch("FILTERING_POSTS", obj);
    },
  },
};
</script>

<style scoped>
.container-1 {
  align-items: center;
  border-radius: 50%;
  bottom: 2px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;
  padding: 0px;
  position: fixed;
  right: 2px;
  text-align: center;
  top: auto;
  width: 60px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(0);
  border: 1px solid black;
  background-color: white;
}

.modal.active {
  transform: scale(1);
}

.modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  top: 0;
  max-width: 100%;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 0 6px #dcdcdc;
  background-color: #fff;
  padding: 16px;
  font-weight: bold;
}

.modal_header .close-button {
  position: absolute;
  top: 13px;
  right: 16px;
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  font-size: 1rem;
}

.modal-text {
  background-color: #ebebeb;
  padding: 10px 15px;
}

.collapsible {
  background-color: white;
  color: rgb(0, 0, 0);
  cursor: pointer;
  padding: 18px;
  margin-top: 5px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active,
.collapsible:hover {
  background-color: white;
}

.collapsible:after {
  content: "\002B";
  color: black;
  font-weight: bold;
  float: right;
  margin-left: 5px;
}

.active:after {
  content: "\2212";
}

.content {
  padding: 0 10px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: white;
}

li div.flex {
  padding: 8px 16px 10px;
  background-color: #fff;
  border-bottom: 1px solid #ebebeb;
}

.semester {
  margin-top: 10px;
}
</style>
