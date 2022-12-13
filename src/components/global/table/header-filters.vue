<template>
  <thead class="v-data-table-header sidenav">
    <tr
      :class="hasSort ? 'v-data-table-header-sort' : ''"
      v-if="
        table &&
          table.props &&
          table.props.headers &&
          table.props.headers.length > 0
      "
    >
      <template v-for="(header, i) in table.props.headers">
        <th :key="i" :class="`transparent text-center`">
          <v-chip
            dark
            color="transparent"
            label
            :class="`${isChip ? '' : 'no-chip'} pa-0`"
          >
            <!--
                          @click="
                !Object.keys(header).includes('sortable') || header.sortable
                  ? sortOn(header.value)
                  : () => {}
              "
            -->
            <v-menu
              v-if="
                !header.noFilter &&
                  (!Object.keys(header).includes('sortable') || header.sortable)
              "
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="getDataFilter(header.value)"
                  dark
                  v-on="on"
                  icon
                  class="btn-table"
                  small
                >
                  <v-icon v-if="hasSort" dark small @click="sort(header.value)"
                    >mdi-sort</v-icon
                  >
                  {{ header.text }}

                  <!-- @click="showFilterOn(header.value, header.text)" -->
                  <v-icon small>mdi-filter-variant</v-icon>
                </v-btn>
              </template>
              <v-sheet max-width="500" width="500" min-height="60">
                <div class="py-1">
                  <v-autocomplete
                    clearable
                    multiple
                    :items="
                      dataFilters[header.value] ? dataFilters[header.value] : []
                    "
                    item-value="value"
                    item-text="text"
                    filled
                    :return-object="false"
                    :label="header.text"
                    hide-details
                    v-model="filters[header.value]"
                  ></v-autocomplete>
                </div>
              </v-sheet>
            </v-menu>
          </v-chip>
        </th>
      </template>
    </tr>
  </thead>
</template>

<style>
.btn-table {
  text-align: right;
  display: inline-block !important;
  width: 50% !important;
}
/* .v-data-table-header-sort .btn-table {
  position: relative;
  top: -10px;
} */

.v-data-table-header-sort .mdi-sort {
  position: relative;
  left: 20px;
  font-size: 18px;
}
</style>

<script>
export default {
  name: "header-filters",
  emits: ["sorted"],
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    center: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    hasSort: {
      type: Boolean,
      default: () => false
    },
    filters: {
      type: Object,
      default: () => {}
    },
    conditionKey: {
      type: String,
      default: ""
    },
    conditionValue: {
      type: String,
      default: ""
    },
    isChip: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    itemsLength(v) {
      // console.log("Length Changed");
      // this.getDataFilters();
      this.$set(this, "dataFilters", {});
    },
    items(v) {
      this.current_items = v;
    },
    filters: {
      handler(v) {
        this.$set(
          this,
          "current_items",
          this.items.filter(i => {
            return Object.keys(v).every(f => {
              // return v[f]?.length < 1 || v[f]?.includes(i[f]);
              if (!v[f] || v[f]?.length < 1) {
                return true;
              } else {
                if (f.includes(".")) {
                  return v[f].includes(this.getObjectValueByPath(i, f));
                } else {
                  return v[f].includes(i[f]);
                }
              }
            });
          })
        );
        console.log("allItems", this.items);
        console.log("filters", v);
        console.log("current items after filter", this.current_items);
        Object.keys(v).forEach(key => {
          let val = v[key],
            index = this.table.props.headers.findIndex(f => f.value == key),
            conditionKey = this.conditionKey,
            conditionValue = this.conditionValue;
          if (typeof val == "object" && Array.isArray(val) && val.length == 0) {
            this.$set(this.table.props.headers[index], "filter", undefined);
          } else {
            if (this.table.props.headers && this.table.props.headers[index]) {
              this.$set(this.table.props.headers[index], "filter", function(
                value,
                search,
                item
              ) {
                search = val;
                if (
                  search === undefined ||
                  (!search &&
                    search.length == 0 &&
                    typeof search !== "number") ||
                  (conditionKey &&
                    conditionKey.length > 0 &&
                    Object.keys(item).includes(conditionKey) &&
                    item[conditionKey] !== conditionValue)
                ) {
                  return true;
                } else {
                  let returner = false;
                  search.forEach(s => {
                    if (value === s) {
                      returner = true;
                    }
                  });
                  return returner;
                }
              });
            }
          }
        });
      },
      deep: true
    }
  },
  data: () => ({
    dataFilters: {},
    current_items: []
  }),
  computed: {
    itemsLength() {
      return this.items.length;
    }
  },
  methods: {
    sort(value) {
      this.$emit("sorted", {
        value
      });
    },
    getObjectValueByPath(obj, path, fallback = undefined) {
      // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
      if (obj == null || !path || typeof path !== "string") return fallback;
      if (obj[path] !== undefined) return obj[path];
      path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      path = path.replace(/^\./, ""); // strip a leading dot
      return this.getNestedValue(obj, path.split("."), fallback);
    },
    getNestedValue(obj, path, fallback) {
      const last = path.length - 1;
      if (last < 0) return obj === undefined ? fallback : obj;
      for (let i = 0; i < last; i++) {
        if (obj == null) {
          return fallback;
        }
        obj = obj[path[i]];
      }
      if (obj == null) return fallback;
      return obj[path[last]] === undefined ? fallback : obj[path[last]];
    },
    getDataFilter(key) {
      let map = {},
        vals = this.current_items.map(m => {
          let v = this.getObjectValueByPath(m, key);
          map[v] = {
            counter: map[v] ? map[v].counter + 1 : 1,
            text: `${v} [${map[v] ? map[v].counter + 1 : 1}]`,
            value: v
          };
          return 0;
        }),
        returner = Object.values(map);
      this.$set(this.dataFilters, key, returner);
      return;
    },
    removeFilters() {
      this.$set(this, "dataFilters", {});
      this.table.props.headers.forEach((ele, index) => {
        this.$set(this.table.props.headers[index], "filter", undefined);
      });
    },
    getDataFilters() {
      this.$set(this, "dataFilters", {});
      let items = this.items,
        headers = this.table.props.headers.map(h => h.value),
        obj = {};
      headers.forEach(header => {
        let header_splitted = header.split("."),
          h_items = [...new Set(items)];
        header_splitted.forEach(hs => {
          if (hs) {
            delete obj[header];
            h_items = [...new Set(h_items.map(f => (f ? f[hs] : null)))];
            obj[header] = h_items;
          }
        });
      });
      Object.keys(obj).forEach(key => {
        let vals = obj[key],
          hasDot = key.includes("."),
          splitter = hasDot ? key.split(".") : [],
          length = splitter ? splitter.length : 0,
          k1 = hasDot ? splitter[0] : key,
          k2 = hasDot && length > 0 ? splitter[1] : key,
          k3 = hasDot && length > 1 ? splitter[2] : key,
          k4 = hasDot && length > 2 ? splitter[3] : key;
        vals.forEach((val, i) => {
          let counter = items.filter(f =>
            hasDot
              ? length == 2
                ? (f[k1] && f[k1][k2] == val) ||
                  (val === null && (!f[k1] || !f[k1][k2]))
                : length == 3
                ? (f[k1] && f[k1][k2] && f[k1][k2][k3] == val) ||
                  (val === null && (!f[k1] || !f[k1][k2] || !f[k1][k2][k3]))
                : (f[k1] &&
                    f[k1][k2] &&
                    f[k1][k2][k3] &&
                    f[k1][k2][k3][k4] == val) ||
                  (val === null &&
                    (!f[k1] ||
                      !f[k1][k2] ||
                      !f[k1][k2][k3] ||
                      !f[k1][k2][k3][k4]))
              : f[key] == val
          ).length;
          obj[key][i] = {
            value: val,
            text: `${val}`
          };
          // [${counter}]
        });
      });
      this.$set(this, "dataFilters", obj);
      return;
    },
    sortOn(v) {}
  },
  mounted() {}
};
</script>
