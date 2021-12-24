<template>
  <div class="login">
    <label for="email">Adresse email :</label>
    <input type="email" name="email" id="email">
    <label for="password">Mot de passe :</label>
    <input type="password" name="password" id="password">
  </div>

</template>



<script>
export default {
  name: 'Login',
  props: {

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
  


</style>