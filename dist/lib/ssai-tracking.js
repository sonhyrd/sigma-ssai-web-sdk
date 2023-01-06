"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class SSAITracking {
    constructor(params) {
        this.video = params.video;
        this.trackingEvents = {};
        this.trackingUrl = params.trackingUrl;
        this.intervalTracking = (params === null || params === void 0 ? void 0 : params.intervalTracking) || 100000;
        this.disableErrLog = (params === null || params === void 0 ? void 0 : params.disableErrLog) || false;
    }
    init() {
        this.setIntervalGetTrackingData = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.getTrackingData();
            if (Object.entries(this.trackingEvents).length > 0 && !this.setIntervalTracking) {
                this.setIntervalTracking = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.tracking();
                    if (Object.entries(this.trackingEvents).length === 0) {
                        clearInterval(this.setIntervalTracking);
                        this.setIntervalTracking = undefined;
                    }
                }), 500);
            }
        }), this.intervalTracking);
    }
    tracking() {
        for (const [key, value] of Object.entries(this.trackingEvents)) {
            if (value.startTimeInSeconds <= this.video.currentTime && value.state === false) {
                this.trackingEvents[key].state = true;
                value.beaconUrls.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield fetch(item);
                    }
                    catch (error) {
                        if (this.disableErrLog)
                            console.error(error);
                    }
                }));
            }
        }
    }
    getTrackingData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataTracking = (yield fetch(this.trackingUrl).then((response) => response.json()));
                const data = new types_1.TrackingResult();
                data.avails = dataTracking.avails;
                (_a = data.getEventTrackings()) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                    const key = `${item.availId}_${item.adId}_${item.adId}_${item.position}_${item.eventType}`;
                    if (!this.trackingEvents[key])
                        this.trackingEvents[key] = this.trackingEvents[key] || item;
                });
                this.unShiftTrackingEvents(data);
            }
            catch (error) {
                if (this.disableErrLog)
                    console.error(error);
            }
        });
    }
    unShiftTrackingEvents(data) {
        const lastAvail = data === null || data === void 0 ? void 0 : data.getLastAvail();
        for (const [key, value] of Object.entries(this.trackingEvents)) {
            if (lastAvail && value.availId < (lastAvail === null || lastAvail === void 0 ? void 0 : lastAvail.id))
                delete this.trackingEvents[key];
        }
    }
    destroy() {
        if (this.setIntervalGetTrackingData)
            clearInterval(this.setIntervalGetTrackingData);
        if (this.setIntervalTracking)
            clearInterval(this.setIntervalTracking);
    }
}
exports.default = SSAITracking;
//# sourceMappingURL=ssai-tracking.js.map