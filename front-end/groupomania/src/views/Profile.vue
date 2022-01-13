<template>
  <section class="container">
    <Header />
    <div class="profile">
        <h1>Informations</h1>

        <div class="profile__info">
          <label for="email">Email :</label>
          <input type="email" :value="email">
          <label for="firstname">Prénom :</label>
          <input type="text" :value="firstname">
          <label for="lastname">Nom de famille :</label>
          <input type="text" :value="lastname">
          <label for="job">Poste :</label>
          <input type="text" :value="job">
          <label class="bio__label" for="bio">Biographie :</label>
          <textarea name="bioText" class="bio__text" rows="3" cols="10" :value="bio"></textarea>

          <p @click="displayPassword == true">Modifier le mot de passe</p>
          <div v-if="displayPassword" class="profile__password">
              <label for="password">Mot de passe :</label>
              <input id="oldPassword" type="password" value="">

              <label for="password">Nouveau mot de passe :</label>
              <input type="password" value="">
              <label for="password">Vérification mot de passe :</label>
              <input type="password" value="">
          </div>
      </div>

      <!-- <router-link to="/">Home</router-link> -->
    </div>
    <Foot />
  </section>
</template>

<script>
  const axios = require('axios');
  const server = 'http://localhost:3000';

  import Header from '@/components/Header.vue';
  import Foot from '@/components/Foot.vue';


  export default {
    name: 'Profile',
    components: {
      Header,
      Foot
    },
    data(){
      return {
        displayPassword: false,
        email: "",
        firstname: "",
        lastname: "",
        job: "",
        bio: "",
        password: ""
      }
    },
    methods: {
        loadPage(){
          if(!localStorage.getItem('user')){
            return this.$router.push('../views/')
          } else {
            this.getInfo()
          }
        },
        getInfo(){
          let user = JSON.parse(localStorage.getItem('user'));
          console.log(user);
          axios.post(server + '/profile/' + user.id, { token: user.token })
          .then((res) => {
            console.log(res)
            console.log(res.data.dataValues)
            let u = res.data.dataValues;
            this.firstname = u.firstname;
            this.lastname = u.lastname;
            this.email = u.email;
            this.job = u.job;
            this.bio = u.bio;
            this.password = u.password;   
          })
          .catch(err => console.log(err))
        },
      updateUser(){

      },
      deleteUser(){

      }
    },
    beforeMount(){
      this.loadPage()
    }
  }

</script>




/<style scoped lang="scss">

@import '../assets/scss/main.scss';

/*============================== 
            PROFILE  
==============================*/
.container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: column nowrap;
  height: 100vh;
}
.profile{
  border: 3px solid $primary-color;
  @include center;
  flex-flow: column nowrap;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  & h1{
    font-size: 1.5rem;
    color: $primary-color;
    margin: 1rem .5rem;
  }
  & .profile__info{
    min-width: 200px;
    width: 90%;
    display: flex;
    flex-flow: column nowrap;
  }
}
input{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
}
textarea{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
}

</style>