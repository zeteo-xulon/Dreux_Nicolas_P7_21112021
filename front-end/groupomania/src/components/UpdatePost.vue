<template>
  <section class="update-post">

    <form class="update-post__form">
      <div class="form__input__container">
        <label class="form__title" for="post">Titre :</label>
        <input type="text" name="title" id="updateFormTitle" v-model="toUpdateTitle">
      </div>

      <div class="form__input__container">
        <label class="form__title" for="post">Texte :</label>
        <textarea class="form__text" rows="5" cols="20" id="updatePostTextarea" v-model="toUpdateText">
        </textarea>
      </div>
      <input type="file">
      <input type="text" id="mediaDescription" placeholder="Décrivez l'image en quelques mots."/>

      <div class="btn__container">
        <button @click.prevent="submitUpdatedPost">Soumettre les modifications</button>
      </div>
    </form>
  
  </section>
</template>


<script>
const axios = require('axios');

export default {
  name: 'UpdatePost',
  data(){
    return {
      toUpdateTitle: this.originalTitle,
      toUpdateText: this.originalText,
      url:"http://localhost:3000/forum/update/"
    }
  },
  props: {
    originalTitle: String,
    originalText: String,
    originalMedia: String,
    orginalAlt: String,
    postCreator: Number
  },
  methods: {

    submitUpdatedPost(event){
      let user = JSON.parse(localStorage.getItem('user'));
      console.log(event);
      console.log(event.target.form[2].files[0]);

      const image = event.target.form[2].files[0];
      const imageAlt = document.getElementById('mediaDescription').value;
      const title = document.getElementById('updateFormTitle').value;
      const text = document.getElementById('updatePostTextarea').value;

      let formData = new FormData();
      if(image){
       formData.append('image', image);
       if(imageAlt){ formData.append('media_description', imageAlt) }
       }
      if(this.originalTitle != title){ formData.append('updatedTitle', title) }
      if(this.originalText != text){ formData.append('updatedText', text) }

      let config = {
        headers: { 'Authorization': user.token },
      }
      axios.update(this.url + this.postCreator, formData, config)
        .then(() => console.log('its done'))
        .catch(err => console.log(err))
    }
  }
}
</script>

/<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.update-post {
  display: flex;
  justify-content: center;
  width: 100%;
}
.update-post__form{
  @include center;
  flex-flow: column nowrap;
  gap: 1rem;
  border: 1px solid $secondary-color;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
  & .form__input__container{
    display: flex;
    align-items: flex-start;
    flex-flow: column nowrap;
    width: 100%;
    & #formTitle{
      width: 100%;
    }
  }
  & .form__input__container{
    width: 100%;
    & .form__text{
     width: 100%;
    }
  }
}
.form__title{
      font-weight: bold;
      font-size: 1.2rem;
}
input[type="file"] {
  width: 100%;
}
#mediaDescription {
    width: 100%;
}
</style>
