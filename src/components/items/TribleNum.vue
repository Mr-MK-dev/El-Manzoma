<template>
  <div>
    <v-row>
      <v-col :cols="'4'" :key="i">
        <v-text-field
          filled
          :type="'text'"
          :label="'السنة'"
          v-model="year"
          :required="required != null ? required : false"
          :rules="required ? [v => !!v || ' يجب ادخال السنة'] : []"
        />
      </v-col>
      <v-col :cols="'4'" :key="i">
        <v-text-field
          filled
          :type="'text'"
          :label="'المركز'"
          v-model="center"
          :required="required != null ? required : false"
          :rules="required ? [v => !!v || 'يجب ادخال  المركز'] : []"
        />
      </v-col>
      <v-col :cols="'4'" :key="i">
        <v-text-field
          filled
          :type="'text'"
          :label="'المسلسل'"
          v-model="num"
          @keydown.tab="emitKeyDown()"
          :required="required != null ? required : false"
          :rules="required ? [v => !!v || 'يجب ادخال المسلسل '] : []"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TribleNum",
  emits: ["updateValue", "emitKeyDown"],

  watch: {
    year(v) {
      this.calcValue();
    },
    center(v) {
      this.calcValue();
    },
    num(v) {
      this.calcValue();
    },
    model(v) {
      console.log("model", this.model);
      this.model = v;
      this.year = this.model.split("-")[0] || "";
      this.center = this.model.split("-")[1] || "";
      this.num = this.model.split("-")[2] || "";
    }
  },
  mounted() {
    this.year = this.model.split("-")[0] || "";
    this.center = this.model.split("-")[1] || "";
    this.num = this.model.split("-")[2] || "";
  },
  data: () => ({
    year: "",
    center: "",
    num: ""
  }),

  props: {
    model: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    calcValue() {
      this.model = `${this.year}-${this.center}-${this.num}`;
      this.$emit("updateValue", this.model);
    },
    emitKeyDown() {
      this.$emit("emitKeyDown", this.model);
    }
  }
};
</script>
