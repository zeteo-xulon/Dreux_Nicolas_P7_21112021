<template>
  <article class="comment">
    <div class="comment__info">
      <img class="comment__info__user-avatar" :src="commentCreatorAvatar" alt="Avatar de l'utilisateur" />
      <p class="comment__creator">{{ commentCreator }}</p>
      <p class="comment__date-created">{{ creationDate }}</p>
    </div>
    <p class="comment__text">{{ commentText }}</p>
  </article>
</template>



<script>
const axios = require('axios');

export default {
  name: 'NewComment',
  data(){
    return {
      commentCreator: "",
      commentCreatorAvatar: "",
      commentCreated: ""
    }
  },
  props: {
    commentText: String,
    creator: Number,
    creationDate: String
  },
  methods: {
    getUserInfo(){
      axios.get('http://localhost:3000/profile/' + this.creator)
      .then((res) => {
        console.log(res.data.dataValues)
        let user = res.data.dataValues;
        this.commentCreator = user.firstname + " " + user.lastname;
        this.commentCreatorAvatar = user.avatar;
      })
      .catch(err => console.log(err))
    }
  },
  mounted(){
    this.getUserInfo()
  }
}
</script>