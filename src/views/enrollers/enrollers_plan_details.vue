<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="''"
    >
      <template  v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn v-if="item.followerwork.workplace!=`الاجمالي`" icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="imdad"
      @on-submit="saveCertifications()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "enrollersPlanDetails",

  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },

  mounted() {
    this.findItems({});
  },

  data: () => ({
    layer: {},
    imdad: {},

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
          text: "الإمداد",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "WorkPlaceID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "العدد المصدق",
          value: "CertfiedNumber",
          searchValue: "CertfiedNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "العدد المتبقي",
          value: "AvailableSlots",
          searchValue: "AvailableSlots",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    PreviousCertifiedNumber: 0,
    addLoading: false,
    addModel: {}
  }),
  watch: {},

  methods: {
    async saveCertifications(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
          if(this.PreviousCertifiedNumber > this.imdad.AvailableSlots){
            this.$set(this.imdad, "AvailableSlots",( this.imdad.CertfiedNumber - this.PreviousCertifiedNumber + this.imdad.AvailableSlots));
          }
          else {
            this.$set(this.imdad, "AvailableSlots", this.imdad.CertfiedNumber );

          }
        let saveItem;
        saveItem = await this.api("global/update_one", {
          table: "enrollersPlanDetails",
          where: {
            ID_KEY: this.imdad.ID_KEY
          },
          update: this.imdad
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems(this.search);
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
      this.$set(this.falseLayerObject, "model", true);
    },

    findItems(filters) {
      console.log("id", this.$route.params.id);
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [""],
        multi = [""];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "enrollersPlanDetails",
        include: [
          {
            model: "enrollersPlanList"
          },
          {
            model: "followerwork"
          }
        ],
        where: this.cleanObject({
          EnrollersPlanID: this.$route.params.id
        })
      })
        .then(async x => {
          try {

            let items =[];
            items.push(...x.data) ;

            items.push({
              followerwork: {workplace :"الاجمالي"},
              AvailableSlots : lodash.sumBy(x.data , ele=>ele.AvailableSlots),
              CertfiedNumber : lodash.sumBy(x.data ,ele=> ele.CertfiedNumber)
            });

            this.$set(this.mainTable, "items", items);
            this.$set(this.mainTable, "printer", {
              data: this.mainTable.items,
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable),
              hasParent: true
            });
          } catch (e) {
            console.log(e);
          }
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "PreviousCertifiedNumber", item.CertfiedNumber);
      this.$set(this, "imdad", {
        ...item
      });
    }
  }
};
</script>
