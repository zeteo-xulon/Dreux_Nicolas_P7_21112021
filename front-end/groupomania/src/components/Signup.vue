<template>
  <div class="signup">

    <div class="form">
      <label for="firstname">Prénom : <span class="optionnal">(Optionnel)</span></label>
      <input type="text" name="firstname" id="firstname">
      <label for="lastname">Nom : <span class="optionnal">(Optionnel)</span></label>
      <input type="text" name="lastname" id="lastname">
      <label for="email">Adresse email :</label>
      <input type="email" name="email" id="email">
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" id="password">
    </div>
    <button type="submit" value="submit" id="signupSubmitButton" @click="signupSubmit">S'inscrire</button>
  </div>
</template>

<script>
const axios = require('axios');


export default {
  name: 'Signup',
  props: {
    
  },
  data(){
    return {
    
    }
  },
  methods: {
      signupSubmit(){
      let firstname = document.getElementById('firstname').value;
      let lastname = document.getElementById('lastname').value;
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
      let userForm = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      }
      console.log(userForm);
      axios.post('http://localhost:3000/signup', {
        ...userForm
      })
      .then((res) => {
        console.log(res)
      })
      .catch(err => console.log(err))

    }
  }
}
</script>


<style lang="scss">
@import '../assets/scss/main.scss';

/*============================== 
            PROFILE  
==============================*/
.form{
  display: flex;
  flex-flow: column nowrap;
  margin: 1rem 0rem 1rem 0rem;
}
.signup{
  margin: 1rem 0rem 1rem 0rem;
  border: 3px solid $secondary-color;
  border-radius: 10px;
  padding: 0rem .5rem 1rem .5rem;
}
.optionnal{
  font-style: italic;
}
</style>
