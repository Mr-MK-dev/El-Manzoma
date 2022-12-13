<template>
  <div>
    <v-card>
      <div style="padding: 35px;" v-if="!hideSelection">
        <v-row>
          <v-col cols="9">
            <v-autocomplete
              :items="
                headers
                  .filter(h => h.inTable)
                  .filter(ele => (ele.forAdmin && isAdmin()) || !ele.forAdmin)
              "
              v-model="headersDisplayed"
              return-object
              label="إختيارات العرض"
              multiple
              clearable
              deletable-chips
              chips
            ></v-autocomplete>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-card class="mt-8">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :wordFile="wordFile"
          :isExcel="isExcel"
          :fab="false"
          @fileIsOpened="handelFileIsOpened()"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :height="height"
        :headers="headersDisplayed"
        :items="items"
        hide-default-header
        fixed-header
        multi-sort
        :items-per-page="15"
        :loading="loading"
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="items"
            :table="table"
            :hasSort="hasSort"
            @sorted="sortData"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>

        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="scope"
        >
          <slot :name="slot" v-bind="scope"
        /></template>
      </v-data-table>
    </v-card>
  </div>
</template>
<style>
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: #fff;
}
.v-data-table__wrapper tbody tr:nth-child(even) {
  background-color: #eee;
}

.theme--light.v-data-table.v-data-table--fixed-header thead th {
  background-color: var(--v-sidenav-base) !important;
  border-color: var(--v-sidenav-base) !important;
}

.v-data-table__wrapper tbody tr:nth-child(odd) {
  background-color: rgb(218 218 218);
}
</style>

<script>
import lodash from "lodash";

export default {
  name: "analytical-table-bulider",
  emits: ["fileIsOpened"],

  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    wordFile: {
      type: String,
      default: () => ""
    },
    hideSelection: {
      type: Boolean,
      default: () => false
    },
    height: {
      type: Number,
      default: () => 600
    },
    hasSort: {
      type: Boolean,
      default: () => false
    },
    items: {
      type: Array,
      default: () => []
    },
    filterItems: {
      type: Array,
      default: () => []
    },
    printer: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    isExcel: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    tableFilters: {},
    headersDisplayed: [],
    lastSort: "",
    lastOrder: ""
  }),
  mounted() {

    this.headersDisplayed = this.headers
      .filter(h => h.inTable)
      .filter(ele => (ele.forAdmin && this.isAdmin()) || !ele.forAdmin);





  },
  watch: {
    headers() {
      this.headersDisplayed = this.headers
        .filter(h => h.inTable)
        .filter(ele => (ele.forAdmin && this.isAdmin()) || !ele.forAdmin);
    },
    items() {

      let returnedItem = this.items
      for(let i = 0 ;i <this.filterItems.length ; i++){
        console.log(this.filterItems[i]);
        if(i > 0) {
          // for (let j = 0; j < Object.keys(returnedItem).length; j++) {
          //   console.log("returneditem", Object.keys(returnedItem)[j]);
          // }
          Object.keys(returnedItem).forEach(ele=>{
            returnedItem[ele] = lodash.groupBy(returnedItem[ele], this.filterItems[i]);

          })


        }
        else {
          returnedItem = lodash.groupBy(returnedItem , this.filterItems[i]);

        }
        console.log("REturnedItems" , returnedItem);

      }

      console.log("REturnedItems" , returnedItem);

    }
  },
  methods: {
    removeFilter(key) {
      this.$set(this.filters, key, undefined);
    },
    handelFileIsOpened() {
      this.$emit("fileIsOpened");
    },
    sortData(e) {
      this.items = lodash.orderBy(
        this.items,
        [e.value],
        this.lastOrder ? "asc" : "desc"
      );
      this.printer.data = this.items;
      this.lastSort = e.value;
      this.lastOrder = !this.lastOrder;
    }
  }
};
</script>
