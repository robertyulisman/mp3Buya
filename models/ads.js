'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const adsSchema = Schema({
    ishowAds: { type: Boolean, default: false },
    isTestAds: { type: Boolean, default: true },
    admob: {
        idBannerAdmob: { type: String, default: "id banner admob blum di masukan" },
        idIntAdmob: { type: String, default: "id int admob blum di masukan" },
        intervalInt: { type: Number, default: 2 },
    },
    unityAds: {
        unityGameID: { type: String, default: "unityGameID blum di masukan" },
    },
    fanAds: {
        fanBanner: { type: String, default: "YOUR_PLACEMENT_ID" },
        fanInter: { type: String, default: "YOUR_PLACEMENT_ID" },
    },
    id_app : { type: Schema.Types.ObjectId, ref: 'Application'},
    create_at: { type: String, required: true, default : Date.now()},
    update_at: { type: String, required: true, default : Date.now()}
});

module.exports = mongoose.model('Ads', adsSchema)