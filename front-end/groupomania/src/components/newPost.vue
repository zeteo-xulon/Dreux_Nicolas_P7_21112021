<template>
  <section class="new-post">
    <form class="new-post__form">
      <div class="form__input__container">
        <label class="form__title" for="post">Titre :</label>
        <input type="text" name="title" id="formTitle" v-model="postTitle">
      </div>

      <div class="form__input__container">
        <label class="form__title" for="post">Texte :</label>
        <textarea class="form__text" rows="5" cols="20" v-model="postText">
        </textarea>
      </div>
      <input id="newFile" type="file">
      <input type="text" id="mediaDescription" placeholder="Décrivez l'image en quelques mots."/>
      <button @click.prevent="submitPost">Créer un nouveau post</button>
    </form>
  </section>
</template>

<script>
const axios = require('axios');
export default {
  name: 'NewPost',
  data(){ return { postTitle: "", postText: "" } },
  methods: {
    /** 
     * Send a request to the server to create a new post
     * Get the values of user from the localStorage, the media from the file input
     * The user can provide a description of the media in the text input under file input
     * Everything will be added inside the formData and send to the server.
     * After the response of the server, if clear, the forum view will refresh.
     */
    submitPost(){
      let user = JSON.parse(localStorage.getItem('user'));
      const image = document.getElementById('newFile').files[0];
      const imageAlt = document.getElementById('mediaDescription').value;
      let formData = new FormData();
      if(image){
        if( image.size > 2100000 ) { return alert("La taille maximale de l'image ne doit pas dépasser les 2 Mo.") }
        formData.append('image', image);
        if(imageAlt){ formData.append('media_description', imageAlt) }
      }
      formData.append('title', this.postTitle);
      formData.append('text', this.postText);
      let config = { headers: { 'Authorization': user.token } };    
      axios.post("http://localhost:3000/forum/create/", formData, config)
        .then(() => { this.$parent.refreshView++  })
        .catch(err => console.log(err))
    }
  }
}
</script>

/<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.new-post {
  display: flex;
  justify-content: center;
  width: 100%;
}
.new-post__form{
  @include center;
  flex-flow: column nowrap;
  gap: 1rem;
  border: 1px solid $primary-color;
  border-radius: 10px;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
  & .form__input__container{
    display: flex;
    align-items: flex-start;
    flex-flow: column nowrap;
    width: 100%;
    & #formTitle{ width: 100%; }
  }
  & .form__input__container{
    width: 100%;
    & .form__text{ width: 100%; }
  }
}
.form__title{
      font-weight: bold;
      font-size: 1.2rem;
}
input[type="file"] { width: 100%; }
#mediaDescription { width: 100%; }
</style>
