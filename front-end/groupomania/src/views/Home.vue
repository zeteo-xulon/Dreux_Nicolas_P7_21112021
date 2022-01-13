<template>
  <div class="home">
    <img alt="Groupomania logo" src="../assets/images/modif/icon-left-font-svg-r.svg" />
    <!-- Components -->
    <main class="main">
      <div id="nav">
        <!-- <router-link to="/signup">Signup</router-link> | -->
        
      </div>
      <transition name="fade">
        <MainText 
        v-if="!signUpClick && !logInClick" 
        msg="Bienvenue sur le portail social Groupomania." 
        test="Ce site est un réseau social privé à l'entreprise groupomania." />
      </transition>
                  
      <button class="btn__signup" @click=" signUpClick = !signUpClick ">SIGN UP</button>
      <button class="btn__signup" @click=" logInClick = !logInClick  ">LOG IN</button>
      <transition name="fade">
       <Signup v-if="signUpClick && !logInClick" />
      </transition>
      <transition name="fade">
        <Login v-if="logInClick && !signUpClick" />
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
  color: $tertiary-color;
  background: $primary-color;
  padding: .5rem;
  margin: 0rem .5rem 0rem .5rem;
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
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter-from /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-to{
  opacity: 0;
}
</style>
