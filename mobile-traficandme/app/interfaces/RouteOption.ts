export default interface RouteOption {
  guidance: any;
  summary: {
    travelTimeInSeconds: number;
    lengthInMeters: number;
  };
  legs: [
    {
      points: string;
    }
  ];
}