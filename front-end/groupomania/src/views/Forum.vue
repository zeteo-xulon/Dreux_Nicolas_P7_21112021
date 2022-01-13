<template>
  <div>
    <Header />
    
    <section class="forum">
      <newPost />
    </section>

    <Foot />
  </div>
</template>

<script>
  // const axios = require('axios');
  // const server = 'http://localhost:3000';

  import Header from '@/components/Header.vue';
  import Foot from '@/components/Foot.vue';
  import newPost from '@/components/newPost.vue';

export default {
  name: 'Forum',
  components: {
      Header,
      newPost,
      Foot
    }

}

</script>

<style lang="scss">

</style>