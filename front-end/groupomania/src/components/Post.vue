<template>
  <article class="post">
    <div class="post__info">
      <img class="post__info__user-avatar" :src="postCreatorAvatar" alt="Avatar de l'utilisateur" />
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
      postCreatorAvatar: "",
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
        console.log(res.data.dataValues)
        let user = res.data.dataValues;
        this.postCreator = user.firstname + " " + user.lastname;
        this.postCreatorAvatar = user.avatar;
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
  & .post__info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    & .post__info__user-avatar{
      width: 60px;
      height: 60px;
      object-fit: cover;
      border: 1px solid $primary-color;
      border-radius: 50%;
      margin-left: 10px;
    }
  & p.post__creator {
    font-weight: bold;
    font-size: 1rem;
    width: 40%;
    }
  & p.post__date-created {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    }
  }
  & .post__container__image{
    & .post__image{
      max-width: 750px;
      max-height: 400px;
      object-fit: contain;
    }
  }
}

</style>