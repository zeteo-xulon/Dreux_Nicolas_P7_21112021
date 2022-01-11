<template>
  <form class="login">
    <label for="email">Adresse email :</label>
    <input type="email" name="email" id="email">
    <label for="password">Mot de passe :</label>
    <input type="password" name="password" id="password">
    <button @click.prevent="submitLogin" class="btn__login">Submit</button>
  </form>
  

</template>



<script>
const axios = require('axios');
const server = 'http://localhost:3000';



export default {
  name: 'Login',
 
  methods: {
    submitLogin(){
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      let login = { email: email, password: password };

      axios.post(server + '/login', { ...login })
      .then((res) => {
        console.log(res)
        if(res.status !== 200){ alert('Les identifiants sont incorrects') }
        if(res.status == 200){
          let userLocal = { id: res.data.id, token: res.data.token };
          let b = JSON.stringify(userLocal)
          localStorage.setItem('user', b)

         return this.$router.push({ path: '/profile' });
        }


    })
    .catch(err => console.log(err))
    }
  }
}
</script>



<style lang="scss">

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

.login {
  display: flex;
  flex-flow: column nowrap;
  margin: 1rem 0rem 1rem 0rem;
  padding: 1rem;

  border: 3px solid $secondary-color;
  border-radius: 10px;
}

.btn__login{
  min-width: 30%;
  margin: 1.5rem auto 0rem;
}


</style>