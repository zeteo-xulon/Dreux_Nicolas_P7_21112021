<template>
  <div>
    <Header />
    
    <section class="forum">
      <NewPost ref="refreshView" :key= "refreshView" />
      <Post v-for="post in posts"
      :postId= "post.id"
      :postTitle= "post.title"
      :postText= "post.text"
      :postImage= "post.media"
      :postAlt= "post.media_description"
      :creator= "post.creator_id"
      :creationDate = "post.createdAt"
      :visitorId= "visitor.id"
      :visitorRole= "visitor.role"
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
      visitor: {},
      refreshView: 1
    }
  },
  components: { Header, NewPost, Post, Foot },
  methods: {
    verifyUser(){
      let visitor = JSON.parse(localStorage.getItem('user'));
      let config = {  headers: {"Authorization": visitor.token} }
      axios.get("http://localhost:3000/verify-user", config)
      .then((e) => {
        this.visitor = e.data.user;
      })
      .catch(err => console.log(err))
    },
    getPost(){
      const forumUrl = server + "/forum";
      axios.get(forumUrl)
      .then((res) => {
        for(let i = 0; i < res.data.length; i++){
          this.posts.unshift(res.data[i]);
        }})
      .catch(err => console.log(err))
    }
  },
  watch: {
    refreshView(newValue, oldValue){
      if(newValue > oldValue){
        this.posts = [];
        this.verifyUser();
        this.getPost();
      }
    }
  },
  beforeMount(){
    this.verifyUser();
    this.getPost();
  },
}

</script>

<style lang="scss">
.forum{
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
</style>