
<template>
  <v-row>
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-menu
              bottom
              right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            :events="events"
            color="primary"
            :type="type"
            v-model="focus"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:event="showEvent"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
            v-if="!loading"
        >
          <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
          >
            <v-toolbar
                color="teal"
                dark
            >
              <v-toolbar-title v-html="selectedEvent.customerName"></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Booking Start Date</v-list-item-title>
                  <v-list-item-subtitle>{{selectedEvent.start}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Booking End Date</v-list-item-title>
                  <v-list-item-subtitle>{{selectedEvent.end}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Booking Duration</v-list-item-title>
                  <v-list-item-subtitle>{{selectedEvent.count}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Pickup-Return Station Name</v-list-item-title>
                  <v-list-item-subtitle>{{selectedEvent.pickupStation}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue,Prop,Watch } from 'vue-property-decorator';
import moment from 'moment';
import {IStation} from '@/components/IAppointment';
@Component({
  components: {}
})
export default class Calendar extends Vue {
  focus = '';
  type =  'month';
  loading =  false;
  typeToLabel =  {
    month: 'Month',
    week: 'Week',
    day: 'Day',
  };
  selectedEvent = {
    customerName: undefined,
    id: undefined,
    pickupReturnStationId:undefined,
    startDate:undefined,
    endDate:undefined
  };
  selectedElement =  null;
  selectedOpen = false;
  @Prop()
  eventsData:IStation;

  $refs:{
    calendar
  }
  prev () {
    this.$refs.calendar.prev()
  }
  next () {
    this.$refs.calendar.next()
  }

  get events(){
    let bookings = [];
    bookings = this.eventsData.bookings.map(booking => {
      let Obj = {
        name: '',
        start: 0,
        end: 0,
        id:'',
        pickupReturnStationId:''
      }

      Obj.start= moment(new Date(booking.startDate)).valueOf();
      Obj.end =moment(new Date(booking.endDate)).valueOf();
      Obj.name = booking.customerName;
      Obj.id = booking.id;
      Obj.pickupReturnStationId = booking.pickupReturnStationId;
      return Obj
    });
    return bookings
  }

  setToday () {
    this.focus = ''
  }
  viewDay ({ date }) {
    this.focus = date
    this.type = 'day'
  }
  showEvent ({ nativeEvent, event }) {
    const open = () => {
      this.fetchEventDetails(event)
      this.selectedElement = nativeEvent.target
      requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }
  fetchEventDetails(event){
    this.loading = true;
    fetch(`https://605c94c36d85de00170da8b4.mockapi.io/stations/${event.pickupReturnStationId}/bookings/${event.id}`)
        .then(res => res.json())
        .then(res =>{
          this.selectedEvent = this.cardData(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.loading = false))
  }

  cardData(res){
    let obj ={}
    if(res.customerName){
      obj['customerName'] = res.customerName;
      obj['id'] = res.id;
      obj['start'] = res.startDate.split('T')[0];
      obj['end'] = res.endDate.split('T')[0];
      obj['pickupStation'] = this.eventsData.name;
    }
    let start = moment(obj.start, "YYYY-MM-DD");
    let end = moment(obj.end, "YYYY-MM-DD");
    obj['count'] = moment.duration(end.diff(start)).asDays();
   return obj
  }
}
</script>

<style scoped>

</style>
