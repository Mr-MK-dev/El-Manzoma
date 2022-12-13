<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'مجموعات الالوان'"
    >
      <template v-slot:item.AddPalette="{ item }">
        <v-chip @click="AddPalette(item)" color="success">
          تفعيل الباليته
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="isAdmin()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;

export default {
  name: "ColouredPalette",
  async mounted() {
    this.init();
    await this.findItems({});
  },

  data: () => ({
    color: { hex: "" },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    palette: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "action",
          searchValue: "action",
          sortable: true,
          inTable: true,
          sort: 5
        },
        {
          text: "اسم اللون",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          inTable: true,
          sort: 5
        },
        {
          text: "تفعيل المجموعة",
          value: "AddPalette",
          searchValue: "AddPalette",
          sortable: true,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "ColourManagement",
    selects: {}
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "ColorPalettes"
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
        this.$set(this, "searchLoading", false);
      } catch (error) {
        this.handleError(error);
        this.$set(this, "searchLoading", false);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "ColorPalettes",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            await this.findItems({});
          }
        })
        .catch(err => {
          this.handleError(err);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        });
    },
    async AddPalette(item) {
      let palette = JSON.parse(item.Palette);
      try {
        for (let i = 0; i < palette.length; i++) {
          await this.api("global/update_one", {
            table: "Colours",
            where: { Name: palette[i].Name },
            update: { hex: palette[i].hex }
          });
        }
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    }
  }
};
</script>
