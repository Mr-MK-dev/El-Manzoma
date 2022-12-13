<template>
  <div>
    <v-btn
      @click="actionAdd()"
      large
      outlined
      color="primary"
      v-if="hasEditAccess()"
    >
      إضافة فرقة
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'الفرق'"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteItem(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </table-bulider>
    <!-- popup to add a reference -->
    <v-dialog
      persistent
      v-model="createdObject.model"
      scrollable
      max-width="750"
    >
      <v-card
        :loading="createdObject.loading"
        :disabled="createdObject.loading"
      >
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in mainTable.headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="traineeship[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="createdObject.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "Traineeships",
  mounted() {
    this.findItems();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    traineeship: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "اسم الفرقة",
          value: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: []
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  methods: {
    async findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "TraineeShip"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "traineeship", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "TraineeShip",
          where: {
            TraineeShipID: item.TraineeShipID
          }
        });
        this.showSuccess("تم الحذف بنجاح");
        await this.findItems({});
      } catch (error) {
        this.showError("تلك الفرقة قد تكون متعلقة ب ظباط صف");
        console.log(error);
      }
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.traineeship.isEdit ? "update_one" : "create_one"}`,
          {
            table: "TraineeShip",
            where: !this.traineeship.isEdit
              ? this.traineeship
              : {
                  TraineeShipID: this.traineeship.TraineeShipID
                },
            update: this.traineeship
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
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

    actionAdd() {
      this.$set(this, "traineeship", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
