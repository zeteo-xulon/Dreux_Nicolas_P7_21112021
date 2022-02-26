<template>
  <form class="signup">
    <div class="form">
      <label for="firstname">Prénom : <span class="require">(Requis)</span></label>
      <input type="text" name="firstname" id="firstname" minlength="2" maxlength="50">
      <label for="lastname">Nom : <span class="require">(Requis)</span></label>
      <input type="text" name="lastname" id="lastname" minlength="1" maxlength="50">
      <label for="email">Adresse email :</label>
      <input type="email" name="email" id="email" minlength="7" maxlength="100">
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" id="password" minlength="8" maxlength="100" autocomplete="on">
    </div>
    <button type="submit" value="submit" id="signupSubmitButton" @click="signupSubmit">S'inscrire</button>
  </form>
</template>

<script>
const axios = require('axios');

export default {
  name: 'Signup',
  data(){
    return {
      formIsClear: false
    }
  },
  methods: {
    signupSubmit(){
      this.formIsClear = false;
      let firstname = document.getElementById('firstname').value;
      let lastname = document.getElementById('lastname').value;
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
      
      this.verifyForm(firstname, lastname, email, password);

      if(!this.formIsClear) { return console.log("The form wasn't clear.") }
      let userForm = { firstname: firstname, lastname: lastname, email: email, password: password };
      axios.post('http://localhost:3000/signup', { ...userForm })
      .then(() => { 
        this.$parent.logInClick == true;
        this.$parent.sigUpClick == false;
        })
      .catch(err => console.log(err))
    },
    /*
    * Verify each value, and send error for each one.
    * @firstname for firstname value
    * @lastname for lastname value
    * @email for email value
    * @password for password value
    */
    verifyForm(firstname, lastname, email, password){
      if(!firstname || !lastname || !email || !password) { return alert("Tous les champs ne sont pas rempli.") }
      if(firstname.length > 50 ){ return alert('Le prénom ne doit pas dépasser les 50 caractères.')}
      if(lastname.length > 50 ){ return alert('Le nom de famille ne doit pas dépasser les 50 caractères.')}
      if(email.length > 100 ){ return alert("L'adresse email ne doit pas dépasser les 100 caractères.")}
      if(password.length > 100 ){ return alert('Le mot de passe ne doit pas dépasser les 100 caractères.')}
      this.formIsClear = true ;
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
.require{
 font-style: italic;
}
</style>