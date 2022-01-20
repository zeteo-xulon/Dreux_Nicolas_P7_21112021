<template>
  <section class="container">
    <Header />
    <div class="profile">
        <h1>Informations</h1>

        <div v-if="displayProfile" class="profile__display">
          <img :src="avatar" alt="avatar picture" class="profile__avatar" id="profileAvatar"/>
          <p class="email">Adresse email : {{ email }}</p>
          <p class="firstname">Prénom : {{ firstname }}</p>
          <p class="lastname">Nom de famille : {{ lastname }}</p>
          <p class="job">Poste : {{ job }}</p>
          <p class="bio">Biographie : {{ bio }}</p>
          <button @click="verifyUser" class="show-info__container">Modifier les informations personnel</button>
        </div>
        
        
       <article v-if="showUpdateProfile" class="profile__info">

          <div class="profile__avatar__container">
            <img :src="avatar" alt="avatar picture" class="profile__avatar" id="profileAvatar"/>
            <input 
            type="file" 
            @change="updateAvatar" 
            name="image" 
            class="avatar__file" 
            id="avatarFile"
            title="Le fichier doit être une image de 2 Mo maximum."
            >
           </div>

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

          <p @click="showPasswordContainer" class="password__update">Modifier le mot de passe</p>
      </article>

      <aside v-if="showPasswordUpdateContainer" class="password__container">
          <form class="profile__password">
              <label for="password">Ancien mot de passe :</label>
              <input id="oldPassword" type="password"  minlength="8">

              <label for="password">Nouveau mot de passe :</label>
              <input type="password"   minlength="8">
              <label for="password">Vérification mot de passe :</label>
              <input type="password"  minlength="8">
              <div class="password__btn-container">
                <button @click="showPasswordContainer" class="profile__return-btn">Annuler</button>
                <button @click="updatePassword" class="profile__update-btn">Soumettre</button>
              </div>
          </form>
      </aside>
       
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
        displayProfile: true,
        showPasswordUpdateContainer: false,
        showUpdateProfile: false,
        email: "",
        firstname: "",
        lastname: "",
        job: "",
        bio: "",
        password: "",
        avatar: ""
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
            this.avatar = u.avatar;  
          })
          .catch(err => console.log(err))
        },
        verifyUser(){
          if(!this.showUpdateProfile){
            this.showUpdateProfile = true;
            this.displayProfile = false;
          } else {
            this.showUpdateProfile = false ;
            this.displayProfile = true;
          }
        },
        showPasswordContainer(){
          if(!this.showPasswordUpdateContainer){
            this.showPasswordUpdateContainer = true;
            this.showUpdateProfile = false;
          } else {
            this.showPasswordUpdateContainer = false ;
            this.showUpdateProfile = false;
            this.displayProfile = true;
          }
        },
        updateUser(){
          let user = JSON.parse(localStorage.getItem('user'));
          let config = { headers: { 'Authorization': user.token }};

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
            bio: bio
          };

          console.log(dataToUpdate);

          axios.put(server + '/' + user.id, { ...dataToUpdate }, config)
          .then((res) => {
            console.log(res);
            this.getInfo();
            return this.showUpdateProfile = false;
          })
          .catch(err => console.log(err))
        },
        updateAvatar(event){
          let user = JSON.parse(localStorage.getItem('user'));
          let urlImage = server + "/images/" + user.id;
          let picture = event.target.files[0];
          let formData = new FormData();
          formData.append('image', picture);
          let config = { headers: { 'Authorization': user.token }};
          console.log(picture);

          axios.put(urlImage, formData, config)
          .then((res) => {
            console.log(res);
            this.getInfo();
            return this.showUpdateProfile = false;
          })
          .catch((err) => {
            console(err);
            alert('Le fichier doit être une image de moins de 2 Mo.');
            })
        },
        updatePassword(){
          let user = JSON.parse(localStorage.getItem('user'));
          let urlImage = server + "/images/" + user.id;
          let picture = event.target.files[0];
          let formData = new FormData();
          formData.append('image', picture);
          let config = { headers: { 'Authorization': user.token }};
          console.log(picture);

          axios.put(urlImage, formData, config)
          .then((res) => {
            console.log(res);
            this.getInfo();
            return this.showUpdateProfile = false;
          })
          .catch((err) => {
            console(err);
            alert('Le fichier doit être une image de moins de 2 Mo.');
            })
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
  align-items: center;
}

input{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
  width: 100%;
}

textarea{
  border-radius: 5px;
  box-shadow: inset -3px 1px 3px 0px #cbcbcb;
  width: 100%;
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
    padding: 1rem;
    & input{
      width: 100%;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    & label{
      font-weight: bold;

    }
}
.profile__return-btn{
  margin: .5rem 0rem;
}
.profile__avatar__container{
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}
.profile__avatar{
  border: 1px solid $primary-color;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  z-index: 1;
}
.avatar__file{
  position: absolute;
  z-index: 2;
  right: 35%;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  font-size: 0px;
  border: 0px solid transparent;
  box-shadow: 0px 0px 0px transparent;
  cursor: pointer;
}
.password__containe{
  width: 100%;
}
.password__btn-container{
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem 0rem;
  gap: 1rem;
  & button{
    margin: 0px 0px;
  }
}

</style>