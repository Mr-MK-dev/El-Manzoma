<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :printer="mainTable.printer"
      :title="'يومية تصديق القائد'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent">
          {{ item.workplace }}
        </v-chip>
      </template>
      <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.Difference="{ item }">
        <v-chip> {{ item.current - item.LeaderCertification }}</v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="rig"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "LeaderCertificationReport",
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
          readonly: true,
          inModel: false
        },
        {
          text: "تصديق القائد",
          value: "LeaderCertification",
          searchValue: "LeaderCertification",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "الموجود الفعلي",
          value: "current",
          type: "text",
          inTable: true,
          inModel: false
        },
        {
          text: "الفرق",
          value: "Difference",
          type: "text",
          inTable: true,
          inModel: false
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
        const enrollers = await this.api("global/get_all", {
          table: "followersolider",
          include: [{ model: "Soldier" }],
          where: {
            isEnrolled: true
          }
        });
        const result = await this.api("global/get_all", {
          table: "followerwork"
        });
        let data = result.data.map(ele => ({
          ...ele,
          current: enrollers.data.filter(
            e => e.workplace == ele.idwork && e.Soldier?.ID
          ).length
        }));
        data = data.filter(ele => ele.current > 0);
        data.push({
          workplace: "الإجمالي",
          LeaderCertification: lodash.sumBy(data, e => e.LeaderCertification),
          current: lodash.sumBy(data, e => e.current)
        });
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
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
            update: {
              LeaderCertification: parseInt(this.rig.LeaderCertification)
            }
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
    }
  }
};
</script>
