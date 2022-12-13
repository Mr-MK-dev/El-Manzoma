<template>
  <div>
    <card>
      <v-card-title>
        <v-btn
          color="primary"
          large
          class="px-6"
          @click="updateSystem()"
          v-text="'غلق المنظومة'"
        />
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          large
          class="px-6"
          @click="releaseUpdateSystem()"
          v-text="'ايقاف غلق المنظومة'"
        />
      </v-card-title>
    </card>

    <v-card>
      <v-card-title>
        المستخدمين
        <v-spacer></v-spacer>
        <v-btn icon @click="getUsers()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editUser(false, 'create')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn-toggle class="ms-4" v-model="result.showDeleted" mandatory>
          <template v-for="(t, i) in ['الفعال', 'المحذوف']">
            <v-btn
              :key="i"
              :active-class="`white--text ${i == 1 ? 'error' : 'primary'}`"
              v-text="t"
              :value="i == 1 ? true : false"
            ></v-btn>
          </template>
        </v-btn-toggle>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="result.headers"
        :items="result.items.filter(i => i.isVisible == !result.showDeleted)"
        v-model="result.selected"
        fixed-header
        :loading="result.loading"
        :search.sync="result.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="
              result.items.filter(i => i.isVisible == !result.showDeleted)
            "
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>

        <template v-slot:item.canAddFollowup="{ item }">
          <span
            v-text="
              selects.canAddFollowup.data.filter(
                r => r.value == item.canAddFollowup
              )[0] &&
              selects.canAddFollowup.data.filter(
                r => r.value == item.canAddFollowup
              )[0].text
                ? selects.canAddFollowup.data.filter(
                    r => r.value == item.canAddFollowup
                  )[0].text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.canUnfollow="{ item }">
          <span
            v-text="
              selects.canUnfollow.data.filter(
                r => r.value == item.canUnfollow
              )[0] &&
              selects.canUnfollow.data.filter(
                r => r.value == item.canUnfollow
              )[0].text
                ? selects.canUnfollow.data.filter(
                    r => r.value == item.canUnfollow
                  )[0].text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.section="{ item }">
          <span
            v-text="
              selects.section.data.filter(r => r.value == item.section)[0] &&
              selects.section.data.filter(r => r.value == item.section)[0].text
                ? selects.section.data.filter(r => r.value == item.section)[0]
                    .text
                : ''
            "
          ></span>
        </template>
        <template v-slot:item.password="{ item }">
          <div>
            <span v-text="item.isNotPassword ? item.password : '****'"></span>
            <v-btn
              icon
              @click="
                item.isNotPassword
                  ? (item.isNotPassword = false)
                  : (item.isNotPassword = true)
              "
            >
              <v-icon
                size="22"
                v-text="item.isNotPassword ? 'mdi-eye' : 'mdi-eye-off'"
              ></v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                v-if="hasEditAccess()"
                color="primary"
                @click="editUser(false, 'update', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="isAdmin() || hasEditAccess()"
                icon
                :color="result.showDeleted ? 'success' : 'error'"
                @click="
                  (del.id = item.userId),
                    (del.model = true),
                    (del.type = result.showDeleted)
                "
              >
                <v-icon
                  v-text="
                    result.showDeleted
                      ? 'mdi-redo-variant'
                      : 'mdi-trash-can-outline'
                  "
                ></v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.online="{ item }">
          <div v-if="$store.state.sockets._connected[item.userId]">
            <v-icon small color="success">mdi-circle</v-icon>
          </div>
          <div v-else>
            <v-icon small color="#cfcfcf">mdi-circle</v-icon>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- Confirm Delete Dialog -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="550"
      v-model="del.model"
    >
      <v-card :loading="del.loading" :disabled="del.loading">
        <v-card-title :class="`white--text ${del.type ? 'success' : 'error'}`">
          {{ del.type ? "استعادة" : "حذف" }} مستخدم
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            هل تريد بالتأكيد {{ del.type ? "استعادة" : "حذف" }} المستخدم؟
          </div>
          <div v-if="!del.type">
            <span class="error--text">
              لاحظ من فضلك :
            </span>
            <ul style="list-style-type: none">
              <li>
                - لن يتم حذف المستخدم بالكامل من قاعدة البيانات
              </li>
              <li>
                - سيتم اخفاء المستخدم ومنعه من تسجيل الدخول
              </li>
              <li>
                - لن يتم السماح باستعمال "اسم المستخدم" الخاص به لإنشاء مستخدم
                جديد
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            :color="del.type ? 'success' : 'error'"
            outlined
            @click="del.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            :color="del.type ? 'success' : 'error'"
            @click="deleteUser()"
            v-text="del.type ? 'استعادة' : 'حذف'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    Edit Dialog -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="750"
      v-model="edit.model"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          {{ edit.actionType == "create" ? "إضافة" : "تعديل" }}
          مستخدم
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs">
            <template v-for="(item, i) in adminFilters(inputs)">
              <v-col :key="i" cols="6">
                <v-text-field
                  v-if="!item.type || item.type == 'text'"
                  :label="item.label"
                  :hide-details="
                    item.model == 'username' && edit.actionType == 'create'
                      ? result.items.find(u => u.username == edit.user.username)
                        ? false
                        : true
                      : true
                  "
                  @keypress.enter="editUser(true)"
                  filled
                  v-model="edit.user[item.model]"
                  :error-messages="
                    item.model == 'username' && edit.actionType == 'create'
                      ? result.items.find(u => u.username == edit.user.username)
                        ? 'اسم المستخدم هذا مستعمل بالفعل'
                        : ''
                      : ''
                  "
                  :disabled="
                    item.model == 'username' && edit.actionType == 'update'
                  "
                ></v-text-field>
                <v-text-field
                  v-else-if="item.type == 'password'"
                  :label="item.label"
                  hide-details
                  @keypress.enter="editUser(true)"
                  filled
                  v-model="edit.user[item.model]"
                  :type="item.isPassword ? 'password' : 'text'"
                  :append-icon="item.isPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="item.isPassword = !item.isPassword"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  hide-details
                  :multiple="item.multiple"
                  filled
                  v-model="edit.user[item.model]"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  clearable
                ></v-autocomplete>
                <v-checkbox
                  v-else-if="item.type == 'checkbox'"
                  :label="item.label"
                  v-model="edit.user[item.model]"
                >
                </v-checkbox>
              </v-col>
            </template>
          </v-row>
          <v-divider></v-divider>
          <h1
            style="
                border-bottom: 1px solid #000;
                margin: 20px 0;
                padding: 15px 0px 15px 10%;
                display: inline-block;"
          >
            صلاحيات المستخدمين
          </h1>
          <template v-for="(item, i) in sidenav_items">
            <div :key="i">
              <h2 class="text-h6 mb-2">
                {{ getLang("sidebar." + item.text) }}
              </h2>
              <v-chip-group
                :ref="'group' + i"
                column
                multiple
                v-model="edit.user.section"
              >
                <template v-for="(child, y) in item.children">
                  <v-chip filter outlined :key="y" :value="child.text">
                    {{ getLang("sidebar." + child.text) }}
                  </v-chip>
                </template>
              </v-chip-group>
            </div>
          </template>

          <div v-if="isAdmin()">
            <v-divider></v-divider>
            <h1
              style="
                border-bottom: 1px solid #000;
                margin: 20px 0;
                padding: 15px 0px 15px 10%;
                display: inline-block;"
            >
              صلاحيات التعديل في الصفحات
            </h1>
            <div>
              <v-chip-group
                :ref="'group' + i"
                column
                multiple
                v-model="edit.user.permissions"
              >
                <template v-for="(child, y) in toText(edit.user.section)">
                  <v-chip filter outlined :key="y" :value="child">
                    {{ getLang("sidebar." + child) }}
                  </v-chip>
                </template>
              </v-chip-group>
            </div>
          </div>
          <div v-if="isAdmin()">
            <v-divider></v-divider>
            <h1
              style="
                border-bottom: 1px solid #000;
                margin: 20px 0;
                padding: 15px 0px 15px 10%;
                display: inline-block;"
            >
              صلاحيات الحذف في الصفحات
            </h1>
            <div>
              <v-chip-group
                :ref="'group' + i"
                column
                multiple
                v-model="edit.user.deletePermissions"
              >
                <template v-for="(child, y) in toText(edit.user.section)">
                  <v-chip filter outlined :key="y" :value="child">
                    {{ getLang("sidebar." + child) }}
                  </v-chip>
                </template>
              </v-chip-group>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="edit.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            @click="editUser(true)"
            v-text="
              edit.actionType == 'create' ? 'إضافة جديد' : 'حفظ التعديلات'
            "
            large
            :disabled="
              !edit.user.username ||
              (edit.actionType == 'create' &&
                result.items.find(u => u.username == edit.user.username))
                ? true
                : false
            "
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
import lodash from "lodash";

let sidenav_items = require("@/components/items/sidenav-items.js");

export default {
  name: "edit-users",
  mounted() {
    this.init();
    this.getUsers();
    this.fetchSidenavItems();
  },

  data: () => ({
    componentName: "edit_users",
    tableFilters: {},
    sidenav_items: [],
    sections_icons: [
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-account-question-outline",
      "mdi-movie"
    ],
    inputs: [
      {
        label: "الإسم",
        model: "realName"
      },
      {
        label: "اسم المستخدم",
        model: "username"
      },
      {
        label: "كلمة المرور",
        model: "password",
        type: "password",
        isPassword: true
      },
      {
        label: "الدرجة",
        model: "degree"
      },
      {
        label: "مدير النظام ؟",
        model: "isAdmin",
        type: "checkbox",
        isAdmin: true
      },
      {
        label: "يمكن تعديل المجندين",
        model: "canEdit",
        type: "checkbox",
        isAdmin: true
      },
      {
        label: "يمكن تعديل الراتب العالي",
        model: "canEditRateb",
        type: "checkbox",
        isAdmin: true
      },
      {
        label: "اسم المجموعة",
        model: "GroupIds",
        type: "select",
        multiple: true
      }
    ],
    selects: {
      section: {
        data: constants.sections,
        text: "text",
        value: "value"
      },
      GroupIds: {
        table: "UsersGroups",
        text: "Name",
        value: "ID_KEY"
      }
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    edit: {
      loading: false,
      model: false,
      actionType: "",
      // User Model
      user: {
        username: null,
        password: null,
        role: null,
        userId: null,
        realName: null,
        degree: null,
        dateAdded: null,
        isVisible: null,
        isAdmin: false,
        canAddFollowup: false,
        canUnfollow: false,
        GroupIds: null,
        section: [],
        permissions: [],
        deletePermissions: []
      }
    },
    result: {
      showDeleted: false,
      loading: false,
      search: "",
      items: [],
      selected: [],
      headers: [
        {
          text: "الدرجة",
          value: "degree",
          sortable: true
        },
        {
          text: "الإسم",
          value: "realName",
          sortable: true
        },
        {
          text: "اسم المستخدم",
          value: "username",
          sortable: true
        },
        {
          text: "الاقسام المختصة",
          value: "GroupIds",
          searchValue: "GroupIds",
          multiple: true,
          sortable: true,
          type: "select",
          inSearch: true,
          inModel: true,
          inTable: true,
          sort: 4
        },
        {
          text: "كلمة السر",
          value: "password",
          sortable: true
        },
        {
          text: "تاريخ الإضافة",
          value: "dateAdded",
          sortable: true
        },
        {
          text: "الحالة",
          value: "online",
          sortable: false
        },
        {
          text: "",
          value: "edit_me",
          sortable: false
        }
      ]
    }
  }),
  methods: {
    async updateSystem() {
      await this.api("global/update_one", {
        table: "users",
        where: {},
        update: {
          forceClose: true
        }
      });
      this.showSuccess("تم .");
    },
    async releaseUpdateSystem() {
      await this.api("global/update_one", {
        table: "users",
        where: {},
        update: {
          forceClose: false
        }
      });
      this.showSuccess("تم .");
    },
    adminFilters(inputs) {
      return inputs.filter(
        ele =>
          !ele.isAdmin || ele.isAdmin == this.$store.state.currentUser.isAdmin
      );
    },
    toText(arr) {
      return arr;
    },
    async editUser(runDB = false, actionType = "", item = {}) {
      let sidenavItemsFlatten = lodash.flatten(
        this.sidenav_items.map(ele => ele.children)
      );
      if (actionType == "update") {
        console.log("user", item);
        //
        // this.$set(this.edit, "user", {...item,
        //   GroupIds : this.selects.GroupIds.data.filter(ele=>item.GroupIds.includes(ele.Name)).map(ele =>ele.ID_KEY)
        // });
      }

      if (runDB) {
        this.$set(this.edit, "loading", true);

        let { actionType, user } = this.edit,
          where = { ...user, GroupIds: JSON.stringify(user.GroupIds) },
          primaryId = user.userId;

        console.log("Where", where);
        console.log("User", user);

        where.canUnfollow = where.canUnfollow ? true : false;
        where.canAddFollowup = where.canAddFollowup ? true : false;
        where.role = where.role ? where.role : 2; //مراجع
        where.section = where.section?.join(",");
        where.permissions = (where.permissions || [])
          .map(per => sidenavItemsFlatten.find(ele => ele.text == per)?.href)
          ?.join(",");
        where.deletePermissions = (where.deletePermissions || [])
          .map(per => sidenavItemsFlatten.find(ele => ele.text == per)?.href)
          ?.join(",");
        if (!where.isAdmin) {
          where.isAdmin = false;
        }
        delete where.userId;
        console.log(where);
        if (!user.username) {
          this.showError("لا يمكن الحفظ بدون ادخال اسم المستخدم");
          this.$set(this.edit, "loading", false);
          return;
        }
        let edited = await this.api(`global/${actionType}_one`, {
          table: "users",
          where:
            actionType == "update"
              ? {
                  userId: primaryId
                }
              : {
                  ...where,
                  dateAdded: new Date(),
                  isVisible: 1
                },
          update: where
        });
        if (edited && edited.ok && edited.data) {
          this.$set(this.edit, "model", false);
          Object.keys(this.edit.user).forEach(key => {
            this.edit.user[key] = null;
          });
          this.showSuccess("تم حفظ البيانات.");
          this.getUsers();
        } else {
          this.showError("حدث خطأ أثناء حفظ البيانات.");
        }
        this.$set(this.edit, "loading", false);
      } else {
        if (actionType && actionType.length > 0) {
          this.$set(this.edit, "actionType", actionType);
          Object.keys(this.edit.user).forEach(key => {
            this.edit.user[key] = null;
          });
          if (item.section) item.section = item.section?.split(",");
          Object.keys(item).forEach(key => {
            let val = item[key];
            this.$set(this.edit.user, key, val);
          });
          this.$set(this.edit, "model", true);
        }
      }
    },
    async deleteUser() {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/update_one", {
          table: "users",
          where: {
            userId: id
          },
          update: {
            isVisible: type
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.getUsers();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },
    async getUsers() {
      this.$set(this.result, "loading", true);
      let items = await this.api("global/get_all", {
        table: "users"
      });

      console.log("Users", items);
      let sidenavItemsFlatten = lodash.flatten(
        this.sidenav_items.map(ele => ele.children)
      );
      if (items && items.ok && items.data) {
        let users = items.data.sort((a, b) => a.section - b.section);
        for (let i = 0; i < users.length; i++) {
          users[i].isNotPassword = false;
          users[i].permissions = users[i].permissions
            ? users[i].permissions
                .split(",")
                .map(
                  ele => sidenavItemsFlatten.find(per => per.href == ele)?.text
                )
            : [];

          users[i].deletePermissions = users[i].deletePermissions
            ? users[i].deletePermissions
                .split(",")
                .map(
                  ele => sidenavItemsFlatten.find(per => per.href == ele)?.text
                )
            : [];
        }
        users.forEach(el => {
          el.GroupIds = JSON.parse(el.GroupIds)?.map(
            ele =>
              this.selects.GroupIds.data.find(group => group.ID_KEY == ele)
                ?.Name
          );
        });
        this.$set(this.result, "items", this.fixDates(users, ["dateAdded"]));
      } else {
        this.showError("حدث خطأ أثناء استدعاء المستخدمين من قاعدة البيانات.");
      }
      this.$set(this.result, "loading", false);
    },
    fetchSidenavItems() {
      this.$set(this, "sidenav_items", []);
      let item_group = function(children = [], sec = 0, icon = "", text = "") {
        if (children.length) {
          console.log("TExt is ", text);
          return {
            type: "group",
            children,
            icon,
            text: text == "" ? `sections.${sec}._self` : text,
            model: false
          };
        }
        return {};
      };
      this.sidenav_items.push(...sidenav_items.header);
      for (let i = 0; i < 30; i++) {
        let new_list_group = [],
          items = sidenav_items[`_${i}`] ? sidenav_items[`_${i}`] : [],
          groups_found = [];
        items.forEach(item => {
          if (item.type == "group") {
            groups_found.push(item);
          } else if (item.type == "internalGroup") {
            new_list_group.push(item);

            item.children.map(subChild => {
              new_list_group.push(subChild);
            });
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
          console.log(
            "last added item groupp",
            this.sidenav_items[this.sidenav_items.length - 1]
          );
        });
      }

      this.sidenav_items = this.sidenav_items.filter(
        ele => ele && ele.children && ele.children.length
      );

      console.log("SIDE NAV ITEMS", this.sidenav_items);
    }
  }
};
</script>
