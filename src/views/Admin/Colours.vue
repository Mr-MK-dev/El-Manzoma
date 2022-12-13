<template>
  <div>
    <v-chip
      v-if="this.mainTable.items.length != 0"
      color="primary"
      @click="actionPalette()"
    >
      حفظ مجموعة الالوان
    </v-chip>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الوان'"
    >
      <template v-slot:item.hex="{ item }">
        <v-chip @click="changeColour(item)" :style="{ background: item.hex }">
          تغيير اللون
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog v-model="createdObject.model" max-width="300">
      <v-card
        :loading="createdObject.loading"
        :disabled="createdObject.loading"
      >
        <v-card-title>
          تغيير اللون

          <v-spacer />

          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-color-picker v-model="color.hex"></v-color-picker>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer />

          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="createdObject.model = false"
            v-text="'رجوع'"
          />

          <v-btn
            color="primary"
            large
            class="px-6"
            @click="updateColour"
            v-text="'حفظ '"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <editor-dialog-bulider
      :title="''"
      :open="PaletteObject.model"
      :loading="PaletteObject.loading"
      :fields="PaletteHeaders"
      :selects="selects"
      :data="palette"
      @on-submit="SavePalette()"
      @on-close="PaletteObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;

export default {
  name: "color_management",
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
    PaletteHeaders: [
      {
        text: "اسم الباليت",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        inTable: true,
        inModel: true,
        sort: 5
      }
    ],
    PaletteObject: {
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
          text: "اسم اللون",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          inTable: true,
          sort: 5
        },
        {
          text: "إستخدامات اللون",
          value: "description",
          searchValue: "description",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "اللون",
          value: "hex",
          searchValue: "hex",
          sortable: true,
          inModel: false,
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
  watch: {
    "color.hex"(v) {
      console.log(v);
    }
  },
  methods: {
    async updateColour(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.color.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Colours",
            where: !this.color.isEdit
              ? this.color
              : {
                  ID_KEY: this.color.ID_KEY
                },
            update: this.color
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({
            ID_KEY: this.color.ID_KEY
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
    actionPalette() {
      this.$set(this.PaletteObject, "model", true);
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Colours"
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
    changeColour(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "color", {
        ...item,
        isEdit: true
      });
    },
    async SavePalette() {
      try {
        let saveItem;
        saveItem = await this.api("global/create_one", {
          table: "ColorPalettes",
          where: {
            Palette: JSON.stringify(this.mainTable.items),
            Name: this.palette.Name
          }
        });
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.PaletteObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.PaletteObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.PaletteObject, "loading", false);
      }
    }
  }
};
</script>
