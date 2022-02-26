<template>
  <div class="home">
    <img alt="Groupomania logo" src="../assets/images/modif/icon-left-font-svg-r.svg" />
    <!-- Components -->
    <main class="main">
      <div id="nav">
        <!-- <router-link to="/signup">Signup</router-link> | -->
        
      </div>
      <transition name="fade-to-top">
        <MainText 
        v-if="!signUpClick && !logInClick" 
        msg="Bienvenue sur le portail social Groupomania." 
        test="Ce site est un réseau social privé à l'entreprise groupomania." />
      </transition>
                  
      <button class="btn__signup" @click=" displaySignUp ">SIGN UP</button>
      <button class="btn__signup" @click=" displayLogin  ">LOG IN</button>
      <transition name="fade-to-top">
       <Signup v-if="signUpClick" />
      </transition>
      <transition name="fade-to-top">
        <Login v-if="logInClick" />
      </transition>

    </main>

    <Foot />

  </div>
</template>


<script>
// @ is an alias to /src
import MainText from '@/components/MainText.vue';
import Signup from '@/components/Signup.vue';
import Login from '@/components/Login.vue';
import Foot from '@/components/Foot.vue';

export default {
  name: 'Home',
  components: {
    MainText,
    Signup,
    Login,
    Foot
  },
  data() {
    return {
      signUpClick: false,
      logInClick: false
    }
  },
  methods: {
    displaySignUp(){
      if(!this.signUpClick){
        this.signUpClick = true;
        return this.logInClick = false;
      } else {
        this.signUpClick = false;
        return this.logInClick = false;
      }
    },
    displayLogin(){
      if(!this.logInClick){
        this.logInClick = true;
        return this.signUpClick = false;
      } else {
        this.signUpClick = false;
        return this.logInClick = false;
      }
    },
    checkLocalStorage(){
      let user = JSON.parse(localStorage.getItem('user'));
      if(user) { return this.$router.push({ path: `/forum` }) }
    }
  },
  beforeMount(){
    this.checkLocalStorage()
  }
}
</script>


<style lang="scss">

@import '../assets/scss/main.scss';

/*============================== 
              HOME  
==============================*/

/*========== GENERAL STYLE  ==========*/

button {
  font-weight: bold;
  font-size: clamp(10px, 70%, 2rem);
  width: clamp(50px, 100%, 30vw);
  color: $tertiary-color;
  background: $primary-color;
  padding: .5rem;
  margin: 5px .5rem;
  border: 0px solid black;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 3px 3px 8px $shadow-color;
  text-decoration: none;
  transition: .2s;
  &:hover{
    box-shadow: 2px 2px 4px $shadow-color;
  }
  &:active{
    box-shadow: 1px 1px 2px $shadow-color;
  }
}
a {
  text-decoration: none;
  color: white;
}
img{
  width: 100%;
}



/*========== ANIMATION  ==========*/
/* ________ TOP _________ */
.fade-to-top-enter-active, .fade-to-top-leave-active {
  transition: all .5s ease-in-out;
}
.fade-to-top-enter-from{
  opacity: 0;
  transform: translateY(-2rem);
}
.fade-to-top-enter-to{
  opacity: 1;
  transform: translateY(0rem);
}
.fade-to-top-leave-from{
  opacity: 1;
  transform: translateY(0rem);
}
.fade-to-top-leave-to{
  opacity: 0;
  transform: translateY(-2rem);
}

</style>