<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="searchLevelupInventory"
      @on-add="actionAdd"
      :clearOption="true"
      :addButton="true"
      addBtnTitle="إضافة كارت"
      title="مخزن كروت الراتب العالي"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الكروت'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.Name}`"
          @click.right="copyText(item.Name)"
        >
          {{ item.Name }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="inventory"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "inventoryLevelup",
  mounted() {
    this.init();
  },
  data: () => ({
    search: {},
    inventory: {},
    searchLoading: false,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inModel: true,
          inSearch: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحده",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "رقم الاقدميه",
          value: "Rateb.OlderindNo",
          searchValue: "OlderindNo",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "الاتجاه",
          value: "Rateb.Unit.Directionforunit",
          searchValue: "Directionforunit",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "رقم الحافظه",
          value: "hafza",
          searchValue: "hafza",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RatebLevel: {
        table: "Rateb",
        value: "RatebLevel",
        text: "RatebLevel"
      }
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "inventoryLevelup",
            where: {
              ID_KEY: item.ID_KEY
            }

          });
          this.searchLevelupInventory({});
        }

      });

    },
    async searchLevelupInventory(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters
          },
          likes = ["ID", "Name"],
          multi = [];
      where = this.mapToQuery(where, likes, multi);
      let data = await this.api("global/get_all", {
        table: "inventoryLevelup",
        where: this.cleanObject({
          ID: where.ID,
        }),
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID,
              OlderindNo: where.OlderindNo
            }),
            include: [
              {
                model: "Unit",
                where: this.cleanObject({})
              }
            ]
          }
        ]
      });

      let items = data.data,
          printer = {
            data: [
              ...items.map(ele => ({
                ...ele
              }))
            ],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
            )
          };
      this.$set(this.mainTable, "items", items);
      console.log("Items ara", items);

      this.$set(this.mainTable, "printer", printer);


    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.inventory.isEdit ? "update_one" : "create_one"}`,
          {
            table: "inventoryLevelup",
            where: !this.inventory.isEdit
              ? this.inventory
              : {
                  ID_KEY: this.inventory.ID_KEY
                },
            update: this.inventory
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.searchLevelupInventory({});

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
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "inventory", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
