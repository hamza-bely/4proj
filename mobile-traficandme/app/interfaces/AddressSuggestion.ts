export default interface AddressSuggestion {
    id: string;
    address: {
      freeformAddress: string;
    };
    position: {
      lat: number;
      lon: number;
    };
  }