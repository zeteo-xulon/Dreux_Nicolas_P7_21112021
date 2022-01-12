
<template>
  <footer class="footer">
    <p class="footer__text">
      {{ footer__text }}
    </p>
  </footer>
</template>



<script>

export default {
  name: 'Footer',
  data() {
    return { footer__text: "Copyright reserved Groupomania Ltd" }
  }
}
</script>



<style lang="scss">
/*============================== 
            FOOTER  
==============================*/

.footer{
  padding: 1rem 0rem 0rem 0rem;
}
.footer__text {
  font-style: italic;
}

</style>