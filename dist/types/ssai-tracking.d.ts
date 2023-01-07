export default class SSAITracking {
    video: HTMLVideoElement;
    trackingUrl: string;
    setIntervalGetTrackingData: any;
    setIntervalTracking: any;
    private trackingEvents;
    private intervalTracking;
    private disableErrLog;
    constructor(params: {
        trackingUrl: string;
        video: HTMLVideoElement;
        intervalTracking: number;
        disableErrLog?: boolean;
    });
    init(): void;
    private tracking;
    private getTrackingData;
    private unShiftTrackingEvents;
    destroy(): void;
}
