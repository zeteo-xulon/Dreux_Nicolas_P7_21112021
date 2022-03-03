<template>
  <article class="comment">
    <div class="comment__info">
      <aside class="separation">
        <img class="comment__info__user-avatar" :src="creator_avatar" alt="Avatar de l'utilisateur" />
        <p class="comment__creator">{{ creator_name }}</p>
      </aside>
      <p class="comment__date-created">{{ commentDate }}</p>
    </div>
    <p v-if="!updateText" class="comment__text">{{ text }}</p>
    <div v-if="updateText" class="comment__update">
      <input  type="text" name="commentText" id="commentText">
      <font-awesome-icon @click.prevent="updateComment" class="awesome__icon" icon="check" />
      <font-awesome-icon @click.prevent="cancelUpdateComment" class="awesome__icon" icon="ban" />
    </div>

    <div v-if="deleteCommentQuestion" class="comment__update">
       <p class="comment__text">Voulez vous vraiment supprimer ce commentaire ?</p>
      <font-awesome-icon @click.prevent="deleteComment" class="awesome__icon" icon="check" />
      <font-awesome-icon @click.prevent="cancelDeleteComment" class="awesome__icon" icon="ban" />
    </div>

    <div v-if="visitorCanUpdateOrDelete" class="comment__control">
      <font-awesome-icon v-show="updateButton" @click.prevent="displayUpdateComment" class="awesome__icon comment-scope" id="postUpdateBtn" icon="edit" />
      <font-awesome-icon v-show="deleteButton" @click.prevent="displayDeleteComment" class="awesome__icon comment-scope" id="postDeleteBtn" icon="trash" />
      
    </div>
  </article>
</template>


<script>
const axios = require('axios')

export default {
  name: "Comment",
  props: {
    post_id: Number,
    visitor_id: Number,
    visitor_role: Number,
    text: String,
    creator_id: Number,
    creator_name: String,
    creator_avatar: String,
    comment_date: String
  },
  data(){
    return {
      visitorId: "",
      visitorRole: "",
      commentDate: "",
      visitorCanUpdateOrDelete: false,
      deleteCommentQuestion: false,
      updateText: false,
      updateButton: true,
      deleteButton: true
    }
  },
  methods: {
    switchData(){
      this.visitorId = this.visitor_id;
      this.visitorRole = this.visitor_role;
    },
    toLocalDate(){
      let date = new Date(this.comment_date)
      this.commentDate = date.toLocaleString('fr-FR', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    verifyUser(){
      if( this.visitorId == this.post_id || this.visitorRole === 2 ) { return this.visitorCanUpdateOrDelete = true }
    },
    displayUpdateComment(){},
    updateComment(){
    let user = JSON.parse(localStorage.getItem('user'));
    let config = { headers: { 'Authorization' : user.token } };
    let text = document.getElementById('commentTextUpdate');

    axios.put("http://localhost:3000/forum/comment",text, config)
    .then()
    .catch(err => console.log(err))
    },
    cancelUpdatecomment(){},
    displayDeleteComment(){},
    deleteComment(){},
    cancelDeleteComment(){}
  },
  beforeMount() {
    this.switchData()
    this.toLocalDate()
    this.verifyUser()
  }
}
</script>

<style lang="scss" scoped> 
@import '../assets/scss/main.scss'; 

.comment{
  margin: 5px;
  border: 2px solid $complementary-primary-color;
  border-radius: 5px;
  padding: .4rem;
  &__info{
    max-height: 50px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    & .separation{
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
    &__user-avatar{
      height: 50px;
      width: 50px;
      border: 2px solid $complementary-primary-color;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  &__creator{
    font-size: .7rem;
    font-weight: bold;
  }
  &__date-created{
    font-size: .7rem;
    font-style: italic;
  }
  &__text{
    font-size: 1rem;
  }
}
.comment-scope{
  color: $complementary-primary-color;
  border: 2px solid $complementary-primary-color;
  font-size: .5rem;
  width: 1.7rem;
  height: 1.7rem;
  &:hover{
    color: $complementary-secondary-color;
    transform: scale(1.1, 1.1);
    border: 3px solid $complementary-secondary-color;
  }
}
</style>