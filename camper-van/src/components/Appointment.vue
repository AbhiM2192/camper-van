<template>
<div>
<auto-complete @searchData="onSearchData"></auto-complete>
  <Calendar :eventsData="searchBookings" v-if="showCalendar"></Calendar>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AutoComplete from '@/components/Autocomplete';
import Calendar from '@/components/Calendar';
import {IStation} from '@/components/IAppointment';
@Component({
  components:{AutoComplete,Calendar}
})
export default class Appointment extends Vue {
  searchBookings:IStation;
  showCalendar = false;
  onSearchData(data){
    if(data){
      this.searchBookings = data;
      this.showCalendar = true;
    } else {
      this.showCalendar = false;
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
