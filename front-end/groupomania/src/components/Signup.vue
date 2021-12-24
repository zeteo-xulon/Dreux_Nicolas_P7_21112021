<template>
  <div class="signup">

    <div class="form">
      <label for="firstname">Prénom :</label>
      <input type="text" name="firstname" id="firstname">
      <label for="lastname">Nom :</label>
      <input type="text" name="lastname" id="lastname">
      <label for="email">Adresse email :</label>
      <input type="email" name="email" id="email">
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" id="password">
    </div>
    <button>
      <router-link class="link" to="/">Home</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  props: {
    
  },
}
</script>


<style lang="scss">
/*----------  Variables ----------*/
$primary-color: #f72d02;
$secondary-color: #fcd7d7;

/*----------  Mixins ----------*/
@mixin center {
    display: flex;
    align-items: center;
    justify-content: center;
}
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
</style>
