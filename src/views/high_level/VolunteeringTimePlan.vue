<template>
  <div>
    <v-btn
        v-if="isAdmin() || hasEditAccess()"
        @click="actionAdd()"
        large
        outlined
        color="primary"
    >
      إضافة للخطة الزمنية
    </v-btn>
    <table-bulider
        :headers="mainTable.headers"
        :items="mainTable.items"
        :title="'الخطة الزمنية للتطوع'"
    >
      <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteItem(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.IsFollowed="{ item }">
        <v-chip
            :color="item.IsFollowed ? 'success' : 'error'"
        >
          {{ item.IsFollowed ? "متابع" : "غير متابع" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
        :title="''"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :data="plan"
        :selects="selects"
        @on-submit="saveItem()"
        @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "VolunteeringTimePlan",
  async mounted() {
    await this.finditems();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    plan: {},
    searchLoading: false,

    mainTable: {
      headers: [
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
        },
        {
          text: " الاجراء المطلوب تنفيذه",
          value: "title",
          searchValue: "title",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ التطوع من",
          value: "dateFrom",
          searchValue: "dateFrom",
          sortable: true,
          type: "date",
          inSearch: false,
          multiple: true,
          inTable: true,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ التطوع الى",
          value: "dateTo",
          searchValue: "dateTo",
          sortable: true,
          type: "date",
          inSearch: true,
          multiple: true,
          inTable: true,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: " المسئول عن التنفيذ",
          value: "excutingResponsible",
          searchValue: "excutingResponsible",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "المتابعة",
          value: "IsFollowed",
          searchValue: "IsFollowed",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          sort: 1
        }
      ],
      items: []
    },
    selects: {
      IsFollowed: {
        text: "text",
        value: "value",
        data: [
          {
            text: "متابع",
            value: true
          },
          {
            text: "غير متابع",
            value: false
          }
        ]
      },
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
    async finditems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
            ...filters,
          },
          likes = [],
          multi = [],
          date = ["DateFrom", "DateTo"];

      where = this.mapToQuery(where, likes, multi, date);
      try {
        const result = await this.api("global/get_all", {
          table: "VolunteeringTimePlan",
          where: where
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {

      if (!this.plan.IsFollowed || (this.mainTable.items.filter(ele => ele.IsFollowed).length < 12 ||
          (this.plan.isEdit && this.mainTable.items.find(ele => ele.ID_KEY == this.plan.ID_KEY).IsFollowed))) {
        this.$set(this.createdObject, "loading", true);

        if(this.plan.isEdit){

          await this.api("global/delete_all" , {
            table :"VolunteersProcedures",
            where : {
              FieldID:  this.plan.ID_KEY
            }
          })

        }



        let saveItem;
        try {
          saveItem = await this.api(
              !this.plan.isEdit ? `global/create_one` : `global/update_one`,
              {
                table: "VolunteeringTimePlan",
                where: !this.plan.isEdit
                    ? this.plan
                    : {
                      ID_KEY: this.plan.ID_KEY
                    },
                update: this.plan
              }
          );


          if(this.plan.isEdit && this.plan.IsFollowed){
            let volunteers = await this.api("global/get_all" , {
              table:"VolunteeringRecommendation"
            });

            for (const vol of volunteers.data){
              await this.api("global/create_one" , {
                table:"VolunteersProcedures",
                where:{
                  VolunteerID:vol.ID_KEY,
                  FieldName: this.plan.title,
                  FieldValue: this.plan.IsFollowed??false,
                  FieldID: this.plan.ID_KEY
                }
              })
            }
          }
          else{

            if(this.plan.IsFollowed){
              let timePlanItems = await this.api("global/get_all" , {
                table:"VolunteeringTimePlan"
              });

              let volunteers = await this.api("global/get_all" , {
                table:"VolunteeringRecommendation"
              });


              for (const vol of volunteers.data){
                await this.api("global/create_one" , {
                  table:"VolunteersProcedures",
                  where:{
                    VolunteerID:vol.ID_KEY,
                    FieldName: timePlanItems.data[timePlanItems.data.length-1].title,
                    FieldValue: false,
                    FieldID: timePlanItems.data[timePlanItems.data.length-1].ID_KEY
                  }
                })
              }
            }

          }





          if (saveItem && saveItem.data && saveItem.ok) {
            this.showSuccess("تم حفظ ");
            await this.finditems({});
            // this.init();
            this.$set(this.createdObject, "model", false);
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
      } else {
        this.showError("لا يمكنك متابعة اكثر من 12 اجراء")
      }

    },

    actionAdd() {
      this.$set(this, "plan", {isEdit: false});
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "plan", {
        ...item,
        isEdit: true
      });
    },

    async deleteItem(item) {
      this.$set(this.del, "loading", true);

      await this.api("global/delete_all" , {
        table :"VolunteersProcedures",
        where : {
          FieldID:  item.ID_KEY
        }
      })
      let delItem = await this.api("global/delete_all", {
        table: "VolunteeringTimePlan",
        where: {
          ID_KEY: item.ID_KEY
        }
      });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم الحذف بنجاح`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.finditems();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>

