<template>
  <div>
    <v-app>
      <v-main>
        <router-view></router-view>
      </v-main>
      <global-error-dialog></global-error-dialog>
      <global-success-dialog></global-success-dialog>
      <global-new-message-dialog></global-new-message-dialog>
      <global-loading-dialog></global-loading-dialog>
      <global-info-dialog></global-info-dialog>
      <global-snackbar></global-snackbar>
      <global-download-manager></global-download-manager>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "WebsitesLayout",
  components: {
    GlobalLoadingDialog: () => import("@/components/items/loading-dialog"),
    GlobalErrorDialog: () => import("@/components/items/error-dialog"),
    GlobalSuccessDialog: () => import("@/components/items/success-dialog"),
    GlobalNewMessageDialog: () =>
      import("@/components/items/new-message-dialog"),
    GlobalInfoDialog: () => import("@/components/items/info-dialog"),
    GlobalSnackbar: () => import("@/components/items/snackbar"),
    GlobalDownloadManager: () => import("@/components/items/download-manager")
  },
  data: () => ({})
};
</script>
