<template>
  <v-toolbar
      dark
      color="teal"
  >
    <v-toolbar-title>Station selection</v-toolbar-title>
    <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        item-text="name"
        item-value="id"
        cache-items
        class="mx-4"
        flat
        clearable
        hide-no-data
        hide-details
        label="Please Select a station"
        solo-inverted
    ></v-autocomplete>
  </v-toolbar>
</template>
<script lang="ts">
import { Component, Vue,Watch } from 'vue-property-decorator';
@Component({
  components: {}
})
export default class AutoComplete extends Vue {
  loading =  false;
  search = null;
  select = null;
  searchList = [];
  searchData = [];
  @Watch('search')
  onSearchChange(){
    // Items have already been loaded
    if (this.items.length > 0) return

    // Items have already been requested
    if (this.loading) return

    this.loading = true
    fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations')
        .then(res => res.json())
        .then(res =>{
          this.searchList = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.loading = false))
  }
  @Watch('select')
  onSelectChange(){
    if(this.select !== null){
      this.searchData = this.searchList.filter(item => item.id === this.select);
      this.$emit('searchData',this.searchData[0]);
    } else {
      this.$emit('searchData',null);
    }
  }
  get items(){
    return this.searchList
  }

}
</script>

<style scoped>

</style>
