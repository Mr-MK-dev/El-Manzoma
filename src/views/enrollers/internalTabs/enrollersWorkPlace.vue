<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة مكان العمل
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :printer="mainTable.printer"
      :title="'أماكن العمل'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent">
          {{ item.workplace }}
        </v-chip>
      </template>
      <template v-if="hasDeleteAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteWorkPlace(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn
          v-if="hasEditAccess()"
          icon
          @click="actionEdit(item)"
          color="primary"
        >
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
                  v-model="rig[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filledss
                  :label="h.text"
                  :multiple="h.multiple"
                  :readonly="h.readonly"
                  v-model="rig[h.value]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="selects[h.value] ? selects[h.value].data : []"
                  :item-value="
                    selects[h.value] ? selects[h.value].value : 'value'
                  "
                  :item-text="selects[h.value] ? selects[h.value].text : 'text'"
                ></v-autocomplete>
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
const constants = require("@/Constant").default;

export default {
  name: "enrollersWorkPlace",
  mounted() {
    this.findAllWorkPlaces();
    this.init();
  },
  data: () => ({
    rig: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    searchLoading: false,
    selects: {
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
      }
    },
    mainTable: {
      headers: [
        {
          text: "مكان العمل",
          value: "workplace",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "التصنيف",
          value: "wokel7aq",
          type: "select",
          inTable: true,
          inModel: true
        },
        {
          text: "الترتيب",
          value: "ordernum",
          type: "text",
          inTable: true,
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
      items: [],
      printer: []
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
    async findAllWorkPlaces() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "followerwork"
        });
        this.$set(this.mainTable, "items", result.data);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "rig", {
        ...item,
        isEdit: true
      });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      try {
        saveItem = await this.api(
          `global/${this.rig.isEdit ? "update_one" : "create_one"}`,
          {
            table: "followerwork",
            where: !this.rig.isEdit
              ? this.rig
              : {
                  idwork: this.rig.idwork
                },
            update: this.rig
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllWorkPlaces();
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
      this.$set(this, "rig", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async deleteWorkPlace(item) {
      this.$set(this.del, "loading", true);
      let soldiers = await this.api("global/get_all", {
        table: "followersolider",
        where: { workplace: item.idwork }
      });
      let Rateb = await this.api("global/get_all", {
        table: "Followerrateb",
        where: { workplace: item.idwork }
      });
      if (soldiers.data.length != 0 || Rateb.data.length != 0) {
        this.showError("هذا العمل مرتبط بجنود وراتب عالي ");
        return;
      }
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "followerwork",
          where: {
            idwork: item.idwork
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllWorkPlaces();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
