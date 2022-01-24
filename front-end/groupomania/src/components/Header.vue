<template>
    <header class="logo-block">
      <img class="logo" alt="Groupomania logo" src="../assets/images/modif/groupomania-text-only-svg.svg" />
      <nav class="navigation">
        <ul class="navigation__list">
          <li class="navigation__list__item">
            <font-awesome-icon @click.prevent="goToProfile"  class="link" icon="user" />
          </li>
          <li class="navigation__list__item">
            <font-awesome-icon @click.prevent="goToForum"  class="link" icon="comments" />
          </li>
          <li class="navigation__list__item">
            <font-awesome-icon @click.prevent="logout" class="link" icon="sign-out-alt" />
          </li>
          
        </ul>
      </nav>
    </header>
</template>

<script>


export default {
  name: "Header",
  methods: {
    goToForum(){
      return this.$router.push({ path: '../views/forum'})
    },
    goToProfile(){
      let a = JSON.parse(localStorage.getItem('user'));
      return this.$router.push({ path: '/profile/' + a.id })
    },
    logout(){
      localStorage.removeItem('user')
      return this.$router.push({ path: '../views/'})
    }
  }
}
</script>



<style lang="scss" scoped>

@import '../assets/scss/main.scss';

.logo-block{
    display: flex;
    justify-content: space-between;
    width: 95%;
  & .logo{
  max-width: 300px;
  max-height: 200px;
  width: 50%;
  }
}
.navigation__list{
  display: flex;
  list-style-type: none;

  & .navigation__list__item{
    margin-left: 10px;
    text-decoration: none;
    color: $primary-color;
  }
}
.link{
  cursor: pointer;
}

</style>