
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
  props: {
    footer__text: String
  }
}
</script>



<style lang="scss">
.footer{
  padding: 1rem 0rem 0rem 0rem;
}
.footer__text {
  font-style: italic;
}

</style>