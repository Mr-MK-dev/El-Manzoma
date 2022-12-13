<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة ملحقين على المؤيد
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الملحقين على المؤيد'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip v-if="hasDeleteAccess()" color="transparent">
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة فرد ملحق الي المؤيد'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="additionFollower"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "ArchivedFollowers",

  mounted() {
    this.findItems({});
  },
  data: () => ({
    additionFollower: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    showFillDialog: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Conscripte.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Conscripte.Unit.Unit",
          searchValue: "Unit",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: true,
          sort: 1
        },
        {
          text: "الموصي",
          value: "Follower.Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),

  watch: {
    async "additionFollower.ID"(newValue) {
      if (newValue.length == 13) await this.CompleteEnrollerData(newValue);
    }
  },
  methods: {
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "ArchiveFileFollowers",
          where: {
            ID_KEY: item.ID_KEY
          }
        });

        this.showSuccess("تم الحذف بنجاح");
        this.findItems({});
      } catch (error) {
        this.showError("تعذر الحذف");
        console.log(error);
      }
    },
    async CompleteEnrollerData(ID) {
      var follower = await this.api("sections/tasgeel/search/enrollers", {
        search: {
          ID: ID,
          Type: ["مجند", "راتب عالى"]
        }
      });
      console.log("follower", follower);

      this.$set(
        this.additionFollower,
        "Name",
        follower?.data[0]?.Soldier?.Name || follower?.data[0]?.Rateb?.Name
      );
      this.$set(
        this.additionFollower,
        "Unit",
        follower?.data[0]?.Soldier?.Unit?.Unit ||
          follower?.data[0]?.Rateb?.Unit?.Unit
      );
      this.$set(
        this.additionFollower,
        "Recommender",
        follower?.data[0]?.Recommender
      );
    },

    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(`global/create_one`, {
          table: "ArchiveFileFollowers",
          where: {
            ...this.additionFollower,
            ArchiveFileID: this.$route.params.id
          },
          update: this.additionFollower
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "ArchiveFileFollowers",
        where: {
          ArchiveFileID: this.$route.params.id
        }
      })
        .then(async x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let returnedItems = [];
          for (const element of data) {
            var follower = await this.api("sections/tasgeel/search/enrollers", {
              search: {
                ID: element.ID,
                Type: ["مجند", "راتب عالى"]
              }
            });

            returnedItems.push({
              ...element,
              Conscripte:
                follower?.data[0]?.Rateb || follower?.data[0]?.Soldier,
              Follower: follower?.data[0]
            });
          }

          this.$set(this.mainTable, "items", returnedItems);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "workPlaceAddition", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
