"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingResult = void 0;
class TrackingResult {
    getEventTrackings() {
        var _a;
        const data = (_a = this.avails) === null || _a === void 0 ? void 0 : _a.map(itemAvails => {
            return itemAvails.ads.map(itemAd => {
                return itemAd.trackingEvents.map(itemTrackingEvent => {
                    return {
                        availId: itemAvails.id,
                        adId: itemAd.id,
                        position: itemAd.position,
                        beaconUrls: itemTrackingEvent.beaconUrls,
                        eventType: itemTrackingEvent.eventType,
                        startTimeInSeconds: itemTrackingEvent.startTimeInSeconds,
                        state: false
                    };
                });
            });
        });
        return !data ? [] : data.flat(2);
    }
    getLastAvail() {
        var _a;
        if (!this.avails) {
            return undefined;
        }
        return ((_a = this.avails) === null || _a === void 0 ? void 0 : _a.length) ? this.avails[0] : undefined;
    }
}
exports.TrackingResult = TrackingResult;
// export interface EventTracking extends Ad {
//   availId: string // availId_AdId_position
// }
//# sourceMappingURL=types.js.map