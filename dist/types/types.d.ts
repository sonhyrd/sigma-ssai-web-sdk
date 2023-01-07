export declare class TrackingResult {
    avails: Avail[] | undefined;
    getEventTrackings(): TrackingEventExt[];
    getLastAvail(): Avail | undefined;
}
export interface Avail {
    id: number;
    startTimeInSeconds: number;
    ads: Ad[];
}
export interface Ad {
    id: string;
    position: number;
    trackingEvents: TrackingEvent[];
    startTimeInSeconds: number;
    durationInSeconds: number;
}
export interface TrackingEvent {
    eventType: string;
    startTimeInSeconds: number;
    beaconUrls: string[];
}
export interface TrackingEventExt extends TrackingEvent {
    availId: number;
    adId: string;
    position: number;
    state: boolean;
}
