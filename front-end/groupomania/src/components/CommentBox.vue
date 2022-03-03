<template>
  <section class="comment__container" ref="refreshComponent" key="refreshComponent">
    <p v-if="noComment" class="no-comment">Soyez le/la premièr(e) à commenter.</p>
    <Comment v-for="comment in comments" 
    :post_id="post_id" 
    :visitor_id="visitor_id" 
    :visitor_role="visitor_role"
    :text="comment.text"
    :creator_id="comment.user.id"
    :creator_name="comment.user.firstname + ' ' + comment.user.lastname"
    :creator_avatar="comment.user.avatar"
    :comment_date="comment.updatedAt"
    :key="comment.id" />
    <font-awesome-icon v-if="!displayNewComment" @click.prevent="showNewComment" class="awesome__icon" icon="plus" />

    <NewComment v-if="displayNewComment" :postId="post_id" />

  </section>
</template>



<script>
const axios = require('axios');
import NewComment from '@/components/NewComment.vue'
import Comment from '@/components/Comment.vue'

export default {
  name: "CommentBox",
  components: {
    NewComment,
    Comment
  },
  data(){
    return {
      displayNewComment: false,
      comments: [],
      noComment: true,
      refreshComponent: 1
    }
  },
  props: {
    post_id: Number,
    post_comments: Array,
    visitor_id: Number,
    visitor_role: Number
  },
  methods: {
    getComments(){
      this.comments = [];
      axios.get("http://localhost:3000/forum/comment/" + this.post_id)
      .then((e) =>{
        if(e.data.length > 0) { this.noComment = false }
        for(let i = 0; i < e.data.length; i++){
          this.comments.push(e.data[i]);
        }
      })
      .catch((err) => { console.log(err) })
    },
    showNewComment(){
      !this.displayNewComment ? this.displayNewComment = true : this.displayNewComment = false;
    },
    switchData(){
      this.comments = this.post_comments;
      if( this.comments.length > 0 ) { this.noComment = false }
    }
  },
  watch: {
    refreshComponent(newValue, oldValue){
      if(newValue > oldValue){
        this.comments = [];
        return this.getComments()
      }
    }
  },
  beforeMount(){
    this.switchData()
    this.getComments()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

</style>