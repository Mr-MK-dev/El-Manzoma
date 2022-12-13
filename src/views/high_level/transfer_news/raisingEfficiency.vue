<template>
  <div>
    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.isRasisingEfficiency="{ item }">
        <v-chip
          @click="actionChangeState(item)"
          :color="item.isRasisingEfficiency == 1 ? 'success' : 'error'"
        >
          {{ item.isRasisingEfficiency ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-chip v-if="isAdmin() || hasFullAccess()" class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :selects="selects"
      :data="unit"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
export default {
  components: {},
  name: "raisingEfficiency",

  mounted() {
    this.init();
    this.handleSearch({ statue: "بالخدمة" });
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    unit: {},
    createdObject: {
      model: false,
      loading: false
    },
    items: [],
    headers: [
      {
        text: "",
        value: "actions",
        searchValue: "actions",
        sortable: false,
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 0
      },
      {
        text: "اسم الوحدة",
        value: "Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: false,
        required: true,
        sort: 1
      },
      {
        text: "رفع الكفاءة",
        value: "isRasisingEfficiency",
        searchValue: "isRasisingEfficiency",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "الحد الأدنى لتقييم الراتب العالي",
        value: "MinimumHighRatedRequirement",
        searchValue: "MinimumHighRatedRequirement",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الحد الأقصى لتقييم الراتب العالي",
        value: "MaximumHighRatedRequirement",
        searchValue: "MaximumHighRatedRequirement",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "العدد الاقصى المطلوب",
        value: "NeededHighRateb",
        searchValue: "NeededHighRateb",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      isRasisingEfficiency: {
        data: [
          {
            text: "نعم",
            value: 1
          },
          {
            text: "لا",
            value: 0
          },
          {
            text: "الكل",
            value: null
          }
        ]
      }
    }
  }),

  methods: {
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      //   let where = { ...data },
      //     likes = ["ID"],
      //     multi = [],
      //     date = ["OrderDate"];
      //   where = this.mapToQuery(where, likes, multi, date);

      this.api("global/get_all", {
        table: "TransferListUnits",
        where: { TransferListID: this.$route.params.id },
        include: [
          {
            model: "Unit"
          }
        ]
      })
        .then(async x => {
          let data = x.data
            .map(ele => ({
              ...ele
            }))
            .filter(ele =>
              this.$route.params.type == 2
                ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
                : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
            );

          this.$set(this, "items", data);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionEdit(item) {
      this.$set(this, "unit", { ...item });
      this.createdObject.model = true;
    },
    async saveItem() {
      if (
        parseInt(this.unit.MinimumHighRatedRequirement) > 10 ||
        parseInt(this.unit.MaximumHighRatedRequirement) > 10
      ) {
        this.showError("لا يجوز تقييم اكثر من 10 ");
        return;
      }
      this.$set(this.createdObject, "loading", true);

      const saveItem = await this.api(`global/update_one`, {
        table: "TransferListUnits",
        where: {
          ID_KEY: this.unit.ID_KEY
        },
        update: this.unit
      });
      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.createdObject, "model", false;
        this.handleSearch({ TransferListID: this.$route.params.id });
        this.unit = {};
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);

      this.$set(this.createdObject, "model", false);
    },

    actionChangeState(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isRasisingEfficiency) {
              await this.api(`global/update_one`, {
                table: "TransferListUnits",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isRasisingEfficiency: false
                }
              });
            } else if (!item.isRasisingEfficiency) {
              await this.api(`global/update_one`, {
                table: "TransferListUnits",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isRasisingEfficiency: true
                }
              });
            }
            this.handleSearch({ TransferListID: this.$route.params.id });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
