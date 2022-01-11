<template>
  <section>
    <Header />
    <div class="profile">
        <h1>This is an profile page</h1>

        <div class="profile__info">
          <label for="email">Email :</label>
          <input type="text" value="">
          <label for="firstname">Prénom :</label>
          <input type="text" value="">
          <label for="lastname">Nom de famille :</label>
          <input type="text" value="">
          <label for="job">Poste :</label>
          <input type="text" value="">
          <label class="bio__label" for="bio">Biographie :</label>
          <textarea name="bioText" class="bio__text" rows="3" cols="10"></textarea>

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

      }
    },
    methods: {
        getInfo(){
          let user = JSON.parse(localStorage.getItem('user'));
          console.log(user);
          axios.get(server + '/profile/' + user.id, {
            method: 'GET',
            data: {
              token: user.token
            }
          })
          .then((res) => {
            console.log(res)
          })
          .catch(err => console.log(err))
        }
    },
    mounted() {
      this.getInfo()
    }
  }

</script>




/<style  lang="scss" scoped>

/*----------  Variables ----------*/
$primary-color: #f72d02;
$secondary-color: #fcd7d7;
$tertiary-color: white;

$shadow-color: #b08e8e;

/*----------  Mixins ----------*/
@mixin center {
    display: flex;
    align-items: center;
    justify-content: center;
}

/*========== GENERAL STYLE  ==========*/

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