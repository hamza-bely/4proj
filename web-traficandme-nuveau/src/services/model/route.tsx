
export interface Route {
    startLongitude: string;
    startLatitude: string;
    endLongitude: string;
    endLatitude: string;
    address_start: string;
    address_end: string;
    mode: string;
    user: string;
    createDate: string;
    updateDate: string;
    id: number;
    peage: boolean
    status : string
    itineraryStatus: string
}

export interface ItineraryItem {
    id: number;
    address_start: string;
    address_end: string;
    averageSpeed: number;
    congestionCount: number;
    itineraryPointCount: number;
  }