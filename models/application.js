'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const applicationSchema = Schema({
    name: { type: String, required: true },
    packageName: { type: String, required: true },
    ket: { type: String, default: "keterangan app" },
    list_artist : [{ type: Schema.Types.ObjectId, ref: 'Artist'}],
    isShowAds: { type: Boolean, default:true},
    isTestAds: { type: Boolean, default:true},
    isShowImageAudio: { type: Boolean, default:true},
    modeAds: {type: Number, default: 1},
    testDeviceID: { type: String, default: "testDeviceID blum di masukan" },
    idBannerAdmob: { type: String, default: "id banner admob blum di masukan" },
    idIntAdmob: { type: String, default: "id inter admob blum di masukan" },
    idNativeAdmob: { type: String, default: "id native admob blum di masukan" },
    idRewardAdmob: { type: String, default: "id reward admob blum di masukan" },
    openIdAdmob: { type: String, default: "id openID admob blum di masukan" },
    unityGameID: { type: String, default: "unityGameID blum di masukan" },
    unityBanner: { type: String, default: "banner" },
    unityInter: { type: String, default: "video" },
    fanBanner: { type: String, default: "YOUR_PLACEMENT_ID" },
    fanInter: { type: String, default: "YOUR_PLACEMENT_ID" },
    mopubBanner: { type: String, default: "id mopub banner blum dimasukan" },
    mopubInter: { type: String, default: "id mopub inter blum dimasukan" },
    startAppId: { type: String, default: "startAppID blum dimasukan" },
    sdkKeyAppLovin: { type: String, default: "sdkKeyAppLovin blum dimasukan" },
    appLovinInter: { type: String, default: "appLovinInter blum dimasukan" },
    appLovinBanner: { type: String, default: "appLovinBanner blum dimasukan" },   
    intervalInt: { type: Number, default: 2 },
    isOnRedirect: { type: Boolean, default: false },
    urlRedirect: { type: String, default: "setting Url Redirect disini" },
    urlMoreApp: { type: String, default: "setting Url More App disini" },
    privacyPolicyApp: { type: String, default: "input privacy policy app disini" },
    godev : { type: Schema.Types.ObjectId, ref: 'Godev', required : true},
    user : { type: Schema.Types.ObjectId, ref: 'User', required : true},
}, {timestamps : true});

module.exports = mongoose.model('Application', applicationSchema)