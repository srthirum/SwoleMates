<!-- app -->
<div id="app">
  <button @click="showGoogleModal = true">Get Info Mofo</button>
  <google-vision-modal :show="showGoogleModal" @close="showGoogleModal = false"></new-post-modal>
</div>

<!-- template for the modal component -->
<script type="x/template" id="google-vision-modal">
    <modal :show="show" :pictureUrl="pictureUrl" @close="close">
        <div class="modal-header">
            <h3>New Comment</h3>
        </div>
        <div class="modal-body">
            <label class="form-label">
                Comment
                <textarea v-model="comment" rows="5" class="form-control">
                </textarea>
            </label>
            <div v-bind:Url="pictureUrl"></div>
        </div>
        <div class="modal-footer text-right">
            <button class="modal-default-button" @click="postComment()">
                Post
            </button>
        </div>
    </modal>
</script>

<script>
import axios from 'axios'
import Modal from './Modal.vue'

export default {
  template: '#google-vision-modal',
  name: 'google-vision-modal',
  props: ['show', 'pictureUrl'],
  data: function () {
    return {
      title: '',
      body: ''
    };
  },
  methods: {
    close: function () {
      this.$emit('close');
      this.title = '';
      this.body = '';
    },
    savePost: function () {
      // Some save logic goes here...

      this.close();
    }}
}

</script>
