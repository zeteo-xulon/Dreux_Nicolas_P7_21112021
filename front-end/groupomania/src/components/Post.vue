<template>
  <article class="post">
    <div v-if="!displayPostUpdateContainer" class="post__info__container">
      <div class="post__info">
        <img class="post__info__user-avatar" :src="postCreatorAvatar" alt="Avatar de l'utilisateur" />
        <p class="post__creator">{{ postCreator }}</p>
        <p class="post__date-created">{{ postCreated }}</p>
      </div>
      <h2 class="post__title">{{ post_title }}</h2>
      <p class="post__text">{{ post_text }}</p>
      <div class="post__container__image">
        <img v-show="post_image" class="post__image" :src="post_image" :alt="post_alt" />
      </div>
    </div>

    <section v-if="displayPostUpdateContainer" class="update-post">
      <form class="update-post__form">
        <div class="form__input__container">
          <label class="form__title" for="post">Titre :</label>
          <input type="text" name="title" id="updateFormTitle" :value="post_title">
        </div>
        <div class="form__input__container">
          <label class="form__title" for="post">Texte :</label>
          <textarea class="form__text" rows="5" cols="20" id="updatePostTextarea" :value="post_text">
          </textarea>
        </div>
        <input type="file">
        <input type="text" id="mediaDescription" placeholder="Décrivez l'image en quelques mots."/>
        <div class="btn__container">
          <button @click.prevent="submitUpdatedPost">Soumettre les modifications</button>
        </div>
      </form>
    </section>

    <div v-if="visitorCanUpdateOrDelete" class="post__btn-container">
      <button @click.prevent="displayPostUpdate" class="post__btn__update" id="postUpdateBtn">Modifier</button>
      <button @click="postDelete" class="post__btn__delete" id="postDeleteBtn">Supprimer</button>
    </div>
    
    <div class="post__btn-container">
      <button class="post__btn__comment" id="postCommentBtn">Commenter</button>
      <button @click="refreshPost" class="post__btn__comment" id="postRefreshBtn">refresh</button>
    </div>

  </article>
</template>

<script>
const axios = require('axios');

export default {
  name: 'Post',
  data(){
    return {
      post_id: "",
      post_title: "",
      post_text: "",
      post_image: "",
      post_alt: "",
      postCreator: "",
      postCreatorAvatar: "",
      postCreated: "",
      postCreatorId: "",
      visitorCanUpdateOrDelete: false,
      displayPostUpdateContainer: false
    }
  },
  props: {
    postId: Number,
    postTitle: String,
    postText: String,
    postImage: String,
    postAlt: String,
    creator: Number,
    creationDate: String,
    visitorId: Number,
    visitorRole: Number
  },
  methods: {
    checkUserHabilities(){
      if(this.visitorId === this.postCreatorId || this.visitorRole === 2){
          this.visitorCanUpdateOrDelete = true;
      }
    },
    getUserInfo(){
      axios.get('http://localhost:3000/profile/' + this.creator)
      .then((res) => {
        let user = res.data.dataValues;
        this.postCreator = user.firstname + " " + user.lastname;
        this.postCreatorAvatar = user.avatar;     
      })
      .catch(err => console.log(err))
    },
    displayPostUpdate(){
      let buttonText = document.getElementById('postUpdateBtn');
      !this.displayPostUpdateContainer ? (this.displayPostUpdateContainer = true, buttonText.innerText = "Annuler") : (this.displayPostUpdateContainer = false, buttonText.innerText = "Modifier");
    },
    postDelete(){
      
    },
    reloadComponent(){
      this.$forceUpdate()
    },
    submitUpdatedPost(event){
      let updateUrl = "http://localhost:3000/forum/update/";
      let user = JSON.parse(localStorage.getItem('user'));
      let config = { headers: { 'Authorization': user.token } }
      const image = event.target.form[2].files[0];
      const imageAlt = event.target.form[3].value;
      const title = document.getElementById('updateFormTitle').value;
      const text = document.getElementById('updatePostTextarea').value;

      let formData = new FormData();
      formData.append('post_id', this.postId);
      if(this.postTitle != title){ formData.append('title', title) }
      if(this.postText != text){ formData.append('text', text) }
        if(image){
        formData.append('image', image);
        if(imageAlt){ formData.append('media_description', imageAlt) }
      }
      if(this.postText == text && this.postTitle == title && !image){
        return alert("Vous n'avez entré aucune modification.");
      }
      
      axios.put(updateUrl + this.postId, formData, config)
        .then(() => {
          let buttonText = document.getElementById('postUpdateBtn');
          console.log('its done');
          buttonText.innerText = "Modifier";
          this.displayPostUpdateContainer = false;
          })
          .then(() => this.refreshPost())
        .catch(err => console.log(err))
    },
    refreshPost(){
      axios.get("http://localhost:3000/forum/reload/post/" + this.post_id)
      .then((e) => {
        console.log(e.data[0]);
        this.post_title = e.data[0].title;
        this.post_text = e.data[0].text;
        this.post_image = e.data[0].media;
        this.post_alt = e.data[0].media_description;
      })
      .catch(err => console.log(err))
    },
    switchToData(){
      this.post_id = this.postId;
      this.post_title = this.postTitle;
      this.post_text = this.postText;
      this.post_image = this.postImage;
      this.post_alt = this.postAlt;
      this.postCreator = "";
      this.postCreatorAvatar = "";
      this.postCreated = this.creationDate;
      this.postCreatorId = this.creator;
    }
  },
  mounted(){ 
    this.switchToData();
    this.getUserInfo();
    this.checkUserHabilities();
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
      width: 95%;
      max-width: 750px;
      max-height: 400px;
      object-fit: contain;
    }
  }
}
.post__btn-container{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  padding: 0.3rem 0rem 0.8rem 0rem;
}

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