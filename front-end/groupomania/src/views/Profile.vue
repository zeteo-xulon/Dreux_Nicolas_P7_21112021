<template>
  <section>
    <Header />
    <div class="profile">
        <h1>This is an profile page</h1>

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
    mounted() {
      this.getInfo()
    }
  }

</script>




/<style  lang="scss" scoped>

@import '../assets/scss/main.scss';

/*============================== 
            PROFILE  
==============================*/

.profile{
  background: lightblue;
  @include center;
  flex-flow: column nowrap;
  margin: 2rem;
  & h1{
    font-size: 2rem;
    color: $primary-color;
  }
  & .profile__info{
    min-width: 200px;
    max-width: 60%;
    display: flex;
    flex-flow: column nowrap;
  }
}

</style>