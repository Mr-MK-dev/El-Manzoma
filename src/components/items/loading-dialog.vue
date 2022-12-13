<template>
  <div>
    <v-dialog
      @keydown.space="$store.state.appLoading.show = false"
      persistent
      max-width="400"
      scrollable
      v-model="$store.state.appLoading.show"
    >
      <template>
        <div class="text-center">
          <v-overlay :model-value="overlay" class="align-center justify-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </div>
      </template>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "global-loading-dialog",
  data: () => ({
    loading: false
  })
};
</script>
