<template>
  <div>
    <v-dialog
      @keydown.space="$store.state.newMessage.model = false"
      persistent
      max-width="400"
      scrollable
      v-model="$store.state.newMessage.model"
    >
      <v-card :disabled="loading" :loading="loading">
        <v-card-title class="success white--text">
          <span
            v-if="$store.state.newMessage.name"
            v-text="$store.state.newMessage.name"
          ></span>
          <span v-else>
            <span>رسالة </span>
            <span class=""> جديدة</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn @click="$store.state.newMessage.model = false" dark icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-subtitle-1 pt-4 pb-4">
          <div>
            <span v-html="$store.state.newMessage.msg"></span>
          </div>
        </v-card-text>
        <v-divider class="mb-1"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            class="text-capitalize px-6"
            large
            outlined
            @click="routeToMessanger()"
            >مشاهدة</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "global-new-message-dialog",
  data: () => ({
    loading: false
  }),
  methods: {
    routeToMessanger() {
      this.$set(this.$store.state.newMessage, "model", false);
      this.$router.push("/messenger");
    }
  }
};
</script>
