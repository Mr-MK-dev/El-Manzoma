<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'الالحاقات'">
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "basic-profile-fugitives",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  async mounted() {
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result =
        this.conscripte.type == constants.serviceTypesMap.solider
          ? await this.api("global/get_all", {
              table: "followersolider",
              include: [
                {
                  model: "FollowingRigion"
                },
                {
                  model: "followerwork"
                },
                {
                  model: "Soldier"
                }
              ],
              where: {
                ID: this.conscripte.ID
              }
            })
          : await this.api("global/get_all", {
              table: "Followerrateb",
              include: [
                {
                  model: "FollowingRigion"
                },
                {
                  model: "followerwork"
                }
              ],
              where: {
                ID: this.conscripte.ID
              }
            });
      this.items = result.data;
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    headers: [
      {
        text: "مكان الإلحاق",
        value: "FollowingRigion.FollowRigionName",
        searchValue: "followplace",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: false,
        sort: 2
      },
      {
        text: "مكان العمل",
        value: "followerwork.workplace",
        searchValue: "workplace",
        sortable: true,
        type: "select",
        sortable: true,
        inSearch: true,
        inTable: true,
        inModel: true
      },
      {
        text: "الامر بالإلحاق",
        value: "Orderoffolwer",
        searchValue: "Orderoffolwer",
        type: "select",
        sortable: true,
        inSearch: true,
        inTable: true,
        inModel: true
      },
      {
        text: "المؤيد",
        value: "Suputer",
        searchValue: "Suputer",
        type: "text",
        sortable: true,
        inTable: true,
        inSearch: true,
        inModel: true
      },
      {
        text: "تاريخ الإلحاق",
        value: "TarekhElhak",
        searchValue: "TarekhElhak",
        type: "date",
        sortable: true,
        inTable: true,
        inModel: true,
        inSearch: true,
        sort: 1
      }
    ],
    search: ""
  })
};
</script>
