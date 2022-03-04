<template>
  <form class="new-comment">
    <textarea class="new-comment__text" id="newCommentText" type="text" placeholder="Entrez ici votre commentaire." cols="30" rows="5" />
    <div class="new-comment__button-container">
      <font-awesome-icon @click.prevent="postNewComment" class="awesome__icon green" icon="check" />
      <font-awesome-icon  @click.prevent="closeNewComment" class="awesome__icon" icon="ban" />
    </div>
  </form>
</template>



<script>
const axios = require('axios');

export default {
  name: 'NewComment',
  data(){ return { post_id: "" }},
  props: { postId: Number },
  methods: {
    switchData(){ this.post_id = this.postId },
    //====== CREATE ======
    postNewComment(){
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: user.token } };
      const comment = { text: document.getElementById('newCommentText').value };
      if( !comment.text ) { return alert("vous écrire quelque chose avant d'envoyer votre commentaire") }
      axios.post("http://localhost:3000/forum/comment/create/" + this.post_id, comment, config)
      .then(() => {
        document.getElementById('newCommentText').value = "";
        this.$parent.displayNewComment = false;
        this.$parent.refreshComponent++;
        })
      .catch(err => console.log(err))
    },
    closeNewComment(){ this.$parent.displayNewComment = false },
  },
  beforeMount(){ this.switchData() }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';
.new-comment{
  width: clamp(100px, 100%, 800px);
  padding: 5px;
  margin: 5px;
  border: 1px solid $generic-gradient-primary-color;
  border-radius: 5px;
  &__text{
    font-size: 1rem;
    width: 100%;
  }
}
</style>