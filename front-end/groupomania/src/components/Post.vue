<template>
  <article class="post">
    <div class="post__info">
      <p class="post__creator">{{ postCreator }}</p>
      <p class="post__date-created">{{ creationDate }}</p>
    </div>
    <h2 class="post__title">{{ postTitle }}</h2>
    <p class="post__text">{{ postText }}</p>
    <div class="post__container__image">
      <img class="post__image" :src="postImage" :alt="postAlt" />
    </div>
  </article>
</template>

<script>
const axios = require('axios');

export default {
  name: 'Post',
  data(){
    return {
      postCreator: "",
      postCreated: ""
    }
  },
  props: {
    postTitle: String,
    postText: String,
    postImage: String,
    postAlt: String,
    creator: Number,
    creationDate: String
  },
  methods: {
    getUserInfo(){
      axios.get('http://localhost:3000/profile/' + this.creator)
      .then((res) => {
        console.log(res)
        this.postCreator = res.data.firstname + " " + res.data.lastname;
      })
      .catch(err => console.log(err))
    }
  },
  mounted(){
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.post{
  width: 100%;
  max-width: 800px;
  border: 1px solid $primary-color;
  border-radius: 10px;
  margin: .5rem 0px;
 
}

</style>