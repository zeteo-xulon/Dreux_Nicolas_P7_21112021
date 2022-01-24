<template>
  <div>
    <Header />
    
    <section class="forum">
      <NewPost />
      <Post v-for="post in posts"
      :postTitle= "post.title"
      :postText= "post.body"
      :postImage= "post.image"
      :postAlt= "post.alt"
      :creator= "post.creator_id"
      :creationDate = "post.createdAt"
      :key= "post.id"
      />
    </section>

    <Foot />
  </div>
</template>

<script>
  const axios = require('axios');
  const server = 'http://localhost:3000';

  import Header from '@/components/Header.vue';
  import Foot from '@/components/Foot.vue';
  import NewPost from '@/components/NewPost.vue';
  import Post from '@/components/Post.vue';

export default {
  name: 'Forum',
  data(){
    return {
      posts: [],
      
    }
  },
  components: { Header, NewPost, Post, Foot },
  methods: {

    getPost(){
      const forumUrl = server + "/forum";
      axios.get(forumUrl)
      .then((res) => {
        for(let i = 0; i < res.data.length; i++){
          this.posts.push(res.data[i]);
        }
        console.log(res)})
      .catch(err => console.log(err))
    }

  },
  beforeMount(){
      this.getPost()
  }
}

</script>

<style lang="scss">

</style>