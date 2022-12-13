<template>
  <div>
    <v-dialog scrollable max-width="500px" v-model="logout_dialog">
      <v-card>
        <v-card-title class="ls-1 error">
          <span>تسجيل الخروج</span>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <v-card-text class="text-subtitle-1">
          هل تريد بالفعل تسجيل الخروج؟
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="logout_dialog = false"
            class="text-capitalize"
            large
            outlined
            color="error"
            >رجوع
          </v-btn>
          <v-btn
            @click="logout()"
            color="error"
            class="text-capitalize px-6"
            large
            >تسجيل الخروج
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- z-index: 999;  -->
    <v-navigation-drawer
      :right="$vuetify.lang.current == 'ar'"
      v-model="$store.state.options['drawer']"
      :temporary="!$store.state.options['fixed_sidenav']"
      app
      :mini-variant="$store.state.options['mini_variant']"
      overflow
      width="330"
      mini-variant-width="80"
      dark
      height="100%"
    >
      <template v-slot:img>
        <v-img
          height="100%"
          :style="{
            background: `linear-gradient(120DEG,${sideColor1},${sideColor2})`
          }"
        ></v-img>
      </template>
      <vue-custom-scrollbar
        :style="
          `height: 100%; width: ${
            $store.state.options['mini_variant'] ? '80' : '330'
          }px; padding-bottom: 85px`
        "
        :settings="$store.state.options.scrollbar_settings"
      >
        <v-container
          class="text-center"
          v-if="!$store.state.options['mini_variant']"
        >
          <div class="mb-3">
            <v-avatar tile size="70px">
              <v-img :src="require('@/assets/inapp/logo.png')" contain></v-img>
            </v-avatar>
          </div>
          <div :class="`text-h5 white--text`">
            <!-- <span class="">
              {{ $store.getters.isFullApp ? "السجلات" : "الوحدات" }}</span
            > -->
            <span class=""> منظومة فرع الافراد </span>
          </div>
        </v-container>
        <v-divider v-if="!$store.state.options['mini_variant']"></v-divider>
        <v-list-item color="primary" two-line v-if="$store.state.currentUser">
          <!-- :to="'/u/' + $store.state.currentUser.userId" -->
          <v-list-item-avatar>
            <v-img
              @click="OpenImageDialog"
              :src="
                $store.state.currentUser.avatar
                  ? $store.state.currentUser.avatar
                  : require('@/assets/inapp/user-placeholder.jpg')
              "
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="boldOnLang"
              v-html="$store.state.currentUser.realName"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="$store.state.currentUser"></v-divider>
        <v-list-item>
          <v-list-item-title
            class="boldOnLang"
            v-if="!$store.state.options['mini_variant']"
          ></v-list-item-title>
          <v-btn
            :class="
              `float-right ${
                $store.state.options['mini_variant'] ? 'rotateY' : ''
              }`
            "
            icon
            @click="
              $store.state.options['mini_variant'] = !$store.state.options[
                'mini_variant'
              ]
            "
          >
            <v-icon class="rotateOnLang">mdi-keyboard-backspace</v-icon>
          </v-btn>
        </v-list-item>
        <v-list>
          <template v-for="item in sidenav_items">
            <v-list-group
              v-if="item.type == 'group' && item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.icon"
              color="white"
              active-class="primary"
            >
              <template v-slot:activator>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
              </template>
              <template v-for="(child, i) in item.children">
                <v-list-item
                  v-if="
                    (!child.sections || child.sections.includes(userSection)) &&
                      child.type != 'divider' &&
                      child.type == `single`
                  "
                  ripple
                  :key="i"
                  @click="route(child)"
                  :target="child.targetBlank ? '_blank' : '_self'"
                  :rel="child.targetBlank ? 'noopener' : ''"
                  exact
                  :class="
                    $route.fullPath == child.href
                      ? 'primary white--text font-weight-bold'
                      : ''
                  "
                  tag="label"
                >
                  <v-list-item-action v-if="child.icon">
                    <v-icon
                      :class="child.class == 'primary' ? 'white--text' : ''"
                      >{{ isAdmin() ? " " : child.icon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      class="boldOnLang"
                      :class="child.class == 'primary' ? 'white--text' : ''"
                    >
                      {{
                        item.noTranslate
                          ? child.text
                          : getLang("sidebar." + child.text)
                      }}
                    </v-list-item-title>
                    <!-- This one -->
                    <v-list-item-subtitle
                      class="boldOnLang"
                      v-text="child.desc"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-switch
                    v-if="child.control == 'langs'"
                    :id="'id_' + child.control"
                    v-show="
                      child.control && !$store.state.options['mini_variant']
                    "
                    style="flex: none !important"
                    v-model="changeLocale"
                  ></v-switch>
                  <v-switch
                    v-else-if="child.control == 'night_mode'"
                    :id="'id_' + child.control"
                    style="flex: none !important"
                    v-model="$vuetify.theme.dark"
                  ></v-switch>
                  <v-switch
                    v-else
                    :id="'id_' + child.control"
                    v-show="
                      child.control && !$store.state.options['mini_variant']
                    "
                    style="flex: none !important"
                    v-model="$store.state.options[child.control]"
                  ></v-switch>
                </v-list-item>
                <v-list-group
                  v-if="child.type == 'internalGroup' && child.children"
                  :key="child.text"
                  v-model="child.model"
                  :prepend-icon="`mdi-chevron-down`"
                  color="white"
                  sub-group
                  active-class="primary"
                >
                  <template v-slot:activator>
                    <v-list-item-title
                      class="boldOnLang"
                      v-html="getLang('sidebar.' + child.text)"
                    ></v-list-item-title>
                  </template>
                  <template v-for="(subChild, j) in child.children">
                    <v-list-item
                      v-if="
                        permissions.indexOf(subChild.text) > -1 &&
                          subChild.type != 'divider' &&
                          subChild.type == `single`
                      "
                      ripple
                      :key="j"
                      @click="route(subChild)"
                      :target="subChild.targetBlank ? '_blank' : '_self'"
                      :rel="subChild.targetBlank ? 'noopener' : ''"
                      exact
                      :class="
                        $route.fullPath == subChild.href
                          ? 'primary white--text font-weight-bold'
                          : ''
                      "
                      tag="label"
                    >
                      <v-list-item-action v-if="subChild.icon">
                        <v-icon
                          :class="
                            subChild.class == 'primary' ? 'white--text' : ''
                          "
                          >{{ isAdmin() ? " " : subChild.icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title
                          class="boldOnLang"
                          :class="
                            subChild.class == 'primary' ? 'white--text' : ''
                          "
                        >
                          {{
                            child.noTranslate
                              ? subChild.text
                              : getLang("sidebar." + subChild.text)
                          }}
                        </v-list-item-title>
                        <!-- This one -->
                        <v-list-item-subtitle
                          class="boldOnLang"
                          v-text="subChild.desc"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list-group>
                <v-divider
                  v-else-if="child.type == 'divider'"
                  class="my-2"
                  :key="i"
                ></v-divider>
              </template>
            </v-list-group>
            <v-divider
              v-else-if="item.type == 'divider'"
              class="my-2"
              :key="item.text"
            ></v-divider>
            <v-list-item
              :class="$route.fullPath == item.href ? 'primary white--text' : ''"
              ripple
              exact
              @click="route(item)"
              :target="item.targetBlank ? '_blank' : '_self'"
              :rel="item.targetBlank ? 'noopener' : ''"
              v-else-if="item.type == 'single' && !item.click"
              :key="item.text"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
                <v-list-item-subtitle
                  class="boldOnLang"
                  v-text="item.desc"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                v-if="
                  item.text == 'messenger' &&
                    $store.state.notifications.unSeenMsgsCounter > 0
                "
              >
                <v-chip color="error"
                  >{{ $store.state.notifications.unSeenMsgsCounter }}
                </v-chip>
              </v-list-item-action>
              <v-list-item-action-text v-if="item.new">
                <v-chip color="primary" small>New</v-chip>
              </v-list-item-action-text>
            </v-list-item>
            <v-list-item
              color="primary"
              ripple
              exact
              :target="item.targetBlank ? '_blank' : '_self'"
              :rel="item.targetBlank ? 'noopener' : ''"
              v-else-if="item.type == 'single' && item.click"
              @click="runFun(item.click)"
              :key="item.text"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
                <v-list-item-subtitle
                  class="boldOnLang"
                  v-text="item.desc"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <v-footer dir="rtl" padless fixed color="transparent">
          <!-- class="text-center align-center justify-center align-items-center" -->
          <v-list
            class="py-0"
            :light="!$vuetify.theme.dark"
            style="width: 100%"
          >
            <v-list-item
              :class="`grey ${$vuetify.theme.dark ? 'darken-3' : 'lighten-3'}`"
            >
              <v-list-item-content v-if="!$store.state.options['mini_variant']">
                <v-list-item-title class="boldOnLang">
                  السيرفر:
                  <span class="font-weight-normal">
                    {{ $store.state.current_server }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  الإصدار:
                  {{ $store.state.app_version }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn fab small @click="changeTheme(!$vuetify.theme.dark)">
                  <v-icon small>mdi-invert-colors</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <!-- <div>
          v{{ $store.state.app_version }}
          <span v-if="!$store.state.options['mini_variant']">
            - Server: {{ $store.state.current_server }}</span
          >
        </div> -->
        </v-footer>
      </vue-custom-scrollbar>
    </v-navigation-drawer>
    <v-dialog
      v-model="imageOptions.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          رفع الصورة
          <v-spacer></v-spacer>
          <v-btn icon @click="imageOptions.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            <v-file-input
              class="mb-3"
              type="file"
              prepend-icon=""
              label="الصورة"
              hint="من فضلك قم بتحديد مسار الصورة"
              persistent-hint
              filled
              v-model="imageOptions.path"
            ></v-file-input>
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'عودة'"
            outlined
            @click="imageOptions.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'حفظ الصورة'"
            @click="UpdateImage()"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <editor-dialog-bulider
      :title="'ادخال كلمة السر للدخول'"
      :open="selectedPrivatePage.showDialog"
      :fields="selectedPrivatePage.headers"
      :data="selectedPrivatePage.model"
      @on-close="selectedPrivatePage.showDialog = false"
      @on-submit="validateAndRoute()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<style lang="scss"></style>

<script>
import vuetify from "@/plugins/vuetify";

let sidenav_items = require("@/components/items/sidenav-items.js");
const lodash = require("lodash");
const getBase64 = file =>
  new Promise(function(resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject("Error: ", error);
  });

export default {
  name: "app-sidenav",
  created() {
    for (const key in sidenav_items) {
      if (key == "seperator") continue;
      if (!this.$store.getters.isFullApp) {
        sidenav_items[key] = sidenav_items[key].filter(i => !i.onlySegelat);
      }
    }
  },
  async mounted() {
    this.$set(
      this,
      "sideColor1",
      this.$vuetify.theme.themes.light.sidenavgradient_1
    );
    this.$set(
      this,
      "sideColor2",
      this.$vuetify.theme.themes.light.sidenavgradient_2
    );
    this.preventDefaultInstall();
    this.fetchSidenavItems();
    await this.fetchPrivatePages();
  },
  data: () => ({
    logout_dialog: false,
    install_app_dialog: false,
    deferredPrompt: null,
    imageOptions: {
      model: false,
      path: null
    },
    privatePages: [],
    sideColor1: "",
    sideColor2: "",
    sidenav_items: [],
    selectedPrivatePage: {
      routeModel: {},
      headers: [
        {
          text: "كلمة السر",
          value: "WrittenPassword",
          searchValue: "WrittenPassword",
          sortable: true,
          type: "password",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      model: {},
      showDialog: false
    },
    user_section: "",
    sections_icons: [
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-movie",
      "mdi-movie",
      "mdi-attachment",
      "mdi-attachment",
      "mdi-star-half",
      "mdi-star-half",
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-movie",
      "mdi-movie",
      "mdi-attachment",
      "mdi-attachment",
      "mdi-star-half",
      "mdi-star-half",
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-movie",
      "mdi-movie",
      "mdi-attachment",
      "mdi-attachment",
      "mdi-star-half",
      "mdi-star-half",
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-movie",
      "mdi-movie",
      "mdi-attachment",
      "mdi-attachment",
      "mdi-star-half",
      "mdi-star-half"
    ]
  }),
  computed: {
    isDark() {
      return this.$vuetify.theme.dark;
    },
    userSection() {
      return this.$store.state.currentUser.section;
    },
    userId() {
      return this.$store.state.currentUser.userId;
    },
    permissions() {
      return this.$store.state.currentUser.section.split(",");
    }
  },
  methods: {
    request_logout() {
      this.$set(this, "logout_dialog", true);
    },
    openWebsites() {},
    runFun(fun) {
      return this[fun]();
    },
    OpenImageDialog() {
      console.log("open Image Dialog");
      this.$set(this, "imageOptions", { model: true });
    },
    UpdateImage() {
      getBase64(this.imageOptions.path)
        .then(result => {
          this.updateImageApi(result);
        })
        .catch(e => console.log(e));
    },
    async updateImageApi(image) {
      await this.api("global/update_one", {
        table: "users",
        where: { userId: this.userId },
        update: { avatar: image }
      });
      this.$set(this.imageOptions, "model", false);
    },
    async fetchPrivatePages() {
      this.$set(this, "privatePages", []);
      let data = await this.api("global/get_all", {
        table: "PrivatePages"
      });

      this.$set(this, "privatePages", data.data);
    },
    fetchSidenavItems() {
      this.$set(this, "sidenav_items", []);
      let user = this.$store.state.currentUser,
        section = user ? user.section : null,
        // role = user ? user.role : null,
        searcher = section,
        item_group = function(children = [], sec = 0, icon = "", text = "") {
          if (children.length) console.log("Text is", text);
          return {
            type: "group",
            children,
            icon,
            text: text == "" ? `sections.${sec}._self` : text,
            model: false
          };
          return {};
        };
      this.$set(this, "user_section", searcher);
      this.sidenav_items.push(...sidenav_items.header);
      // this.sidenav_items.push(sidenav_items.seperator(1));
      if (!this.$store.getters.isFullApp) {
        for (const key in sidenav_items) {
          if (key == "seperator") continue;
          if (key == "footer") continue;
          if (key == "header") continue;
          let items = sidenav_items[key] ? sidenav_items[key] : [];
          items.forEach(item => {
            if (item.type == "group") {
              console.log("group item is ", item);
              this.sidenav_items.push(
                item_group(
                  item.value,
                  item.key,
                  this.sections_icons[item.key]
                    ? this.sections_icons[item.key]
                    : "",
                  item.text
                )
              );
            } else {
              console.log(" single item is ", item);
              this.sidenav_items.push(item);
            }
          });
        }
      } else if (section != null) {
        for (let i = 0; i < 30; i++) {
          let new_list_group = [],
            items = sidenav_items[`_${i}`] ? sidenav_items[`_${i}`] : [],
            groups_found = [];
          if (i == 1 && sidenav_items._12) {
            this.sidenav_items.push(...sidenav_items._12);
          }
          items.forEach(item => {
            if (item.type == "group") {
              groups_found.push(item);
            } else {
              new_list_group.push(item);
            }
          });
          this.sidenav_items.push(
            item_group(
              new_list_group,
              i,
              this.sections_icons[i] ? this.sections_icons[i] : ""
            )
          );
          groups_found.forEach(group => {
            this.sidenav_items.push(
              item_group(
                group.value,
                group.key,
                this.sections_icons[group.key]
                  ? this.sections_icons[group.key]
                  : "",
                group.text
              )
            );
          });
        }
      }
      let permissions = section.split(",");
      console.log("Section", permissions);
      console.log("userSection", this.user_section);
      this.sidenav_items = this.sidenav_items
        .map(ele => {
          if (ele.children) {
            ele.children = ele.children.filter(
              child =>
                permissions.indexOf(child.text) > -1 || child.type == "divider"
            );

            return ele.children.length ? ele : null;
          }

          return ele;
        })
        .filter(ele => ele);
      this.sidenav_items.push(...sidenav_items.footer);
      console.log("Sidenav items are ", this.sidenav_items);
    },
    preventDefaultInstall() {
      let $this = this;
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        $this.deferredPrompt = e;
      });
    },
    async install_app() {
      let $this = this;
      if ($this.deferredPrompt) {
        $this.deferredPrompt.prompt();
        $this.deferredPrompt.userChoice.then(function(choiceResult) {
          if (choiceResult.outcome === "accepted") {
            $this.deferredPrompt = null;
            $this.install_app_dialog = false;
          } else {
            $this.deferredPrompt = null;
          }
        });
      }
    },
    ShowPasswordDialog(item) {
      this.$set(this.selectedPrivatePage, "routeModel", { ...item });
      this.$set(
        this.selectedPrivatePage,
        "model",
        this.privatePages.find(ele => ele.PageID === item.text)
      );
      this.$set(this.selectedPrivatePage, "showDialog", true);
    },
    validateAndRoute() {
      this.selectedPrivatePage.model.WrittenPassword = this.hashString(
        this.selectedPrivatePage.model.WrittenPassword
      );
      console.log(
        this.selectedPrivatePage.model.WrittenPassword,
        this.selectedPrivatePage.model.Password
      );
      if (
        this.selectedPrivatePage.model.WrittenPassword ==
        this.selectedPrivatePage.model.Password
      ) {
        this.$set(this.selectedPrivatePage, "showDialog", false);
        this.$router.push(this.selectedPrivatePage.routeModel.href);
      } else {
        this.showError("كلمة السر غير صحيحة");
      }
    },
    route(item) {
      if (this.privatePages.find(ele => ele.PageID === item.text) != null) {
        this.ShowPasswordDialog(item);
      } else {
        this.$router.push(item.href);
      }
    },
    getData: function(data = "") {
      if (data) {
        let returner;
        returner =
          this.$store.state["userProfile"] &&
          this.$store.state["userProfile"][data]
            ? this.$store.state["userProfile"][data]
            : "";
        return returner ? returner : "- -";
      } else {
        return false;
      }
    }
  }
};
</script>
