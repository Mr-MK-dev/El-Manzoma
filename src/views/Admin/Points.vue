<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn
        @click="actionAdd()"
        large
        outlined
        color="primary"
        clearoption="true"
      >
        إضافة نقطة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'النقط'"
    >
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.actionsStart="{ item }"
      >
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isHeadQuarter="{ item }">
        <v-chip :color="item.isHeadQuarter == 1 ? 'success' : 'error'">
          {{ item.isHeadQuarter ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="point"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;

export default {
  name: "points",
  props: {
    hubId: {
      type: Number,
      default: () => 0
    }
  },
  mounted() {},
  data: () => ({
    point: {},
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
          text: "اسم النقطة",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          required: true,
          sort: 5
        },
        {
          text: "اسم السرية",
          value: "PointHub.Name",
          searchValue: "Hub_ID",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "قيادة سرية",
          value: "isHeadQuarter",
          searchValue: "isHeadQuarter",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "اسم الوحدة",
          value: "PointHub.Unit.Unit",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
        // {
        //   text: "عدد الظباط",
        //   value: "OfficerCount",
        //   searchValue: "OfficerCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        // {
        //   text: "عدد الجنود",
        //   value: "SoldierCount",
        //   searchValue: "SoldierCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        // {
        //   text: "عدد الراتب العالي",
        //   value: "RatebCount",
        //   searchValue: "RatebCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // }
      ],
      items: [],
      printer: {}
    },
    componentName: "PointsMangmanet",
    selects: {}
  }),
  watch: {},
  methods: {
    async mountChildModel(hubId) {
      this.init();
      await this.findItems({
        Hub_ID: hubId
      });
      this.point.Hub_ID = hubId;
    },
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "Point",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
        this.showSuccess("تم الحذف بنجاح");
        await this.findItems({
          Hub_ID: this.point.Hub_ID
        });
      } catch (error) {
        this.showError("تعذر الحذف");
        this.handleError(error);
      }
    },
    async saveItem(edirableFromTableItem) {
      this.point.hubId = this.hubId;
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.point.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Point",
            where: !this.point.isEdit
              ? this.point
              : {
                  ID_KEY: this.point.ID_KEY
                },
            update: this.point
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({
            Hub_ID: this.point.Hub_ID
          });
          this.createdObject, "model", false;
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
        likes = ["id"],
        multi = [],
        dates = ["From_Date", "To_Date"];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Point",
          include: [
            {
              model: "PointHub",
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ],
          where: this.mapToQuery(where, likes, multi, dates)
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "point", { ...this.point, isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.point.hubId = this.hubId;
      this.$set(this.createdObject, "model", true);
      this.$set(this, "point", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
