<template>
  <section class="new-post">

    <form class="new-post__form">
      <label class="form__label" for="post">Nouveau Post :</label>
      <textarea class="form__text" rows="5" cols="30">
      </textarea>
      <input type="file" @click="addImage">
      <button @click.prevent="submitPost">Créer un nouveau post</button>
    </form>
  
  </section>
</template>


<script>
export default {
  name: 'newPost',
  methods: {
    addImage(){

    },
    submitPost(){

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
  & .form__label{
  font-weight: bold;
  font-size: 1.2rem;
  }
  & .form__text{
    width: 90%;
  }
}

</style>
