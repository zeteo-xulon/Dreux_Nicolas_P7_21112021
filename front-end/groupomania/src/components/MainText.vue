<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{ test }}</p>
  </div>
</template>

<script>
export default {
  name: 'MainText',
  props: {
    msg: String,
    test: String
  }
}
</script>


<style scoped lang="scss">
@import '../assets/scss/main.scss';

h1{
  font-size: 1.3rem;
  color: $primary-color;
}
</style>
