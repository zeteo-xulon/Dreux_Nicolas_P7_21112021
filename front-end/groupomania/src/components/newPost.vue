<template>
  <section class="new-post">

    <form class="new-post__form">
      <div class="form__input__container">
        <label class="form__title" for="post">Titre :</label>
        <input type="text" name="title" id="formTitle" v-model="postTitle">
      </div>

      <div class="form__input__container">
        <label class="form__title" for="post">Texte :</label>
        <textarea class="form__text" rows="5" cols="30" v-model="postText">
        </textarea>
      </div>
      <input type="file" @click="addImage">
      <button @click.prevent="submitPost">Créer un nouveau post</button>
    </form>
  
  </section>
</template>


<script>
const axios = require('axios');

export default {
  name: 'newPost',
  data(){
    return {
      postText: "",
      postTitle: "",
      url:"http://localhost:3000/forum"
    }
  },
  methods: {
    addImage(){

    },
    submitPost(){
      let localUser = JSON.parse(localStorage.getItem('user'));
      let user = { id: localUser.id, token: localUser.token, title: this.postTitle, body: this.postText }

      axios.post(this.url + '/create/' + user.id, { ...user })
        .then()
        .catch(err => console.log(err))
    }
  }
}
</script>

/<style lang="scss" scoped>
@import '../assets/scss/main.scss';


.new-post__form{
  @include center;
  flex-flow: column nowrap;
  gap: 1rem;
  border: 1px solid $primary-color;
  border-radius: 10px;
  padding: 1rem;
  & .form__input__container{
    display: flex;
    align-items: flex-start;
    flex-flow: column nowrap;
    width: 100%;
    & #formTitle{
      width: 100%;
    }
  }
  & .form__text__container{
    & .form__text{
     width: 100%;
    }
  }
}
.form__title{
      font-weight: bold;
      font-size: 1.2rem;
    }
</style>
