<template>
  <section class="container">
    <Header />
    <div class="profile">
        <h1 v-if="!noUser">Informations</h1>
        <h1 v-if="noUser">Cette utilisateur(rice) n'existe pas.</h1>

        <div v-if="displayProfile" class="profile__display">
          <img :src="profile.avatar" alt="avatar picture" class="profile__avatar" id="profileAvatar"/>
          <p class="email">Adresse email : {{ profile.email }}</p>
          <p class="firstname">Prénom : {{ profile.firstname }}</p>
          <p class="lastname">Nom de famille : {{ profile.lastname }}</p>
          <p class="job">Poste : {{ profile.job }}</p>
          <p class="bio">Biographie : {{ profile.bio }}</p>
          <button v-if="profile.id === visitor.id || visitor.role === 2" @click="displayUpdateContainer" class="show-info__container">Modifier les informations personnel</button>
        </div>
           
       <article v-if="showUpdateProfile" class="profile__info">

          <div class="profile__avatar__container">
            <img :src="profile.avatar" alt="avatar picture" class="profile__avatar" id="profileAvatar"/>
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
          <input type="email" :value="profile.email" id="profileEmail">
          <label for="firstname">Prénom :</label>
          <input type="text" :value="profile.firstname" id="profileFirstname" />
          <label for="lastname">Nom de famille :</label>
          <input type="text" :value="profile.lastname" id="profileLastname" />
          <label for="job">Poste :</label>
          <input type="text" :value="profile.job" id="profileJob">
          <label class="bio__label" for="bio">Biographie :</label>
          <textarea name="bioText" class="bio__text" rows="3" cols="10" :value="profile.bio" id="profileBio"></textarea>
          
          <div class="btn-container">
            <button @click="displayUpdateContainer" class="profile__return-btn">Annuler</button>
            <button @click.prevent="updateUser" class="profile__update-btn">Soumettre</button>
          </div>

          <p @click="showPasswordContainer" class="password__update">Modifier le mot de passe</p>
          <p @click="displayDeleteContainer" class="password__update">Supprimer le compte</p>
      </article>

      <aside v-if="showPasswordUpdateContainer" class="password__container">
          <form class="profile__password">
              <label for="password">Ancien mot de passe :</label>
              <input id="oldPassword" type="password"  minlength="8" autocomplete="on">

              <label for="password">Nouveau mot de passe :</label>
              <input id="newPassword1" type="password"   minlength="8" autocomplete="on">
              <label for="password">Vérification mot de passe :</label>
              <input id="newPassword2" type="password"  minlength="8" autocomplete="on">
              <div class="password__btn-container">
                <button @click="showPasswordContainer" class="profile__return-btn">Annuler</button>
                <button @click.prevent="updatePassword" class="profile__update-btn">Soumettre</button>
              </div>
              <ul class="password-prerequisite">
                <li class="password-prerequisite__list">
                  Le mot de passe doit être composer de 8 caractères minimum.
                </li>
                 <li class="password-prerequisite__list">
                   Le mot de passe doit avoir 1 majuscule et 1 minuscule minimum.
                </li>
                 <li class="password-prerequisite__list">
                   Le mot de passe doit contenir au moins 2 chiffres.
                </li>
                 <li class="password-prerequisite__list">
                   Le mot de passe ne doit pas contenir d'espace.
                </li>
              </ul>
          </form>
      </aside>
      <aside v-if="displayDelete" >
        <form class="delete__container">
        <p>Veuillez entrer votre mot de passe pour supprimer le compte.</p>
        <label for="password">Mot de passe :</label>
        <input id="deletePassword" type="password" minlength="8" autocomplete="off">
        <div class="delete__btn-container">
            <button @click.prevent="displayDeleteContainer" class="profile__return-btn">Annuler</button>
            <button @click.prevent="deleteUser" class="profile__update-btn">Supprimer le compte</button>
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
    components: { Header, Foot },
    data(){
      return {
        displayProfile: true,
        showPasswordUpdateContainer: false,
        showUpdateProfile: false,
        displayDelete: false,
        noUser: false,
        profile: {
          id: parseInt(this.$route.params.id),
          email: "",
          firstname: "",
          lastname: "",
          job: "",
          bio: "",
          password: "",
          avatar: ""
          },
        visitor: {},
      }
    },
    methods: {
        loadPage(){ !localStorage.getItem('user') ? this.$router.push('../views/') : this.getInfo() },
        getInfo(){
          let user = JSON.parse(localStorage.getItem('user'));
          let config = { headers: {'Authorization': user.token } }
          axios.get(server + '/' + this.profile.id, config)
          .then((res) => { res.data.dataValues ? (this.switchData(res), this.verifyUser()) : this.displayNoUser() })
          .catch(err => console.log(err))
        },
        verifyUser(){
        let visitor = JSON.parse(localStorage.getItem('user'));
        let config = {  headers: {"Authorization": visitor.token} }
        axios.get("http://localhost:3000/verify-user", config)
        .then((e) => {
          this.visitor = e.data.user;
        })
        .catch((err) => {
          localStorage.removeItem('user');
          this.$router.push({ path: '../views/'});
          console.log(err);
          })
        },
        displayNoUser(){
          this.noUser = true;
          this.displayProfile = false;
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
        switchData(res){
          let profileUser = res.data.dataValues;
              this.profile.firstname = profileUser.firstname;
              this.profile.lastname = profileUser.lastname;
              this.profile.email = profileUser.email;
              this.profile.job = profileUser.job;
              this.profile.bio = profileUser.bio;
              this.profile.password = profileUser.password;
              this.profile.avatar = profileUser.avatar;
        },
        displayUpdateContainer(){
          if(!this.showUpdateProfile){
            this.showUpdateProfile = true;
            this.displayProfile = false;
          } else {
            this.showUpdateProfile = false ;
            this.displayProfile = true;
          }
        },
        displayDeleteContainer(){
             if(!this.displayDelete){
            this.displayDelete = true;
            this.showUpdateProfile = false;
          } else {
            this.displayDelete = false ;
            this.showUpdateProfile = false;
            this.displayProfile = true;
          }
        },
        updateUser(){
          const user = JSON.parse(localStorage.getItem('user'));
          const config = { headers: { 'Authorization': user.token }};

          let email = document.getElementById('profileEmail').value;
          let firstname = document.getElementById('profileFirstname').value;
          let lastname = document.getElementById('profileLastname').value;
          let job = document.getElementById('profileJob').value;
          let bio = document.getElementById('profileBio').value;

          if(firstname == ""){ return alert("Veuillez remplir la case du prénom.")}
          if(lastname == ""){ return alert("Veuillez remplir la case du nom.")}
          let dataToUpdate = { email: email, firstname: firstname, lastname: lastname, job: job, bio: bio };

          axios.put(server + '/' + this.profile.id, dataToUpdate, config)
          .then(() => {
            this.getInfo();
            this.displayProfile = true;
            return this.showUpdateProfile = false;
          })
          .catch(err => console.log(err))
        },
        updateAvatar(event){
          let user = JSON.parse(localStorage.getItem('user'));
          let urlImage = server + "/images/" + this.profile.id;
          let picture = event.target.files[0];
          let formData = new FormData();
          formData.append('image', picture);
          let config = { headers: { 'Authorization': user.token }};

          axios.put(urlImage, formData, config)
          .then(() => {
            this.getInfo();
            this.displayProfile = true;
            return this.showUpdateProfile = false;
          })
          .catch((err) => {
            console(err);
            alert('Le fichier doit être une image de moins de 2 Mo.');
            })
        },
        updatePassword(){
          let visitor = JSON.parse(localStorage.getItem('user'));
          let urlPassword = server + "/password/" + this.profile.id;

          const password = document.getElementById('oldPassword').value;
          const newPassword1 = document.getElementById('newPassword1').value;
          const newPassword2 = document.getElementById('newPassword2').value;

          if(newPassword1 !==  newPassword2) {
            return alert('Les mots de passe ne correspondent pas.')
          }
          let passwordChangeForm = {
            profileId: this.profile.id,
            originalPassword: this.profile.password,
            originalPasswordRetype: password,
            newPasswordFirstValue: newPassword1,
            newPasswordSecondValue: newPassword2
          };
          let config = { headers: { 'Authorization': visitor.token }};

          axios.put(urlPassword, passwordChangeForm, config)
          .then(() => {
            this.getInfo();
            this.displayProfile = true;
            this.showUpdateProfile = false;
            this.showPasswordUpdateContainer = false;
            return alert("Le mot de passe à été mis à jour avec succès.")
          })
          .catch((err) => {
            console.log(err);
            alert("Le mot de passe n'a pas pu être mis à jour.");
            })
        },
        deleteUser(){
          const visitor = JSON.parse(localStorage.getItem('user'));
          const password = document.getElementById('deletePassword').value;
          const config = { headers: { "Authorization": visitor.token }, data: { "profileId": this.profile.id, "password": password }};
          const adress = server + "/" + this.profile.id;    
          axios.delete(adress, config)
          .then(() => {
            if(this.visitor.role === 1) {
              localStorage.removeItem('user')
              return this.$router.push({ path: '../views/'})
            }
            if(this.visitor.role === 2) { return this.$router.push({ path: '../views/forum'}) }
          })
          .catch((err) => console.log(err));
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
.password-prerequisite{
  padding-left: 10px;
  margin: 0px;
  &__list {
    text-align: start;
    font-size: .8rem;
  }
}
form.delete__container {
    padding: 0rem 1rem;
    & p{
      font-size: 1.3rem;
    }
    & label{
      font-weight: bold;
    }
    & input{
      padding: .2rem 0rem;
      margin: 0.3rem 0rem 1rem 0rem;
    }
}
</style>