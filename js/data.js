// ===== بيانات التطبيق =====

const APP_CONFIG = {
    name: 'دليل اليمن',
    version: '4.2.31',
    packageName: 'com.wneet.yemendirectory',
    developer: 'Platform',
    website: 'https://yemendirectory.net'
};

// المدن اليمنية
const CITIES = [
    {id:1, name:"صنعاء", key:"01", icon:"🏛️", lat:15.3694, lng:44.191, region:"العاصمة", desc:"العاصمة السياسية والاقتصادية", places:156},
    {id:3, name:"عدن", key:"02", icon:"⚓", lat:12.7855, lng:45.0187, region:"جنوب", desc:"العاصمة الاقتصادية", places:89},
    {id:4, name:"تعز", key:"04", icon:"🏔️", lat:13.5789, lng:44.0219, region:"جبال", desc:"المدينة الثقافية", places:67},
    {id:5, name:"الحديدة", key:"03", icon:"🌊", lat:14.7979, lng:42.9537, region:"ساحل", desc:"الميناء الرئيسي", places:45},
    {id:7, name:"إب", key:"04", icon:"🌿", lat:13.9667, lng:44.1667, region:"جبال", desc:"مدينة الزراعة", places:34},
    {id:10, name:"لحج", key:"02", icon:"🌾", lat:13.0567, lng:44.8817, region:"جنوب", desc:"مدينة التاريخ", places:23},
    {id:11, name:"الضالع", key:"02", icon:"⛰️", lat:13.6958, lng:44.7317, region:"جنوب", desc:"مدينة الجبال", places:18},
    {id:12, name:"شبوة", key:"05", icon:"🛢️", lat:14.5364, lng:46.8333, region:"شرق", desc:"محافظة النفط", places:15},
    {id:13, name:"المهرة", key:"05", icon:"🌴", lat:15.1667, lng:51.3333, region:"شرق", desc:"البوابة الشرقية", places:12},
    {id:14, name:"حجة", key:"07", icon:"🏜️", lat:15.6917, lng:43.6, region:"شمال", desc:"محافظة تاريخية", places:21},
    {id:15, name:"عمران", key:"07", icon:"🏔️", lat:15.6594, lng:43.9439, region:"شمال", desc:"مدينة القلاع", places:19},
    {id:16, name:"صعدة", key:"07", icon:"🕌", lat:16.94, lng:43.7639, region:"شمال", desc:"مدينة التراث", places:16},
    {id:17, name:"الجوف", key:"06", icon:"🏜️", lat:16.25, lng:44.8333, region:"وسط", desc:"محافظة الصحراء", places:14},
    {id:18, name:"مأرب", key:"06", icon:"🏛️", lat:15.4684, lng:45.3268, region:"وسط", desc:"عاصمة سبأ", places:28},
    {id:19, name:"ذمار", key:"06", icon:"🌋", lat:14.5424, lng:44.4047, region:"وسط", desc:"مدينة الجامع", places:22},
    {id:20, name:"البيضاء", key:"06", icon:"🌿", lat:13.9783, lng:45.5742, region:"وسط", desc:"مدينة الطبيعة", places:17},
    {id:21, name:"أبين", key:"02", icon:"🏖️", lat:13.6333, lng:45.3833, region:"جنوب", desc:"محافظة ساحلية", places:20},
    {id:22, name:"المحويت", key:"07", icon:"🌾", lat:15.4686, lng:43.5483, region:"شمال", desc:"مدينة الزراعة", places:11},
    {id:23, name:"سقطرى", key:"05", icon:"🦎", lat:12.4634, lng:53.8238, region:"جزر", desc:"جزيرة غالموند", places:8},
    {id:25, name:"حضرموت", key:"05", icon:"🏰", lat:14.5392, lng:49.1261, region:"شرق", desc:"أكبر المحافظات", places:42},
    {id:26, name:"ريمة", key:"03", icon:"🌿", lat:14.7333, lng:43.6167, region:"غرب", desc:"محافظة زراعية", places:9}
];

// التصنيفات
const CATEGORIES = [
    {id:1, name:"مطاعم", icon:"fa-utensils", color:"#e53935", count:89},
    {id:2, name:"فنادق", icon:"fa-hotel", color:"#1e88e5", count:34},
    {id:3, name:"مقاهي", icon:"fa-coffee", color:"#43a047", count:56},
    {id:4, name:"تسوق", icon:"fa-shopping-bag", color:"#f4511e", count:45},
    {id:5, name:"صحة", icon:"fa-heartbeat", color:"#d81b60", count:28},
    {id:6, name:"تعليم", icon:"fa-graduation-cap", color:"#5e35b1", count:23},
    {id:7, name:"سيارات", icon:"fa-car", color:"#00897b", count:19},
    {id:8, name:"عقارات", icon:"fa-home", color:"##ffb300", count:31},
    {id:9, name:"خدمات", icon:"fa-tools", color:"#6d4c41", count:42},
    {id:10, name:"صيدليات", icon:"fa-pills", color:"#00acc1", count:38},
    {id:11, name:"مستشفيات", icon:"fa-hospital", color:"#e53935", count:15},
    {id:12, name:"مكتبات", icon:"fa-book", color:"#3949ab", count:12}
];

// الأماكن
const PLACES = [
    // صنعاء
    {id:1, name:"مطعم بيت الحنيذ", cat:"مطاعم", city:"صنعاء", phone:"777123456", whatsapp:"777123456", addr:"شارع الستين، صنعاء", rating:4.8, reviews:356, desc:"أشهر مطعم يمني تقليدي - حنيذ ومندي ومظبي على الفحم. أجواء يمنية أصيلة.", hours:"6ص - 12م", verified:true, featured:true, lat:15.3694, lng:44.191},
    {id:2, name:"مطعم السعيدية", cat:"مطاعم", city:"صنعاء", phone:"777234567", whatsapp:"777234567", addr:"شارع هائل، صنعاء", rating:4.5, reviews:198, desc:"مطعم شعبي بأكل يمني تقليدي. أسعار مناسبة وطعم رائع.", hours:"7ص - 11م", verified:true, featured:false, lat:15.3694, lng:44.191},
    {id:3, name:"مطعم صنعاء القديمة", cat:"مطاعم", city:"صنعاء", phone:"777345678", whatsapp:"777345678", addr:"باب اليمن، صنعاء", rating:4.6, reviews:267, desc:"مطعم بأجواء تراثية في قلب صنعاء القديمة. مندي وبنت سلم.", hours:"10ص - 11م", verified:true, featured:true, lat:15.3694, lng:44.191},
    {id:4, name:"فندق القمة الدولي", cat:"فنادق", city:"صنعاء", phone:"777456789", whatsapp:"777456789", addr:"شارع الزبيري، صنعاء", rating:4.3, reviews:124, desc:"فندق 4 نجوم في قلب العاصمة. غرف مريحة وخدمة ممتازة.", hours:"24 ساعة", verified:true, featured:true, lat:15.3547, lng:44.2066},
    {id:5, name:"فندق شيراتون صنعاء", cat:"فنادق", city:"صنعاء", phone:"777567890", whatsapp:"777567890", addr:"شارع الحرية، صنعاء", rating:4.7, reviews:89, desc:"أفخم فنادق صنعاء. إطلالة رائعة ومرافق عالمية.", hours:"24 ساعة", verified:true, featured:true, lat:15.3547, lng:44.2066},
    {id:6, name:"مقهى الديوان", cat:"مقاهي", city:"صنعاء", phone:"777678901", whatsapp:"777678901", addr:"شارع الستين، صنعاء", rating:4.4, reviews:178, desc:"مقهى شعبي بأجواء يمنية تقليدية. قهوة يمنية أصيلة.", hours:"6ص - 12م", verified:true, featured:false, lat:15.3694, lng:44.191},
    {id:7, name:"مقهى التحرير", cat:"مقاهي", city:"صنعاء", phone:"777789012", whatsapp:"777789012", addr:"ساحة التحرير، صنعاء", rating:4.2, reviews:145, desc:"مقهى عصري في قلب العاصمة. واي فاي مجاني.", hours:"8ص - 12م", verified:true, featured:false, lat:15.3694, lng:44.191},
    {id:8, name:"صيدلية الشفاء", cat:"صيدليات", city:"صنعاء", phone:"777890123", whatsapp:"777890123", addr:"شارع حدة، صنعاء", rating:4.6, reviews:210, desc:"صيدلية شاملة تعمل 24 ساعة. أدوية ومستحضرات طبية.", hours:"24 ساعة", verified:true, featured:true, lat:15.3294, lng:44.2066},
    {id:9, name:"صيدلية النهدي", cat:"صيدليات", city:"صنعاء", phone:"777901234", whatsapp:"777901234", addr:"شارع الستين، صنعاء", rating:4.5, reviews:167, desc:"صيدلية كبيرة بتشكيلة واسعة من الأدوية.", hours:"8ص - 12م", verified:true, featured:false, lat:15.3694, lng:44.191},
    {id:10, name:"مستشفى الثورة التخصصي", cat:"مستشفيات", city:"صنعاء", phone:"777012345", whatsapp:"", addr:"شارع الستين، صنعاء", rating:4.1, reviews:89, desc:"مستشفى حكومي شامل. جميع التخصصات الطبية.", hours:"24 ساعة", verified:true, featured:true, lat:15.3694, lng:44.191},
    {id:11, name:"مستشفى الأهلي", cat:"مستشفيات", city:"صنعاء", phone:"777123450", whatsapp:"777123450", addr:"شارع حدة، صنعاء", rating:4.4, reviews:67, desc:"مستشفى خاص بمعايير عالمية.", hours:"24 ساعة", verified:true, featured:false, lat:15.3294, lng:44.2066},
    {id:12, name:"شركة الاتصالات اليمنية", cat:"خدمات", city:"صنعاﺀ", phone:"777234560", whatsapp:"", addr:"شارع الستين، صنعاء", rating:3.8, reviews:234, desc:"مزود خدمات الاتصالات الرئيسي في اليمن.", hours:"8ص - 5م", verified:true, featured:false, lat:15.3694, lng:44.191},
    {id:13, name:"مكتبة الإيمان", cat:"مكتبات", city:"صنعاء", phone:"777345670", whatsapp:"777345670", addr:"باب اليمن، صنعاء", rating:4.3, reviews:56, desc:"أكبر مكتبة في صنعاء. كتب وقرطاسية ومستلزمات مكتبية.", hours:"8ص - 10م", verified:false, featured:false, lat:15.3694, lng:44.191},
    {id:14, name:"سوق المركزي", cat:"تسوق", city:"صنعاء", phone:"777456780", whatsapp:"", addr:"شارع الستين، صنعاء", rating:4.0, reviews:178, desc:"أكبر سوق تجاري في صنعاء. ملخ�� وأجهزة وإلكترونيات.", hours:"8ص - 10م", verified:true, featured:true, lat:15.3694, lng:44.191},
    // عدن
    {id:15, name:"مطعم عدن القديمة", cat:"مطاعم", city:"عدن", phone:"773123456", whatsapp:"773123456", addr:"كريتر، عدن", rating:4.7, reviews:289, desc:"مطعم بأجواء عدنية تراثية. أسماك طازجة و mandi.", hours:"10ص - 11م", verified:true, featured:true, lat:12.7855, lng:45.0187},
    {id:16, name:"مطعم الشاطئ", cat:"مطاعم", city:"عدن", phone:"773234567", whatsapp:"773234567", addr:"العدن، عدن", rating:4.4, reviews:156, desc:"مطعم بإطلالة بحرية. أطعمة بحرية طازجة.", hours:"11ص - 11م", verified:true, featured:false, lat:12.7855, lng:45.0187},
    {id:17, name:"مقهى الشلال", cat:"مقاهي", city:"عدن", phone:"773345678", whatsapp:"773345678", addr:"كريتر، عدن", rating:4.6, reviews:234, desc:"أجمل مقهى في عدن. إطلالة على البحر.", hours:"7ص - 12م", verified:true, featured:true, lat:12.7855, lng:45.0187},
    {id:18, name:"فندق عدن", cat:"فنادق", city:"عدن", phone:"773456789", whatsapp:"773456789", addr:"المنصورة، عدن", rating:4.0, reviews:67, desc:"فندق بإطلالة بحرية رائعة.", hours:"24 ساعة", verified:true, featured:false, lat:12.7955, lng:45.0387},
    {id:19, name:"سوق الميناء", cat:"تسوق", city:"عدن", phone:"773567890", whatsapp:"", addr:"المنصورة، عدن", rating:4.2, reviews:123, desc:"أكبر سوق تجاري في عدن.", hours:"8ص - 10م", verified:true, featured:false, lat:12.7955, lng:45.0387},
    // تعز
    {id:20, name:"مطعم باب اليمن", cat:"مطاعم", city:"تعز", phone:"771123456", whatsapp:"771123456", addr:"شارع جمال، تعز", rating:4.3, reviews:134, desc:"مطعم شعبي بأجواء تقليدية.", hours:"7ص - 11م", verified:true, featured:false, lat:13.5789, lng:44.0219},
    {id:21, name:"مقهى القلعة", cat:"مقاهي", city:"تعز", phone:"771234567", whatsapp:"771234567", addr:"قلعة القاهرة، تعز", rating:4.5, reviews:98, desc:"مقهى بإطلالة على قلعة القاهرة التاريخية.", hours:"8ص - 12م", verified:false, featured:true, lat:13.5789, lng:44.0219},
    {id:22, name:"فندق تعز", cat:"فنادق", city:"تعز", phone:"771345678", whatsapp:"771345678", addr:"وسط مدينة تعز", rating:3.9, reviews:45, desc:"فندق مريح في قلب تعز.", hours:"24 ساعة", verified:true, featured:false, lat:13.5789, lng:44.0219},
    // الحديدة
    {id:23, name:"مطعم الساحل", cat:"مطاعم", city:"الحديدة", phone:"771456789", whatsapp:"771456789", addr:"شارع الشواري، الحديدة", rating:4.1, reviews:87, desc:"أطعم سمك طازج على ساحل البحر الأحمر.", hours:"11ص - 10م", verified:true, featured:false, lat:14.7979, lng:42.9537},
    {id:24, name:"فندق الحديدة", cat:"فنادق", city:"الحديدة", phone:"771567890", whatsapp:"771567890", addr:"كورنيش الحديدة", rating:3.8, reviews:34, desc:"فندق على الكورنيش.", hours:"24 ساعة", verified:true, featured:false, lat:14.7979, lng:42.9537},
    // حضرموت
    {id:25, name:"مطعم حضرموت", cat:"مطاعم", city:"حضرموت", phone:"772123456", whatsapp:"772123456", addr:"المكلا، حضرموت", rating:4.8, reviews:312, desc:"أشهر مطعم حضرمي. مندي وبنت سلم على الفحم.", hours:"10ص - 11م", verified:true, featured:true, lat:14.5392, lng:49.1261},
    {id:26, name:"فندق المكلا", cat:"فنادق", city:"حضرموت", phone:"772234567", whatsapp:"772234567", addr:"كورنيش المكلا", rating:4.4, reviews:78, desc:"فندق فاخر على كورنيش المكلا.", hours:"24 ساعة", verified:true, featured:true, lat:14.5392, lng:49.1261},
    {id:27, name:"مقهى الكورنيش", cat:"مقاهي", city:"حضرموت", phone:"772345678", whatsapp:"772345678", addr:"كورنيش المكلا", rating:4.3, reviews:145, desc:"مقهى بإطلالة بحرية خلابة.", hours:"6ص - 12م", verified:true, featured:false, lat:14.5392, lng:49.1261},
    // سقطرى
    {id:28, name:"فندق سقطرى بيتش", cat:"فنادق", city:"سقطرى", phone:"772456789", whatsapp:"772456789", addr:"حديبو، سقطرى", rating:4.9, reviews:56, desc:"فندق فاخر على شاطئ الجزيرة. إطلالة خلابة.", hours:"24 ساعة", verified:true, featured:true, lat:12.4634, lng:53.8238},
    // مأرب
    {id:29, name:"مطعم مأرب", cat:"مطاعم", city:"مأرب", phone:"771678901", whatsapp:"771678901", addr:"وسط مدينة مأرب", rating:4.2, reviews:67, desc:"مطعم تقليدي في مدينة مأرب التاريخية.", hours:"7ص - 10م", verified:true, featured:false, lat:15.4684, lng:45.3268},
    {id:30, name:"مكتبة المعرفة", cat:"مكتبات", city:"مأرب", phone:"771789012", whatsapp:"771789012", addr:"وسط مدينة مأرب", rating:4.4, reviews:34, desc:"أكبر مكتبة في مأرب.", hours:"8ص - 9م", verified:false, featured:false, lat:15.4684, lng:45.3268},
    // ذمار
    {id:31, name:"معرض السيارات الحديث", cat:"سيارات", city:"ذمار", phone:"771890123", whatsapp:"771890123", addr:"شارع 26 سبتمبر، ذمار", rating:4.1, reviews:56, desc:"أكبر معرض سيارات في ذمار.", hours:"8ص - 8م", verified:true, featured:false, lat:14.5424, lng:44.4047},
    // إب
    {id:32, name:"مطعم الجبل الأخضر", cat:"مطاعم", city:"إب", phone:"771901234", whatsapp:"771901234", addr:"وسط مدينة إب", rating:4.4, reviews:89, desc:"مطعم بإطلالة جبلية خلابة.", hours:"7ص - 11م", verified:true, featured:false, lat:13.9667, lng:44.1667},
    // عمران
    {id:33, name:"مطعم القلعة", cat:"مطاعم", city:"عمران", phone:"772012345", whatsapp:"772012345", addr:"وسط مدينة عمران", rating:4.2, reviews:45, desc:"مطعم تقليدي بأجواء عمرانية.", hours:"8ص - 10م", verified:false, featured:false, lat:15.6594, lng:43.9439},
    // صعدة
    {id:34, name:"مطعم صعدة", cat:"مطاعم", city:"صعدة", phone:"772123450", whatsapp:"772123450", addr:"وسط مدينة صعدة", rating:4.0, reviews:34, desc:"مطعم شعبي في صعدة.", hours:"7ص - 10م", verified:false, featured:false, lat:16.94, lng:43.7639}
];
