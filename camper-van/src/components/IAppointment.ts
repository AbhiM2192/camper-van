export interface IStation{
    id:string;
    name:string;
    bookings:IBooking[];
}

export interface IBooking{
    customerName:string;
    endDate:string;
    id:string;
    pickupReturnStationId:string;
    startDate:string;
}
