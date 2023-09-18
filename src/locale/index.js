import Vue from 'vue';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import zhTLocale from 'iview/src/locale/lang/zh-TW';
import koTLocale from 'iview/src/locale/lang/ko_KR';

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.lang || localLang || 'zh-CN';

Vue.config.lang = 'ko_KR';

// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US']);
const mergeTW = Object.assign(zhTLocale, locales['zh-TW']);
const mergeKO = Object.assign(koTLocale, locales['ko_KR']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);
Vue.locale('zh-TW', mergeTW);
Vue.locale('ko_KR', mergeKO);
