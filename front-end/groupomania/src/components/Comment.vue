<template>
  <div class="comment">
    <div class="comment__info">
      <aside class="separation">
        <img class="comment__info__user-avatar" :src="creator_avatar" alt="Avatar de l'utilisateur" />
        <p class="comment__creator">{{ creator_name }}</p>
      </aside>
      <p class="comment__date-created">{{ commentDate }}</p>
    </div>
    <p class="comment__text">{{ text }}</p>
  </div>
</template>


<script>
export default {
  name: "Comment",
  props: {
    post_id: Number,
    visitor_id: Number,
    visitor_role: Number,
    text: String,
    creator_id: Number,
    creator_name: String,
    creator_avatar: String,
    comment_date: String
  },
  data(){
    return {
      commentDate: ""
    }
  },
  methods: {
    toLocalDate(){
      let date = new Date(this.comment_date)
      this.commentDate = date.toLocaleString('fr-FR', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  },
  beforeMount() {
    this.toLocalDate()
  }
}
</script>

<style lang="scss" scoped> 
@import '../assets/scss/main.scss'; 

.comment{
  margin: 5px;
  border: 2px solid $complementary-primary-color;
  border-radius: 5px;
  padding: .4rem;
  &__info{
    max-height: 50px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    & .separation{
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
    &__user-avatar{
      height: 50px;
      width: 50px;
      border: 2px solid $complementary-primary-color;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  &__creator{
    font-size: .7rem;
    font-weight: bold;
  }
  &__date-created{
    font-size: .7rem;
    font-style: italic;
  }
  &__text{
    font-size: 1rem;
  }
}
</style>