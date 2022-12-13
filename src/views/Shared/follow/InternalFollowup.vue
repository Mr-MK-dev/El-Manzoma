<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :addButton="$store.state.currentUser.isAdmin"
      :clearOption="true"
      title="  بحث متقدم في المتابعات الداخلية"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="'المتابعات الداخلية'"
    >
      <template v-slot:item.Subject="{ item }">
        <div v-if="item.Subject">
          <div v-if="item.Subject.length <= SubjectLimit || item.SubjectShown">
            <dynamic-link
              :prefix="['@', '#']"
              :text="item.Subject.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            ></dynamic-link>
          </div>
          <div v-else>
            {{ item.Subject | filterStrLimit(SubjectLimit) }}
          </div>
          <v-chip v-if="item.Subject.length > SubjectLimit" color="transparent">
            <v-btn
              @click="item.SubjectShown = !item.SubjectShown"
              icon
              small
              depressed
            >
              <v-icon>
                mdi-window-{{ item.SubjectShown ? "restore" : "maximize" }}
              </v-icon>
            </v-btn>
            <v-btn
              @click="openTextDialog(item, 'Subject', 'الموضوع')"
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
      <template v-slot:item.isFinished="{ item }">
        <v-chip :color="item.isFinished == true ? 'success' : 'error'">
          {{ item.isFinished == true ? " منتهي" : "لم ينتهي بعد " }}
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
          هل أنت متأكد من حذف المتابعة رقم {{ followup.item.ID_KEY }}؟
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
    this.findItems();

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
      // 20s, قرار السببية - 21s - 170س - شهادة الوفاة - تسليم الموقف المالي تأمين ومعاشات -
      // الوفاة
      {
        text: "القسم المختص",
        value: "UsersGroup.Name",
        searchValue: "GroupId",
        multiple: false,
        sortable: true,
        type: "select",
        inSearch: true,
        inModel: true,
        adminOnly: true,
        required: true,
        inTable: true,
        sort: 4
      },
      {
        text: "الموضوع",
        value: "Subject",
        searchValue: "Subject",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,
        adminOnly: true,

        sort: 7
      },
      {
        text: "قرار رئيس الفرع",
        value: "ManagerResponse",
        searchValue: "ManagerResponse",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,
        adminOnly: true,

        sort: 8
      },
      {
        text: "تاريخ الانتهاء",
        value: "DeadLine",
        searchValue: "DeadLine",
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: false,
        adminOnly: true,
        sort: 3
      },

      {
        text: "رد القسم المختص",
        value: "BranchResponse",
        searchValue: "BranchResponse",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,

        sort: 8
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
        adminOnly: true,

        inTable: true,
        sort: 6,
        allowFunction: "canUnfollow"
      },

      {
        text: "موافقه رائيس الفرع",
        value: "isFinished",
        searchValue: "isFinished",
        type: "checkbox",
        inSearch: true,
        inTable: true,
        adminOnly: true,

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
      GroupId: {
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
        section == 0 ||
        canAddFollowup == true ||
        (canUnfollow && v == "isFollowed")
      );
    },
    async deleteItem() {
      let { ID_KEY } = this.followupData;
      this.$set(this.followup, "loading", true);
      let deleteItem = await this.api(`global/delete_all`, {
        table: "InternalFollowUp",
        where: {
          ID_KEY
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
      this.$set(this, "followupData", { ...item, isEdit: true });
      console.log("item afet", this.followupData);
      this.$set(this.followup, "model", true);
    },
    actionDelete(item) {
      this.$set(this, "followupData", { ...item });
      this.$set(this.followup, "deleteModel", true);
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.followup, "loading", true);
        console.log("item is", this.followupData);
        let saveItem = await this.api(
          `global/${!this.followupData.isEdit ? "create" : "update"}_one`,
          {
            table: "InternalFollowUp",
            where: !this.followupData.isEdit
              ? this.followupData
              : {
                  ID_KEY: this.followupData.ID_KEY
                },
            update: this.followupData
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.$set(this, "followupData", { isFollowed: false });
          this.findItems();

          edirableFromTableItem ? null : this.showSuccess("تم حفظ المتابعة");
          if (this.followupData.isEdit) {
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
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let { section, isAdmin, GroupIds } = this.$store.state.currentUser,
        where = { ...this.search },
        likes = ["GroupId"],
        dates = ["DeadLine"],
        multi = [];
      if (GroupIds != null || isAdmin) {
        if (!isAdmin) {
          console.log("GROUP IDS", GroupIds);

          if (GroupIds) {
            where.GroupId = GroupIds;
          }
        }
        where = this.mapToQuery(where, likes, multi, dates);
        this.api("global/get_all", {
          table: "InternalFollowUp",
          where: where,
          include: [
            {
              model: "UsersGroups"
            }
          ]
        })
          .then(x => {
            let data = this.fixDates(x.data, ["DeadLine"]),
              printer = {
                cons: [...data],
                excelKey: "cons",
                excelHeaders: this.headers.filter(f => f.inSearch)
              };
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
