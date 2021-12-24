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
/*----------  Variables ----------*/
$primary-color: #f72d02;
$secondary-color: #fcd7d7;
$tertiary-color: white;

/*----------  Mixins ----------*/
@mixin center {
    display: flex;
    align-items: center;
    justify-content: center;
}

h1{
  font-size: 1.3rem;
  color: $primary-color;
}
</style>
