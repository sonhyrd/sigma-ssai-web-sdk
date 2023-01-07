(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ssaiTracking = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

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
    // export interface EventTracking extends Ad {
    //   availId: string // availId_AdId_position
    // }

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
                    const data = new TrackingResult();
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

    return SSAITracking;

})));
