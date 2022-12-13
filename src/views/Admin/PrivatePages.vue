<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الصفحات الخاصة"
      addBtnTitle="إضافة الي الصفحات الخاصة"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الصفحات الخاصة'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <!--          <v-btn-->
          <!--            v-if="isAdmin() || hasEditAccess()"-->
          <!--            icon-->
          <!--            @click="actionEdit(item)"-->
          <!--            color="primary"-->
          <!--          >-->
          <!--            <v-icon>mdi-pencil</v-icon>-->
          <!--          </v-btn>-->
          <v-btn
            v-if="isAdmin() || hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.PageID="{ item }">
        {{ getLang("sidebar." + item.PageID) }}
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="privatePage"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const sidenav_items = require("@/components/items/sidenav-items.js");

export default {
  name: "PrivatePages",
  props: {},
  mounted() {
    for (let i = 0; i <= 20; i++) {
      // console.log("Data " ,sidenav_items[`_${i}`] );
      if (sidenav_items[`_${i}`] != null) {
        for (let j = 0; j < sidenav_items[`_${i}`].length; j++) {
          // console.log("Data ", {
          //   ...sidenav_items[`_${i}`][j],
          //   text: this.getLang('sidebar.' + sidenav_items[`_${i}`][j].text)
          // });

          this.allPages.push({
            ...sidenav_items[`_${i}`][j],
            localizedText: this.getLang(
              "sidebar." + sidenav_items[`_${i}`][j].text
            )
          });
          if (sidenav_items[`_${i}`][j].children != null) {
            for (const child of sidenav_items[`_${i}`][j].children) {
              console.log("Child", child);
              this.allPages.push({
                ...child,
                localizedText: this.getLang("sidebar." + child.text)
              });
            }
          }
        }
      }
    }

    console.log("SideNavItems", this.allPages);
    this.selects.PageID.data = this.allPages;
    this.findItems({});
  },
  data: () => ({
    privatePage: {},
    allPages: [],

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الصفحة",
          value: "PageID",
          searchValue: "PageID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
        // {
        //   text: "كلمة السر",
        //   value: "Password",
        //   searchValue: "Password",
        //   sortable: true,
        //   type: "password",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   required: true,
        //   sort: 1
        // }
      ],
      items: [],
      printer: {}
    },
    test: [],
    componentName: "PrivatePages",
    selects: {
      PageID: {
        text: "localizedText",
        value: "text"
      }
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "PrivatePages",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            await this.findItems({});
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    async saveItem(edirableFromTableItem) {
      this.privatePage.Password = this.hashString(this.privatePage.Password);
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/${this.privatePage.isEdit ? "update_one" : "create_one"}`,
          {
            table: "PrivatePages",
            where: !this.privatePage.isEdit
              ? this.privatePage
              : {
                  ID_KEY: this.privatePage.ID_KEY
                },
            update: this.privatePage
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.createdObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["PageID"],
        multi = [],
        dates = [];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "PrivatePages",
          where: this.mapToQuery(where, likes, multi, dates)
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this, "test", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "privatePage", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "privatePage", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
