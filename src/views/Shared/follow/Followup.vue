<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :addButton="isAdmin() || hasEditAccess()"
      :clearOption="true"
      title="بحث متقدم في البوسطة"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="'البوسطة'"
    >
      <template v-slot:item.subject="{ item }">
        <div v-if="item.subject">
          <div v-if="item.subject.length <= subjectLimit || item.subjectShown">
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.subject.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.subject | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip v-if="item.subject.length > subjectLimit" color="transparent">
            <v-btn
              @click="item.subjectShown = !item.subjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'subject', 'الموضوع')"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.procedure="{ item }">
        <div v-if="item.procedure">
          <div
            v-if="item.procedure.length <= subjectLimit || item.procedureShown"
          >
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.procedure.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.procedure | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip
            v-if="item.procedure.length > subjectLimit"
            color="transparent"
          >
            <v-btn
              @click="item.procedureShown = !item.procedureShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.procedureShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'procedure', 'الإجرائات المتخذة')"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.followupAmana="{ item }">
        <div v-if="item.followupAmana">
          <div
            v-if="
              item.followupAmana.length <= subjectLimit || item.subjectShown
            "
          >
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.followupAmana.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.followupAmana | filterStrLimit(subjectLimit) }}
          </div>
          <v-chip
            v-if="item.followupAmana.length > subjectLimit"
            color="transparent"
          >
            <v-btn
              @click="item.subjectShown = !item.subjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.subjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="
                openTextDialog(item, 'followupAmana', 'الإجراءات المتخذة')
              "
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.isFollowed="{ item }">
        <v-chip :color="item.isFollowed != true ? 'error' : 'success'">
          {{ item.isFollowed == true ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip v-if="hasEditAccess()" class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
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
      <template v-slot:item.actions="{ item }">
        <v-chip v-if="hasEditAccess()" class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
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
      <template v-slot:item.isApproved="{ item }">
        <v-chip :color="item.isApproved == true ? 'success' : 'error'">
          {{ item.isApproved == true ? " موافق" : "غير موافق" }}
        </v-chip>
      </template>
      <template v-slot:item.notApprovedReason="{ item }">
        <v-chip
          :color="
            item.isApproved == true
              ? 'success'
              : item.notApprovedReason == null
              ? 'gray'
              : 'error'
          "
        >
          {{
            item.isApproved == true
              ? "تم"
              : item.notApprovedReason == null
              ? "مطلوب ملاحظه"
              : item.notApprovedReason
          }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="followup.model"
      :loading="searchLoading"
      :fields="headers"
      :selects="selects"
      :data="followupData"
      @on-close="followup.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>

    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      :fullscreen="textDialog.fullscreen"
      v-model="textDialog.model"
      max-width="650"
    >
      <v-card>
        <v-card-title>
          {{ textDialog.title }}
          <v-spacer></v-spacer>
          <v-btn icon @click="textDialog.fullscreen = !textDialog.fullscreen">
            <v-icon
              >mdi-window-{{
                textDialog.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="textDialog.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <dynamic-link
            :prefix="['@', '#']"
            :text="textDialog.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          ></dynamic-link>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog scrollable max-width="450" v-model="followup.deleteModel">
      <v-card :loading="followup.loading" :disabled="followup.loading">
        <v-card-title class="error white--text">
          حذف متابعة
          <v-spacer></v-spacer>
          <v-btn dark @click="followup.deleteModel = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف المتابعة رقم {{ followup.item.corresNumber }}؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            class="px-6"
            large
            v-text="'رجوع'"
            @click="followup.deleteModel = false"
          ></v-btn>
          <v-btn
            color="error"
            class="px-6"
            large
            v-text="'حذف المتابعة'"
            @click="deleteItem()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "followup",
  mounted() {
    this.initDates();
    this.init();
    console.log(this.isAdmin(), "isAdmin()");
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    followupData: {
      isFollowed: false
    },
    subjectLimit: 10,
    followup: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {},
    searchLoading: false,
    headers: [
      {
        text: "",
        value: "actionsStart",
        searchValue: "actionsStart",
        sortable: false,
        inTable: true,
        sort: 0
      },
      {
        text: "التاريخ",
        value: "date",
        searchValue: "date",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 2
      },
      // 20s, قرار السببية - 21s - 170س - شهادة الوفاة - تسليم الموقف المالي تأمين ومعاشات -
      // الوفاة
      {
        text: "رقم المكاتبة",
        value: "corresNumber",
        searchValue: "corresNumber",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,

        required: true,
        sort: 1
      },
      {
        text: "الاقسام المختصة",
        value: "GroupIds",
        searchValue: "GroupIds",
        multiple: true,
        sortable: true,
        type: "select",
        inSearch: true,
        inModel: true,

        required: true,
        inTable: true,
        sort: 4
      },
      {
        text: "جهة الوارد",
        value: "direction",
        searchValue: "direction",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 3
      },
      {
        text: "الموضوع",
        value: "subject",
        searchValue: "subject",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,

        sort: 7
      },
      {
        text: "قرار رئيس الفرع",
        value: "branchSuperiorDecision",
        searchValue: "branchSuperiorDecision",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,

        sort: 8
      },
      {
        text: "الإجراء المتخذ",
        value: "procedure",
        searchValue: "procedure",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inModel: true,

        inTable: true,
        sort: 9
      },
      {
        text: "ملاحظات رائيس الفرع",
        value: "notApprovedReason",
        searchValue: "notApprovedReason",
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 12
      },
      {
        text: "متابع",
        trueValue: "متابع",
        falseValue: "غير متابع",
        value: "isFollowed",
        searchValue: "isFollowed",
        type: "checkbox",
        inSearch: true,
        inModel: true,

        inTable: true,
        sort: 6,
        allowFunction: "canUnfollow"
      },

      {
        text: "موافقه رائيس الفرع",
        value: "isApproved",
        searchValue: "isApproved",
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 11
      },
      {
        text: "",
        value: "actions",
        searchValue: "actions",
        sortable: false,
        sort: 10
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "followup",
    selects: {
      GroupIds: {
        table: "UsersGroups",
        text: "Name",
        value: "ID_KEY"
      }
    },
    printer: {}
  }),
  methods: {
    canUnfollow() {
      let { section, canUnfollow } = this.$store.state.currentUser;
      return section == 0 || canUnfollow == true;
    },
    canAddFollowup() {
      let { section, canAddFollowup } = this.$store.state.currentUser;
      return section == 0 || canAddFollowup == true;
    },
    canEditMe(v) {
      let {
        section,
        canAddFollowup,
        canUnfollow
      } = this.$store.state.currentUser;
      return (
        v == "procedure" ||
        section == 0 ||
        canAddFollowup == true ||
        (canUnfollow && v == "isFollowed")
      );
    },
    async deleteItem() {
      let { corresId } = this.followupData;
      this.$set(this.followup, "loading", true);
      let deleteItem = await this.api(`global/delete_all`, {
        table: "Correspondences",
        where: {
          corresId
        }
      });
      if (deleteItem && deleteItem.data && deleteItem.ok) {
        this.showSuccess("تم حذف المتابعة");
        this.findItems();
        this.$set(this.followup, "deleteModel", false);
        this.$set(this.followup, "model", false);
      } else {
        this.showError("تعذر حذف المتابعة من قاعدة البيانات");
      }
      this.$set(this.followup, "loading", false);
    },
    actionEdit(item) {
      // console.log("filtered" ,this.selects.GroupIds.data)
      // console.log("actual" ,item.GroupIds)
      // console.log("filtered" ,this.selects.GroupIds.data.filter(ele=>item.GroupIds.includes(ele.Name)).map(ele =>ele.Name))
      // console.log("filtered" ,this.selects.GroupIds.data.filter(ele=>item.GroupIds.includes(ele.ID_KEY)).map(ele =>ele.Name))
      // // this.$set(this.followupData , "GroupIds" , this.selects.GroupIds.data.filter(ele=>item.GroupIds.includes(ele.Name)).map(ele =>ele.Name))
      this.$set(this, "followupData", {
        ...item,
        GroupIds: this.selects.GroupIds.data
          .filter(ele => item.GroupIds.includes(ele.Name))
          .map(ele => ele.ID_KEY)
      });
      console.log("item afet", this.followupData);
      this.$set(this.followup, "model", true);
    },
    actionDelete(item) {
      this.$set(this, "followupData", { ...item });
      this.$set(this.followup, "deleteModel", true);
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.followup, "loading", false);
        console.log("item is", this.followupData);
        let corresId = this.followupData.corresId,
          isCreate = !corresId ? true : false;
        let where = {
          ...this.followupData,
          GroupIds: JSON.stringify(this.followupData.GroupIds)
        };
        delete where.corresId;
        if (isCreate) {
          where.createdBy = this.$store.state.currentUser.realName;
        } else {
          where.modifiedBy = this.$store.state.currentUser.realName;
        }
        let saveItem = await this.api(
          `global/${isCreate ? "create" : "update"}_one`,
          {
            table: "Correspondences",
            where: isCreate
              ? where
              : {
                  corresId
                },
            update: where,
            returner: "corresId"
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.$set(this, "followupData", { isFollowed: false });
          this.findItems();

          edirableFromTableItem ? null : this.showSuccess("تم حفظ المتابعة");
          if (!isCreate) {
            this.findItems();
          }
          this.$set(this.followup, "model", false);
        } else {
          this.showError("تعذر حفظ المتابعة في قاعدة البيانات");
        }
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ المتابعة في قاعدة البيانات");
      }
      this.$set(this.followup, "loading", false);
    },
    openTextDialog(item, modelToOpen, title) {
      this.$set(
        this.textDialog,
        "title",
        title ? `${title} - متابعة بتاريخ ${item.date}` : "عرض نص"
      );
      this.$set(this.textDialog, "text", item[modelToOpen]);
      this.$set(this.textDialog, "model", true);
    },
    findItems() {
      this.$set(this, "searchLoading", false);
      this.$set(this, "items", []);
      let { section, isAdmin, GroupIds } = this.$store.state.currentUser,
        where = { ...this.search },
        likes = [
          "direction",
          "subject",
          "branchSuperiorDecision",
          "procedure",
          "GroupIds"
        ],
        dates = ["date"],
        multi = [];
      if (GroupIds != null || isAdmin) {
        if (!isAdmin) {
          console.log("GROUP IDS", GroupIds);

          if (GroupIds) {
            where.GroupIds = GroupIds;
          }
        }
        where = this.mapToQuery(where, likes, multi, dates);
        this.api("global/get_all", {
          table: "Correspondences",
          where: where,
          order: [["corresId", "desc"]]
        })
          .then(x => {
            let data = this.fixDates(x.data, ["date"]),
              printer = {
                cons: [...data],
                excelKey: "cons",
                excelHeaders: this.headers.filter(f => f.inSearch)
              };
            data.forEach(el => {
              el.GroupIds = JSON.parse(el.GroupIds)?.map(
                ele =>
                  this.selects.GroupIds.data.find(group => group.ID_KEY == ele)
                    ?.Name
              );
            });
            console.log(data);
            this.$set(this, "items", data);
            this.$set(this, "printer", printer);
          })
          .catch(error => {
            console.log(error);
            this.showError("حدث خطأ أثناء احضار المتابعات من قاعدة البيانات");
          })
          .finally(() => {
            this.$set(this, "searchLoading", false);
          });
      }
    },
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionAdd() {
      this.$set(this.followup, "item", {});
      this.$set(this.followup, "model", true);
    }
  }
};
</script>
