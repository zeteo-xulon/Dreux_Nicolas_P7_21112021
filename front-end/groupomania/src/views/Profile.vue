<template>
  <section class="container">
    <Header />
    <div class="profile">
        <h1>Informations</h1>

        <div v-if="!showUpdateProfile" class="profile__display">
          <p class="email">{{ email }}</p>
          <p class="firstname">{{ firstname }}</p>
          <p class="lastname">{{ lastname }}</p>
          <p class="job">{{ job }}</p>
          <p class="bio">{{ bio }}</p>
          <button @click="verifyUser" class="show-info__container">Modifier les informations personnel</button>
        </div>
        
        
       <article v-if="showUpdateProfile" class="profile__info">
          <label for="email">Email :</label>
          <input type="email" :value="email" id="profileEmail">
          <label for="firstname">Prénom :</label>
          <input type="text" :value="firstname" id="profileFirstname">
          <label for="lastname">Nom de famille :</label>
          <input type="text" :value="lastname" id="profileLastname">
          <label for="job">Poste :</label>
          <input type="text" :value="job" id="profileJob">
          <label class="bio__label" for="bio">Biographie :</label>
          <textarea name="bioText" class="bio__text" rows="3" cols="10" :value="bio" id="profileBio"></textarea>
          
          <div class="btn-container">
            <button @click="verifyUser" class="profile__return-btn">Annuler</button>
            <button @click="updateUser" class="profile__update-btn">Soumettre</button>
          </div>

          <p class="password__update">Modifier le mot de passe</p>
          <form v-if="showPasswordUpdateContainer" class="profile__password">
              <label for="password">Ancien mot de passe :</label>
              <input id="oldPassword" type="password"  minlength="8">

              <label for="password">Nouveau mot de passe :</label>
              <input type="password"   minlength="8">
              <label for="password">Vérification mot de passe :</label>
              <input type="password"  minlength="8">
          </form>
      </article>
       

      <!-- <router-link to="/">Home</router-link> -->
    </div>
    <Foot />
  </section>
</template>

<script>
  const axios = require('axios');
  const server = 'http://localhost:3000/profile';

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
        showPasswordUpdateContainer: false,
        showUpdateProfile: false,
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
          axios.get(server + '/' + user.id)
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
        verifyUser(){
          !this.showUpdateProfile ? this.showUpdateProfile = true : this.showUpdateProfile = false ;
        },
      updateUser(){
        let user = JSON.parse(localStorage.getItem('user'));
        let email = document.getElementById('profileEmail').value;
        let firstname = document.getElementById('profileFirstname').value;
        let lastname = document.getElementById('profileLastname').value;
        let job = document.getElementById('profileJob').value;
        let bio = document.getElementById('profileBio').value;

        let dataToUpdate = {
          id: user.id,
          email: email,
          firstname: firstname,
          lastname: lastname,
          job: job,
          bio: bio,
          token: user.token
        };
        console.log(dataToUpdate);
        console.log(user);
        axios.put(server + '/' + user.id, { ...dataToUpdate })
        .then((res) => {
          console.log(res)
        })
        .catch(err => console.log(err))
      },
      deleteUser(){

      }
    },
    beforeMount(){
      this.loadPage()
    }
  }

</script>




<style scoped lang="scss">

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
  padding: 1rem 0rem;
  & h1{
    font-size: 1.5rem;
    color: $primary-color;
    margin: 1rem .5rem;
  }
}

.profile__info{
  min-width: 200px;
  width: 90%;
  display: flex;
  flex-flow: column nowrap;
}

input{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
}

textarea{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
}

.password__update{
  border-top: 4px double $primary-color;
  width: 100%;
  padding: 15px 0px 0px 0px;
  font-weight: bold;
  color: $primary-color;
  cursor: pointer;
}

.profile__password{
  display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    & input{
      width: 100%;
    }
}
.profile__return-btn{
  margin: .5rem 0rem;
}

</style>