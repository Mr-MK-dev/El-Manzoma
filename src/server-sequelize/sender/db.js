import Vue from "vue";
let { ipcRenderer, webFrame } = window.require("electron");
let getId = () => Math.random(1111111111, 9999999999);

Vue.mixin({
  methods: {
    /**
     * @param {string} query
     * @param {Object} params
     * @param {string} dbname
     *
     * @returns {Promise}
     */
    api(query = "", params = {}, dbname = "af") {
      params = { ...params, currentUser: this.$store.state.currentUser };
      this.showLoadingDialog();
      return new Promise((success, failure) => {
        let req_id = getId();
        ipcRenderer.send("db-send-api", [query, params, req_id, dbname]);
        return ipcRenderer.on(`db-reply-api-${req_id}`, (event, response) => {
          if (
            response &&
            !Array.isArray(response) &&
            typeof response == "object" &&
            response.ok
          ) {
            this.hideLoadingDialog();

            success(response);
          }
          this.hideLoadingDialog();

          failure(response);
        });
      });
    },
    apiSilent(query = "", params = {}, dbname = "af") {
      params = { ...params, currentUser: this.$store.state.currentUser };
      return new Promise((success, failure) => {
        let req_id = getId();
        ipcRenderer.send("db-send-api", [query, params, req_id, dbname]);
        return ipcRenderer.on(`db-reply-api-${req_id}`, (event, response) => {
          if (
            response &&
            !Array.isArray(response) &&
            typeof response == "object" &&
            response.ok
          ) {
            success(response);
          }

          failure(response);
        });
      });
    },
    setZoomFactor(factor) {
      factor = factor ? Number(factor) : 1;
      this.$ls.set("app_zoom_factor", factor);
      return webFrame.setZoomFactor(factor);
    },
    localApi({ query = "", params = {}, method = "get" }) {
      let axios = this.axios,
        serverLink = this.serverLink;
      return new Promise((success, failure) => {
        axios[method](`${serverLink}/api/${query}`)
          .then(x => {
            success(x.data);
            return;
          })
          .catch(error => {
            failure(error);
            return;
          });
      });
    }
  }
});

window.onunload = async e => {
  await api("server/destory-webwin");
};
