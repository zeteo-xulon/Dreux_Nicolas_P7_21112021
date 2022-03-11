<template>
  <article class="comment">
    <div class="comment__info">
      <aside class="separation">
        <img @click.prevent="goToProfile" class="comment__info__user-avatar" :src="creator_avatar" alt="Avatar de l'utilisateur" />
        <p class="comment__creator">{{ creator_name }}</p>
      </aside>
      <p class="comment__date-created">{{ commentDate }}</p>
    </div>

    <p v-if="!updateText" class="comment__text">{{ text }}</p>

    <div v-if="updateText" class="comment__update">
      <textarea name="commentText" id="commentText" :value="text" cols="30" rows="5"></textarea>
      <aside class="comment__button-box">
        <font-awesome-icon @click.prevent="updateComment" class="awesome__icon comment-scope" icon="check" />
        <font-awesome-icon @click.prevent="cancelUpdateComment" class="awesome__icon comment-scope" icon="ban" />
      </aside>
      
    </div>

    <div v-if="deleteCommentQuestion" class="comment__update">
      <p class="comment__text">Voulez vous vraiment supprimer ce commentaire ?</p>
      <aside class="comment__button-box">
        <font-awesome-icon @click.prevent="deleteComment" class="awesome__icon comment-scope" icon="check" />
        <font-awesome-icon @click.prevent="cancelDeleteComment" class="awesome__icon comment-scope" icon="ban" />
      </aside>
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
    comment_id: Number,
    visitor_id: Number,
    visitor_role: Number,
    text: String,
    creator: Object,
    comment_date: String
  },
  data(){
    return {
      visitorId: "",
      visitorRole: "",
      creator_id: "",
      creator_name: "",
      creator_avatar: "",
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
      if(this.creator == null){
        this.creator_name = "Utilisateur supprimé";
        this.creator_avatar = "http://localhost:3000/images/default-avatar.jpg";
        this.creator_id = null ;
      } else {
        this.creator_name = this.creator.firstname + " " + this.creator.lastname;
        this.creator_avatar = this.creator.avatar;
        this.creator_id = this.creator.id ;
      }
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
    goToProfile(){ 
      if( this.creator_id !== null ) { return this.$router.push({ path: '/profile/' + this.creator_id}) }
      return alert("Cet utilisateur(rice) à été(e) supprimé(e).")
      },
    verifyUser(){ if( this.visitorId == this.creator_id || this.visitorRole === 2 ) { return this.visitorCanUpdateOrDelete = true }},
    //====== UPDATE ======
    displayUpdateComment(){
      this.updateText = true;
      this.updateButton = false;
      this.deleteButton = false;
    },
    updateComment(){
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { 'Authorization' : user.token } };
      const text = document.getElementById('commentText').value;
      if(text.length == 0) { return alert('Vous devez entrer du text pour modifier le texte précédent.')}
      const updatedText = { text: text };

      axios.put( "http://localhost:3000/forum/comment/update/" + this.comment_id, updatedText, config )
      .then(() => { this.$parent.refreshComponent++ })
      .catch(err => console.log(err))
    },
    cancelUpdateComment(){
      this.updateText = false;
      this.updateButton = true;
      this.deleteButton = true;
    },
    //====== DELETE ======
    displayDeleteComment(){
      this.deleteCommentQuestion = true;
      this.updateButton = false;
      this.deleteButton = false;
    },
    deleteComment(){
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { 'Authorization' : user.token } };
      axios.delete("http://localhost:3000/forum/comment/delete/" + this.comment_id, config)
      .then(() => { this.$parent.refreshComponent++ })
      .catch(err => console.log(err))
    },
    cancelDeleteComment(){
      this.deleteCommentQuestion = false;
      this.updateButton = true;
      this.deleteButton = true;
    }
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
      object-fit: cover;
      border: 2px solid $complementary-primary-color;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
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

.comment__update{
  display: flex;
  & comment__button-box{
    display: flex;
    flex-flow: column nowrap;
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