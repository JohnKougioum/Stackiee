<template>
  <div class="mt-24">
    <div class="md:flex md:justify-center">
      <div class="flex flex-row w-4/5">
        <div class="flex flex-col bg-white p-10">
          <div class="avatar"></div>
          <div class="flex flex-row justify-around w-full">
            <div class="grid grid-cols-2 gap-4 gap-y-8 w-1/3">
              <h1>Όνομα</h1>
              <h3 class="text-gray-700">Ιωάννης</h3>
              <h1>Επίθετο</h1>
              <h3 class="text-gray-700">Κουγιουμτζίδης</h3>
            </div>
            <div class="grid grid-cols-2 gap-4 gap-y-8 w-1/3">
              <h1>Affiliation</h1>
              <h3 class="text-gray-700">Student</h3>
              <h1>ΑΜ</h1>
              <h3 class="text-gray-700">it185201</h3>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <div class="flex justify-center flex-col w-2/3 items-center">
              <h1 class="mb-2">Περιγραφή</h1>
              <p class="col-span-2 text-gray-700">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates aut quod incidunt, eum sunt, accusantium veniam
                recusandae nemo optio quae culpa. Dolorum provident totam esse
                nihil fuga earum excepturi enim!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
};
</script>

<style></style>
