<template>
  <div>
    <v-card-title>
      <v-spacer/>

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة ملف مؤيد
      </v-btn>
    </v-card-title>

    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'ملفات المؤيدات'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.FileItemNumber="{ item }">
        <v-chip :class="item.FilePath.length ? 'green' : 'red'">
          {{ item.FilePath.length }}
        </v-chip>
      </template>
      <template v-slot:item.addInternals="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
              class="mx-auto"
              @click="actionRouteToFileFollowers(item)"
              large
              outlined
              color="primary"
          >
            عرض أفراد الملف
          </v-btn>
        </div>
      </template>
      <template v-slot:item.FilePath="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
              v-for="(file, index) of item.FilePath"
              class="mx-auto"
              :key="file"
              large
              @click="openFile(file, item)"
              outlined
              color="primary"
          >
            عرض الملف رقم ({{ index + 1 }})
          </v-btn>
        </div>
      </template>
    </table-bulider>

    <editor-dialog-bulider
        :title="'اضافة ملف مؤيد'"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :data="archiveFile"
        @on-close="createdObject.model = false"
        @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const fs = require("fs");

export default {
  name: "FollowersArchiveFiles",

  mounted() {
    this.findItems({});
  },
  data: () => ({
    archiveFile: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    previousFiles:[],
    searchLoading: false,
    loading: false,
    showFillDialog: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "رقم الحافظة",
          value: "ArchiveNum",
          searchValue: "ArchiveNum",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "رقم المسلسل",
          value: "SequenceNum",
          searchValue: "SequenceNum",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "عدد المرفقات في المؤيد",
          value: "FileItemNumber",
          searchValue: "FileItemNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "الملف",
          value: "FilePath",
          searchValue: "FilePath",
          sortable: true,
          type: "files",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "",
          value: "addInternals",
          searchValue: "addInternals",
          sortable: false,
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
    }
  }),

  methods: {
    async deleteItem(item) {
      try {
        let results = await Promise.all(
            item.FilePath.map(async (ele, index) => {
              console.log("item" , ele);
              return this.api("global/delete_file", {
                FilePath: ele,
              });
            })
        );
        console.log(
            "results",
            results.map(ele => ele.data)
        );

        await this.api(`global/delete_all`, {
          table: "ArchiveFileFollowers",
          where: {
            ArchiveFileID: item.ID_KEY
          }
        });

        await this.api(`global/delete_all`, {
          table: "FollowerArchiveFiles",
          where: {
            ID_KEY: item.ID_KEY
          }
        });




        this.showSuccess("تم الحذف بنجاح");
        this.findItems({});
      } catch (error) {
        this.showError("تعذر الحذف");
        console.log(error);
      }
    },

    async saveItem(edirableFromTableItem) {
      console.log("File is", this.archiveFile);
      if(this.archiveFile.isEdit){

        let results = await Promise.all(
            this.previousFiles.map(async (ele, index) => {
              console.log("item" , ele);
              return this.api("global/delete_file", {
                FilePath: ele,
              });
            })
        );
        console.log(
            "results",
            results.map(ele => ele.data)
        );
      }
      let results = await Promise.all(
          this.archiveFile.FilePath.map(async (ele, index) => {
            return this.api("global/copy_file", {
              FilePath: ele.path,
              ArchiveNum: this.archiveFile.ArchiveNum,
              SequenceNum: this.archiveFile.SequenceNum + index
            });
          })
      );
      console.log(
          "results",
          results.map(ele => ele.data)
      );

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(this.archiveFile.isEdit ? `global/update_one` : `global/create_one`, {
          table: "FollowerArchiveFiles",
          where: this.archiveFile.isEdit  ? {
            ID_KEY : this.archiveFile.ID_KEY
          }:{
            ...this.archiveFile,
            FilePath: JSON.stringify(results.map(ele => ele.data))
          },
          update :{...this.archiveFile ,
            FilePath: JSON.stringify(results.map(ele => ele.data))
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
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
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "FollowerArchiveFiles"
      })
          .then(x => {
            let data = x.data.map(ele => ({
              ...ele,
              FilePath: ele.FilePath.includes("[")
                  ? JSON.parse(ele.FilePath)
                  : [ele.FilePath]
            }));
            this.$set(this.mainTable, "items", data);
          })
          .catch(error => {
            console.log(error);
            this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          })
          .finally(() => {
            this.$set(this, "searchLoading", false);
          });
    },
    async actionAdd() {
      this.$set(this, "archiveFile", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionRouteToFileFollowers(item) {
      this.$router.push(`/ArchiveFileFollowers/${item.ID_KEY}`);
    },

    async actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "previousFiles", item.FilePath);
      this.$set(this, "archiveFile", {
        ...item,
        isEdit: true
      });
    },

    async openFile(filePath, item) {
      let file = await this.api("global/copy_file_to_printer", {
        FilePath: filePath,
        ArchiveNum: item.ArchiveNum,
        SequenceNum: item.SequenceNum
      });

      console.log("file", filePath);
      await this.api("global/open_file", {
        path: file.data
      });
    }
  }
};
</script>
