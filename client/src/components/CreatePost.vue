<template>
    <div class="my-32 mx-auto w-3/5 py-24px pb-24px" id="xc">
        <div class="grid grid-cols-1 md:grid-cols-12 w-full">
            <!-- START: LEFT SIDE -->
            <div class="md:col-span-8 py-20px rounded bg-white m-2 py-1.5 px-3">
                <div class="grid grid-cols-12 pt-1.5">
                    <h4 class="text-blue-600 col-span-12 py-2 font-medium leading-tight text-2xl ">Νέα δημοσίευση</h4>
                </div>
                <hr>
                <div class="grid grid-cols-12 mt-3 px-2">
                    <div class="col-span-12 sm:col-span-6">
                        <label for="post_semester" class="col-span-12 col-form-label font-medium text-lg">Επέλεξε εξάμηνο</label>
                        <div class="col-span-12 my-1.5">
                            <select
                            id="post_semester"
                            name="post_semester"
                            @change="populate()"
                            class="custom-select w-full rounded border border-solid border-gray-200 p-1"
                            v-model="semester" required
                            >
                            <option v-for="semester in filtersData" :key="semester.id" :value="`${semester.value}`" :id="`${semester.id}`">{{ semester.value }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-6 sm:ml-3">
                        <div class="form-group grid grid-cols-12">
                            <label for="post_course" class="col-span-12 col-form-label font-medium text-lg">Επέλεξε μάθημα</label>
                            <div class="col-span-12 my-1.5 rounded">
                                <select
                                id="post_course"
                                name="post_course"
                                class="custom-select w-full border
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-clip-padding
                                    border border-solid border-gray-300
                                    rounded p-1" v-model="course" required
                                >
                                <option v-for="course in courses" :key="course.id" :value="`${course.value}`" :id="`${course.id}`">{{ course.value }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 mt-2 px-2">
                    <div class="col-span-12">
                        <div class="form-group grid grid-cols-12">
                            <div class="col-span-12 ">
                                <input
                                type="text"
                                v-model="title"
                                id="post_title"
                                name="post_title"
                                placeholder="Τίτλος δημοσίευσης"
                                class="
                                    form-control
                                    here
                                    w-full
                                    p-1
                                    rounded
                                    border
                                    border-solid
                                    border-gray-200
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border border-solid border-gray-300
                                    rounded"
                                required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 px-2 mt-3">
                    <div class="col-span-12">
                        <div class="form-group grid grid-cols-12">
                            <div class="col-span-12">
                                <textarea
                                v-model="body"
                                id="textarea"
                                name="textarea"
                                maxlength="800"
                                placeholder="Περιεχόμενο"
                                required
                                class="
                                    form-control
                                    block
                                    w-full
                                    px-3
                                    h-40
                                    md:h-56
                                    max-h-80
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border border-solid border-gray-300
                                    rounded"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 mt-2 px-2">
                    <div class="col-span-12">
                        <div class="form-group grid grid-cols-12">
                            <div class="col-span-12">
                                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 mb-2 mt-1 rounded" v-on:click="createNewPost">
                                    Δημοσίευση
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: LEFT SIDE -->
            <!-- START: RIGHT SIDE -->
            <div class="hidden w-full md:block md:col-span-4 mt-2 ml-4 rounded">
                <div class="grid grid-cols-12">
                    <div class="col-span-12 bg-white">
                        <div id="c" class="mb-4">
                                <div class="md:font-bold md:text-base lg:text-xl px-6 py-4">Δημιουργία ανάρτησης στο Stackiee</div>
                        </div>
                        <div>
                            <p class="md:text-sm lg:text-base">
                                <ol class="w-full list-decimal md:px-6 lg:px-10 pb-4">
                                    <li class="md:text-xs lg:text-sm md:mb-2 md:pb-1">
                                        Θυμήσου ότι το περιεχόμενο της δημοσίευσης μπορεί να φανεί
                                        αρκετά χρήσιμο στους υπόλοιπους
                                    </li>
                                        <li class="md:text-xs lg:text-sm md:mb-2 md:pb-1">
                                        Κάνε αναζήτηση με λέξεις-κλειδιά μήπως υπάρχει μία
                                        παρόμοια ανάρτηση
                                    </li>
                                </ol>
                            </p>    
                        </div>      
                    </div>
                </div>
            </div>
            <!-- END: RIGHT SIDE -->
        </div>
        
    </div>
</template>

<script>
import filtersData from "../assets/data/data.json";
import { mapActions } from "vuex";

export default ({
    name: 'Create Post',
    data() {
        return {
            posts: [],
            error: "",
            semester: "",
            course: "",
            title: "",
            body: "",
            filtersData: filtersData,
            courses: [],
        };
    },
    methods:{   
        ...mapActions(["CREATE_POST"]),
        populate(){
            this.courses = [];
            var select = document.getElementById('post_semester');
            var value = select.options[select.selectedIndex].value;
            for (var object of filtersData) {
                if (object.value == value) {
                    for (var course of object.courses) {
                        this.courses.push({ id: course.id, value: course.value });
                    }
            }
        }
        }, // ** ΔΕΝ ΕΧΕΙ ΤΕΛΕΙΩΣΕΙ ΑΚΟΜΑ **
        async createNewPost() {
            
            if (this.title === "" || this.body === "" || this.semester === "" || this.course === "") {
                alert(
                "Για την υποβολής της δημοσίευσης, απαιτείται η συμπλήρωση όλων των πεδίων."
                );
                return;
            }else{
                var semesterSelect = document.getElementById('post_semester');
                var semesterChoice = semesterSelect.options[semesterSelect.selectedIndex].id;
                var courseSelect = document.getElementById('post_course');
                var courseChoice = courseSelect.options[courseSelect.selectedIndex].id;
            }
            const newPost = {
                semester: semesterChoice,
                course: courseChoice,
                title: this.title,
                body: this.body,
            }
            this.$store.dispatch("CREATE_POST", newPost);
            this.semester = "";
            this.course = "";
            this.title = "";
            this.body = "";
            
            this.$router.push({ name: "Home" });
        }
    }
})

</script>

<style scoped>

#c, ol li {
    border-bottom: 1px solid #edeff1;
}


</style>
