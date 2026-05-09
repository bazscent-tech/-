// ===== دليل Yemen - Application Engine =====

// State
let currentPage = 'home';
let pageHistory = [];
let favorites = JSON.parse(localStorage.getItem('yd_favorites') || '[]');
let myPlaces = JSON.parse(localStorage.getItem('yd_my_places') || '[]');
let currentFilter = { city: null, cat: null };
let currentDetailId = null;
let sliderIndex = 0;
let sliderInterval = null;

// Admin data
let adminAds = JSON.parse(localStorage.getItem('admin_ads') || '[]');
let adminOffers = JSON.parse(localStorage.getItem('admin_offers') || '[]');
let adminJobs = JSON.parse(localStorage.getItem('admin_jobs') || '[]');
let adminCourses = JSON.parse(localStorage.getItem('admin_courses') || '[]');
let adminPending = JSON.parse(localStorage.getItem('admin_pending') || '[]');
let adminApproved = JSON.parse(localStorage.getItem('admin_approved') || '[]');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hide');
        document.getElementById('app').style.display = 'block';
        setTimeout(() => document.getElementById('splash').remove(), 500);
        applyPlaceOverrides();
        initApp();
    }, 2000);
});

// Apply admin overrides to PLACES array
function applyPlaceOverrides() {
    const overrides = JSON.parse(localStorage.getItem('yd_place_overrides') || '{}');
    for (const [id, updates] of Object.entries(overrides)) {
        const place = PLACES.find(p => p.id === parseInt(id));
        if (place) {
            Object.assign(place, updates);
        }
    }
}

function initApp() {
    renderStats();
    renderCategoriesScroll();
    renderFeaturedPlaces();
    renderLatestPlaces();
    renderCategoriesGrid();
    renderCitiesGrid();
    updateBadges();
    initSlider();
    initSearch();
    renderDynamicSections();
    renderContentPages();
    loadProfileImage();
}

// ===== SLIDER (with Admin Ads) =====
function initSlider() {
    const slider = document.getElementById('slider');
    const dotsContainer = document.getElementById('sliderDots');

    // Build slides: default slides + admin ads
    let slidesHTML = `
        <div class="slide" style="background:linear-gradient(135deg,#1a73e8,#0d47a1)">
            <div class="slide-content">
                <h2>🇾🇪 أهلاً بكم في دليل اليمن</h2>
                <p>اكتشف أفضل الأماكن والخدمات في جميع المحافظات</p>
            </div>
        </div>
        <div class="slide" style="background:linear-gradient(135deg,#34a853,#1b5e20)">
            <div class="slide-content">
                <h2>📍 أكثر من 500 مكان مسجل</h2>
                <p>مطاعم، فنادق، مقاهي، صيدليات والمزيد</p>
            </div>
        </div>
        <div class="slide" style="background:linear-gradient(135deg,#ea4335,#b71c1c)">
            <div class="slide-content">
                <h2>📞 اتصل مباشرة</h2>
                <p>تواصل مع التجار والخدمات بضغطة زر</p>
            </div>
        </div>`;

    // Add admin ads as slides
    const activeAds = adminAds.filter(a => a.active);
    activeAds.forEach(ad => {
        const linkAttr = ad.link ? `onclick="window.open('${ad.link}','_blank')" style="cursor:pointer"` : '';
        slidesHTML += `
        <div class="slide ad-slide" ${linkAttr}>
            <img src="${ad.image}" alt="${ad.title}" class="ad-slide-img">
            <div class="ad-slide-overlay">
                <h2>${ad.title}</h2>
                ${ad.link ? '<p>اضغط للمزيد ←</p>' : ''}
            </div>
        </div>`;
    });

    slider.innerHTML = slidesHTML;

    // Build dots
    const totalSlides = slider.querySelectorAll('.slide').length;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    sliderIndex = 0;
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => goToSlide((sliderIndex + 1) % totalSlides), 4000);
}

function goToSlide(index) {
    sliderIndex = index;
    const slider = document.getElementById('slider');
    const slides = slider.querySelectorAll('.slide');
    if (index >= slides.length) index = 0;
    slider.style.transform = `translateX(${index * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

// ===== SEARCH =====
function initSearch() {
    const input = document.getElementById('searchInput');
    const clear = document.getElementById('searchClear');
    input.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        clear.style.display = q ? 'block' : 'none';
        if (q.length >= 2) searchPlaces(q);
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').style.display = 'none';
    showHome();
}

function searchPlaces(query) {
    const q = query.toLowerCase();
    const results = PLACES.filter(p =>
        p.name.includes(q) || p.cat.includes(q) || p.city.includes(q) ||
        p.desc.includes(q) || p.addr.includes(q) || p.phone.includes(q)
    );
    showPage('places');
    document.getElementById('placesTitle').textContent = `نتائج البحث: ${query}`;
    document.getElementById('placesFilter').innerHTML = '';
    renderPlacesList('placesList', results);
}

// ===== RENDER =====
function renderStats() {
    document.getElementById('totalPlaces').textContent = PLACES.length + myPlaces.length;
}

function renderCategoriesScroll() {
    const container = document.getElementById('categoriesScroll');
    container.innerHTML = CATEGORIES.map(c => `
        <div class="cat-chip" onclick="showCategoryPlaces(${c.id})">
            <div class="cat-chip-icon" style="background:${c.color}"><i class="fas ${c.icon}"></i></div>
            <span class="cat-chip-name">${c.name}</span>
        </div>
    `).join('');
}

function renderCitiesScroll() {
    const container = document.getElementById('citiesScroll');
    if (!container) return;
    container.innerHTML = CITIES.slice(0, 10).map(c => `
        <div class="city-chip" onclick="showCityPlaces(${c.id})">${c.icon} ${c.name}</div>
    `).join('');
}

function renderFeaturedPlaces() {
    const featured = [...PLACES, ...myPlaces].filter(p => p.featured).slice(0, 6);
    renderPlacesList('featuredPlaces', featured);
}

function renderLatestPlaces() {
    const latest = [...PLACES, ...myPlaces].slice(-6).reverse();
    renderPlacesList('latestPlaces', latest);
}

function renderCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = CATEGORIES.map(c => {
        const count = [...PLACES, ...myPlaces].filter(p => p.cat === c.name).length;
        return `<div class="cat-card" onclick="showCategoryPlaces(${c.id})">
            <div class="cat-card-icon" style="background:${c.color}"><i class="fas ${c.icon}"></i></div>
            <div class="cat-card-name">${c.name}</div>
            <div class="cat-card-count">${count} مكان</div>
        </div>`;
    }).join('');
}

function renderCitiesGrid() {
    const grid = document.getElementById('citiesGrid');
    grid.innerHTML = CITIES.map(c => {
        const count = [...PLACES, ...myPlaces].filter(p => p.city === c.name).length;
        return `<div class="city-card" onclick="showCityPlaces(${c.id})">
            <div class="city-card-icon">${c.icon}</div>
            <div class="city-card-info">
                <h4>${c.name}</h4>
                <p>${count} مكان • ${c.region}</p>
            </div>
        </div>`;
    }).join('');
}

// ===== DYNAMIC SECTIONS (Offers, Jobs, Courses) =====
function renderDynamicSections() {
    renderContentScroll('offers', adminOffers, 'offersScroll', 'section-offers');
    renderContentScroll('jobs', adminJobs, 'jobsScroll', 'section-jobs');
    renderContentScroll('courses', adminCourses, 'coursesScroll', 'section-courses');
}

function renderContentScroll(type, items, containerId, sectionId) {
    const section = document.getElementById(sectionId);
    const container = document.getElementById(containerId);
    if (!section || !container) return;

    const activeItems = items.filter(i => i.active);
    if (!activeItems.length) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';

    container.innerHTML = activeItems.slice(0, 6).map(item => `
        <div class="content-card" onclick="showContentDetail('${type}', ${item.id})">
            ${item.image ? `<div class="content-card-img"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>` : `<div class="content-card-img content-card-placeholder"><i class="fas ${type === 'offers' ? 'fa-tag' : type === 'jobs' ? 'fa-briefcase' : 'fa-graduation-cap'}"></i></div>`}
            <div class="content-card-info">
                <h4>${item.title}</h4>
                ${item.city ? `<p><i class="fas fa-map-marker-alt"></i> ${item.city}</p>` : ''}
                ${item.phone ? `<p><i class="fas fa-phone"></i> ${item.phone}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderContentPages() {
    renderContentPageList('offers', adminOffers, 'offersPageList', 'emptyOffers');
    renderContentPageList('jobs', adminJobs, 'jobsPageList', 'emptyJobs');
    renderContentPageList('courses', adminCourses, 'coursesPageList', 'emptyCourses');
}

function renderContentPageList(type, items, listId, emptyId) {
    const list = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    if (!list) return;

    const activeItems = items.filter(i => i.active);
    if (!activeItems.length) {
        list.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    list.innerHTML = activeItems.map(item => `
        <div class="content-full-card" onclick="showContentDetail('${type}', ${item.id})">
            ${item.image ? `<div class="content-full-img"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>` : ''}
            <div class="content-full-info">
                <h3>${item.title}</h3>
                ${item.desc ? `<p class="content-full-desc">${item.desc}</p>` : ''}
                <div class="content-full-meta">
                    ${item.city ? `<span><i class="fas fa-map-marker-alt"></i> ${item.city}</span>` : ''}
                    ${item.category ? `<span><i class="fas fa-tag"></i> ${item.category}</span>` : ''}
                    ${item.phone ? `<span><i class="fas fa-phone"></i> ${item.phone}</span>` : ''}
                </div>
                ${item.link ? `<a href="${item.link}" target="_blank" class="content-full-link"><i class="fas fa-external-link-alt"></i> زيارة الرابط</a>` : ''}
                ${item.phone ? `<a href="tel:${item.phone}" class="content-full-call"><i class="fas fa-phone"></i> اتصال</a>` : ''}
            </div>
        </div>
    `).join('');
}

function showContentPage(type) {
    showPage(type);
}

function showContentDetail(type, id) {
    const storeMap = { offers: adminOffers, jobs: adminJobs, courses: adminCourses };
    const item = (storeMap[type] || []).find(i => i.id === id);
    if (!item) return;

    // Show in a simple detail view using the detail page
    showPage('detail');
    document.getElementById('detailHeader').style.background = `linear-gradient(135deg,#1565c0,#0d47a1)`;
    document.getElementById('detailHeader').innerHTML = `
        <button class="back-btn white" onclick="goBack()"><i class="fas fa-arrow-right"></i></button>
        <div class="detail-header-actions">
            ${item.link ? `<a href="${item.link}" target="_blank" class="icon-btn white"><i class="fas fa-external-link-alt"></i></a>` : ''}
        </div>`;

    const typeLabel = type === 'offers' ? 'عرض' : type === 'jobs' ? 'وظيفة' : 'دورة';
    const typeIcon = type === 'offers' ? 'fa-tag' : type === 'jobs' ? 'fa-briefcase' : 'fa-graduation-cap';

    document.getElementById('detailContent').innerHTML = `
        <h2 class="detail-title">${item.title}</h2>
        <span class="detail-cat" style="background:#e3f2fd;color:#1565c0"><i class="fas ${typeIcon}"></i> ${typeLabel}</span>
        ${item.category ? `<span class="detail-cat" style="background:#f3e5f5;color:#7b1fa2">${item.category}</span>` : ''}
        ${item.desc ? `<p class="detail-desc">${item.desc}</p>` : ''}
        ${item.image ? `<div style="margin-bottom:20px;border-radius:12px;overflow:hidden"><img src="${item.image}" style="width:100%;max-height:300px;object-fit:cover" alt="${item.title}"></div>` : ''}
        <div class="detail-info">
            ${item.city ? `<div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e3f2fd;color:#1565c0"><i class="fas fa-map-marker-alt"></i></div>
                <div class="detail-info-text"><small>المدينة</small><b>${item.city}</b></div>
            </div>` : ''}
            ${item.phone ? `<div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e8f5e9;color:#2e7d32"><i class="fas fa-phone"></i></div>
                <div class="detail-info-text"><small>رقم التواصل</small><b>${item.phone}</b></div>
                <a href="tel:${item.phone}" class="detail-info-action"><i class="fas fa-phone"></i></a>
            </div>` : ''}
        </div>
        <div class="detail-buttons">
            ${item.phone ? `<a href="tel:${item.phone}" class="detail-btn call"><i class="fas fa-phone"></i> اتصال</a>` : ''}
            ${item.link ? `<a href="${item.link}" target="_blank" class="detail-btn whatsapp" style="background:#e3f2fd;color:#1565c0"><i class="fas fa-external-link-alt"></i> زيارة</a>` : ''}
            <button class="detail-btn share" onclick="shareContent('${type}',${id})"><i class="fas fa-share-alt"></i> مشاركة</button>
        </div>`;
}

function shareContent(type, id) {
    const storeMap = { offers: adminOffers, jobs: adminJobs, courses: adminCourses };
    const item = (storeMap[type] || []).find(i => i.id === id);
    if (!item) return;
    const typeLabel = type === 'offers' ? 'عرض' : type === 'jobs' ? 'وظيفة' : 'دورة';
    const text = `🏷️ ${typeLabel}: ${item.title}\n${item.desc || ''}\n${item.phone ? '📞 ' + item.phone : ''}\n${item.link || ''}`;
    if (navigator.share) {
        navigator.share({ title: item.title, text, url: location.href });
    } else {
        navigator.clipboard.writeText(text).then(() => showToast('تم نسخ المعلومات 📋'));
    }
}

// ===== PLACES LIST =====
function renderPlacesList(containerId, places) {
    const container = document.getElementById(containerId);
    if (!places.length) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>لا توجد نتائج</h3><p>جرب البحث بكلمات مختلفة</p></div>';
        return;
    }
    container.innerHTML = places.map(p => {
        const isFav = favorites.includes(p.id);
        const cat = CATEGORIES.find(c => c.name === p.cat);
        const color = cat ? cat.color : '#667eea';
        const icon = cat ? cat.icon : 'fa-store';
        return `<div class="place-card" onclick="showPlaceDetail(${p.id})">
            <div class="place-card-top">
                <div class="place-card-img" style="background:linear-gradient(135deg,${color},${color}dd)"><i class="fas ${icon}"></i></div>
                <div class="place-card-info">
                    <div class="place-card-header">
                        <div class="place-card-name">${p.name}</div>
                        ${p.verified ? '<span class="place-card-verified-badge"><i class="fas fa-check-circle"></i> موثق</span>' : ''}
                    </div>
                    <span class="place-card-cat" style="background:${color}15;color:${color}">${p.cat}</span>
                    <div class="place-card-loc"><i class="fas fa-map-marker-alt"></i> ${p.city} - ${p.addr}</div>
                    <div class="place-card-rating">
                        <span class="stars-wrap">${getStars(p.rating)}</span>
                        <span class="rating-num">${p.rating}</span>
                        <small>(${p.reviews})</small>
                    </div>
                </div>
            </div>
            <div class="place-card-actions">
                <a href="tel:${p.phone}" class="place-action call" onclick="event.stopPropagation()"><i class="fas fa-phone"></i> اتصال</a>
                ${p.whatsapp ? `<a href="https://wa.me/967${p.whatsapp}" class="place-action whatsapp" onclick="event.stopPropagation()" target="_blank"><i class="fab fa-whatsapp"></i> واتساب</a>` : ''}
                <button class="place-action share" onclick="event.stopPropagation();sharePlace(${p.id})"><i class="fas fa-share-alt"></i> مشاركة</button>
                <button class="place-action fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation();toggleFav(${p.id})"><i class="fas fa-heart"></i></button>
            </div>
        </div>`;
    }).join('');
}

// ===== NAVIGATION =====
function showPage(page) {
    pageHistory.push(currentPage);
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    window.scrollTo(0, 0);
}

function goBack() {
    const prev = pageHistory.pop() || 'home';
    currentPage = prev;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${prev}`).classList.add('active');
}

function showHome() {
    pageHistory = [];
    currentPage = 'home';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');
    document.querySelectorAll('.nav-item').forEach((n, i) => n.classList.toggle('active', i === 0));
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').style.display = 'none';

    // Refresh dynamic content
    adminAds = JSON.parse(localStorage.getItem('admin_ads') || '[]');
    adminOffers = JSON.parse(localStorage.getItem('admin_offers') || '[]');
    adminJobs = JSON.parse(localStorage.getItem('admin_jobs') || '[]');
    adminCourses = JSON.parse(localStorage.getItem('admin_courses') || '[]');
    initSlider();
    renderDynamicSections();
}

function showCategories() {
    showPage('categories');
    document.querySelectorAll('.nav-item')[1].classList.add('active');
}

function showCities() {
    showPage('cities');
}

function showFavorites() {
    showPage('favorites');
    const favPlaces = [...PLACES, ...myPlaces].filter(p => favorites.includes(p.id));
    renderPlacesList('favoritesList', favPlaces);
    document.getElementById('emptyFavorites').style.display = favPlaces.length ? 'none' : 'block';
}

function showAddPlace() {
    showPage('add');
    document.querySelectorAll('.nav-item')[2].classList.add('active');
    const catSelect = document.getElementById('addCategory');
    const citySelect = document.getElementById('addCity');
    catSelect.innerHTML = '<option value="">اختر التصنيف</option>' + CATEGORIES.map(c => `<option>${c.name}</option>`).join('');
    citySelect.innerHTML = '<option value="">اختر المدينة</option>' + CITIES.map(c => `<option>${c.name}</option>`).join('');
}

function showProfile() {
    showPage('profile');
    document.querySelectorAll('.nav-item')[4].classList.add('active');
    document.getElementById('profileFavCount').textContent = favorites.length;
    document.getElementById('profilePlaceCount').textContent = myPlaces.length;
    loadProfileImage();
}

function showNotifications() { showPage('notifications'); }
function showMenu() { showPage('menu'); }
function showAbout() { showPage('about'); }
function showMyPlaces() {
    showPage('places');
    document.getElementById('placesTitle').textContent = 'أماكني';
    document.getElementById('placesFilter').innerHTML = '';
    renderPlacesList('placesList', myPlaces);
}

function showAllPlaces() {
    showPage('places');
    document.getElementById('placesTitle').textContent = 'جميع الأماكن';
    document.getElementById('placesFilter').innerHTML = '';
    renderPlacesList('placesList', [...PLACES, ...myPlaces]);
}

function showCategoryPlaces(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    showPage('places');
    document.getElementById('placesTitle').textContent = cat.name;
    currentFilter.cat = cat.name;
    const places = [...PLACES, ...myPlaces].filter(p => p.cat === cat.name);
    renderPlacesList('placesList', places);
}

function showCityPlaces(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;
    showPage('places');
    document.getElementById('placesTitle').textContent = city.name;
    currentFilter.city = city.name;
    const places = [...PLACES, ...myPlaces].filter(p => p.city === city.name);
    renderPlacesList('placesList', places);
}

// ===== PLACE DETAIL =====
function showPlaceDetail(id) {
    const p = [...PLACES, ...myPlaces].find(x => x.id === id);
    if (!p) return;
    currentDetailId = id;
    showPage('detail');
    const cat = CATEGORIES.find(c => c.name === p.cat);
    const color = cat ? cat.color : '#667eea';
    const icon = cat ? cat.icon : 'fa-store';
    const isFav = favorites.includes(p.id);

    document.getElementById('detailHeader').style.background = `linear-gradient(135deg,${color},${color}dd)`;
    document.getElementById('detailHeader').innerHTML = `
        <div class="detail-header-bg"><i class="fas ${icon}"></i></div>
        <button class="back-btn white" onclick="goBack()"><i class="fas fa-arrow-right"></i></button>
        <div class="detail-header-actions">
            <button class="icon-btn white" onclick="toggleFavFromDetail()"><i class="fas fa-heart" style="${isFav ? 'color:#ff1744' : ''}"></i></button>
            <button class="icon-btn white" onclick="shareFromDetail()"><i class="fas fa-share-alt"></i></button>
        </div>`;

    // Build social media links HTML
    let socialHTML = '';
    if (p.social) {
        const socials = [];
        if (p.social.facebook) socials.push(`<a href="${p.social.facebook}" target="_blank" class="social-icon facebook"><i class="fab fa-facebook-f"></i></a>`);
        if (p.social.instagram) socials.push(`<a href="${p.social.instagram}" target="_blank" class="social-icon instagram"><i class="fab fa-instagram"></i></a>`);
        if (p.social.twitter) socials.push(`<a href="${p.social.twitter}" target="_blank" class="social-icon twitter"><i class="fab fa-x-twitter"></i></a>`);
        if (p.social.tiktok) socials.push(`<a href="${p.social.tiktok}" target="_blank" class="social-icon tiktok"><i class="fab fa-tiktok"></i></a>`);
        if (p.social.youtube) socials.push(`<a href="${p.social.youtube}" target="_blank" class="social-icon youtube"><i class="fab fa-youtube"></i></a>`);
        if (p.social.website) socials.push(`<a href="${p.social.website}" target="_blank" class="social-icon website"><i class="fas fa-globe"></i></a>`);
        if (socials.length) {
            socialHTML = `<div class="detail-social">${socials.join('')}</div>`;
        }
    }

    // Build phone numbers HTML
    const phones = p.phones || [{ type: 'هاتف', number: p.phone }];
    const phonesHTML = phones.map(ph => `
        <div class="detail-info-item">
            <div class="detail-info-icon" style="background:#e8f5e9;color:#2e7d32"><i class="fas fa-phone"></i></div>
            <div class="detail-info-text"><small>${ph.type || 'هاتف'}</small><b>${ph.number}</b></div>
            <a href="tel:${ph.number}" class="detail-info-action"><i class="fas fa-phone"></i></a>
        </div>
    `).join('');

    // Build images gallery HTML
    let galleryHTML = '';
    if (p.images && p.images.length) {
        galleryHTML = `<div class="detail-gallery">
            <h3><i class="fas fa-images"></i> صور المكان</h3>
            <div class="gallery-scroll">
                ${p.images.map(img => `<div class="gallery-item"><img src="${img}" alt="${p.name}" loading="lazy"></div>`).join('')}
            </div>
        </div>`;
    }

    document.getElementById('detailContent').innerHTML = `
        <h2 class="detail-title">${p.name}</h2>
        <div class="detail-badges">
            <span class="detail-cat" style="background:${color}15;color:${color}">${p.cat}</span>
            ${p.verified ? '<span class="detail-verified"><i class="fas fa-check-circle"></i> موثق</span>' : ''}
        </div>
        <p class="detail-desc">${p.desc}</p>

        <div class="detail-rating">
            <div class="detail-rating-stars">${getStars(p.rating)}</div>
            <span class="detail-rating-num">${p.rating}</span>
            <span class="detail-rating-count">(${p.reviews} تقييم)</span>
        </div>

        ${galleryHTML}

        <div class="detail-info">
            ${phonesHTML}
            ${p.whatsapp ? `<div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e8f5e9;color:#25d366"><i class="fab fa-whatsapp"></i></div>
                <div class="detail-info-text"><small>واتساب</small><b>${p.whatsapp}</b></div>
                <a href="https://wa.me/967${p.whatsapp}" target="_blank" class="detail-info-action whatsapp"><i class="fab fa-whatsapp"></i></a>
            </div>` : ''}
            <div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e3f2fd;color:#1565c0"><i class="fas fa-map-marker-alt"></i></div>
                <div class="detail-info-text"><small>الموقع</small><b>${p.city} - ${p.addr}</b></div>
            </div>
            <div class="detail-info-item">
                <div class="detail-info-icon" style="background:#fff3e0;color:#ef6c00"><i class="fas fa-clock"></i></div>
                <div class="detail-info-text"><small>ساعات العمل</small><b>${p.hours || 'غير محدد'}</b></div>
            </div>
        </div>

        ${socialHTML}

        <div class="detail-buttons">
            <a href="tel:${p.phone}" class="detail-btn call"><i class="fas fa-phone"></i> اتصال</a>
            ${p.whatsapp ? `<a href="https://wa.me/967${p.whatsapp}" class="detail-btn whatsapp" target="_blank"><i class="fab fa-whatsapp"></i> واتساب</a>` : ''}
            <button class="detail-btn share" onclick="sharePlace(${p.id})"><i class="fas fa-share-alt"></i> مشاركة</button>
        </div>`;
}

// ===== FAVORITES =====
function toggleFav(id) {
    const idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast('تمت الإزالة من المفضلة'); }
    else { favorites.push(id); showToast('تمت الإضافة للمفضلة ❤️'); }
    localStorage.setItem('yd_favorites', JSON.stringify(favorites));
    updateBadges();
    renderFeaturedPlaces();
    renderLatestPlaces();
}

function toggleFavFromDetail() {
    if (currentDetailId) toggleFav(currentDetailId);
    showPlaceDetail(currentDetailId);
}

function updateBadges() {
    document.getElementById('favBadge').textContent = favorites.length;
}

// ===== SHARE =====
function sharePlace(id) {
    const p = [...PLACES, ...myPlaces].find(x => x.id === id);
    if (!p) return;
    const text = `📍 ${p.name}\n📞 ${p.phone}\n📍 ${p.city} - ${p.addr}\n⭐ ${p.rating}/5 (${p.reviews} تقييم)\n\n${p.desc}`;
    if (navigator.share) {
        navigator.share({ title: p.name, text, url: location.href });
    } else {
        navigator.clipboard.writeText(text).then(() => showToast('تم نسخ المعلومات 📋'));
    }
}

function shareFromDetail() {
    if (currentDetailId) sharePlace(currentDetailId);
}

// ===== IMAGE UPLOAD =====
function handleImageUpload(input, previewId, callback) {
    const file = input.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) { showToast('نوع الملف غير مدعوم'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('حجم الصورة كبير جداً (max 5MB)'); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxSize = 800;
            let w = img.width, h = img.height;
            if (w > maxSize || h > maxSize) {
                if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                else { w = Math.round(w * maxSize / h); h = maxSize; }
            }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            if (previewId) {
                const preview = document.getElementById(previewId);
                if (preview) {
                    preview.innerHTML = `<img src="${compressed}" alt="preview">`;
                    preview.classList.add('has-image');
                }
            }
            if (callback) callback(compressed);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

let uploadedImages = [];

function handleMultiImageUpload(input) {
    const files = Array.from(input.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    files.forEach(file => {
        if (!validTypes.includes(file.type)) return;
        if (file.size > 5 * 1024 * 1024) return;
        if (uploadedImages.length >= 8) { showToast('الحد الأقصى 8 صور'); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxSize = 800;
                let w = img.width, h = img.height;
                if (w > maxSize || h > maxSize) {
                    if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                    else { w = Math.round(w * maxSize / h); h = maxSize; }
                }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                uploadedImages.push(canvas.toDataURL('image/jpeg', 0.8));
                renderImagePreviews();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreviews() {
    const container = document.getElementById('imagePreviews');
    if (!container) return;
    container.innerHTML = uploadedImages.map((img, i) => `
        <div class="img-preview-item">
            <img src="${img}" alt="preview ${i + 1}">
            <button class="img-preview-remove" onclick="removeUploadedImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function removeUploadedImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreviews();
}

// ===== ADD PLACE (Send to Admin for Review) =====
function submitNewPlace(e) {
    e.preventDefault();

    const phoneEntries = document.querySelectorAll('.phone-entry');
    const phones = [];
    phoneEntries.forEach(entry => {
        const type = entry.querySelector('.phone-type')?.value || 'هاتف';
        const number = entry.querySelector('.phone-number')?.value?.trim();
        if (number) phones.push({ type, number });
    });

    const social = {};
    const fbVal = document.getElementById('addFacebook')?.value?.trim();
    const igVal = document.getElementById('addInstagram')?.value?.trim();
    const twVal = document.getElementById('addTwitter')?.value?.trim();
    const tkVal = document.getElementById('addTiktok')?.value?.trim();
    const ytVal = document.getElementById('addYoutube')?.value?.trim();
    const webVal = document.getElementById('addWebsite')?.value?.trim();
    if (fbVal) social.facebook = fbVal;
    if (igVal) social.instagram = igVal;
    if (twVal) social.twitter = twVal;
    if (tkVal) social.tiktok = tkVal;
    if (ytVal) social.youtube = ytVal;
    if (webVal) social.website = webVal;

    const primaryPhone = phones.length ? phones[0].number : document.getElementById('addPhone')?.value || '';

    const newPlace = {
        id: Date.now(),
        name: document.getElementById('addName').value,
        cat: document.getElementById('addCategory').value,
        city: document.getElementById('addCity').value,
        phone: primaryPhone,
        phones: phones.length ? phones : [{ type: 'هاتف', number: primaryPhone }],
        whatsapp: document.getElementById('addWhatsapp')?.value?.trim() || '',
        addr: document.getElementById('addAddress').value,
        rating: 0,
        reviews: 0,
        desc: document.getElementById('addDesc').value || 'مكان جديد',
        hours: document.getElementById('addHours')?.value || 'غير محدد',
        verified: false,
        featured: false,
        lat: 0,
        lng: 0,
        social: Object.keys(social).length ? social : null,
        images: uploadedImages.length ? [...uploadedImages] : [],
        status: 'pending',
        submittedAt: new Date().toISOString()
    };

    // Send to admin pending queue
    const pending = JSON.parse(localStorage.getItem('admin_pending') || '[]');
    pending.push(newPlace);
    localStorage.setItem('admin_pending', JSON.stringify(pending));

    uploadedImages = [];
    document.getElementById('addForm').reset();
    showToast('تم إرسال طلبك! ⏳ سيتم مراجعته من الإدارة');
    showHome();
}

// Dynamic phone number management
let phoneCounter = 0;

function addPhoneField() {
    phoneCounter++;
    const container = document.getElementById('phoneFields');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'phone-entry';
    div.id = `phone-entry-${phoneCounter}`;
    div.innerHTML = `
        <div class="phone-row">
            <select class="phone-type form-input-sm">
                <option value="هاتف">هاتف</option>
                <option value="جوال">جوال</option>
                <option value="أرضي">أرضي</option>
                <option value="واتساب">واتساب</option>
                <option value="رقم آخر">رقم آخر</option>
            </select>
            <input type="tel" class="phone-number form-input" placeholder="777123456">
            <button type="button" class="btn-remove-phone" onclick="removePhoneField(${phoneCounter})"><i class="fas fa-times"></i></button>
        </div>`;
    container.appendChild(div);
}

function removePhoneField(id) {
    const entry = document.getElementById(`phone-entry-${id}`);
    if (entry) entry.remove();
}

// Profile image upload
function uploadProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = function() {
        handleImageUpload(this, 'profileAvatarPreview', function(dataUrl) {
            localStorage.setItem('yd_profile_image', dataUrl);
            showToast('تم تحديث الصورة الشخصية ✅');
        });
    };
    input.click();
}

function loadProfileImage() {
    const saved = localStorage.getItem('yd_profile_image');
    if (saved) {
        const preview = document.getElementById('profileAvatarPreview');
        if (preview) {
            preview.innerHTML = `<img src="${saved}" alt="profile">`;
            preview.classList.add('has-image');
        }
    }
}

// ===== HELPERS =====
function getStars(r) {
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== POLL FOR ADMIN CHANGES =====
setInterval(() => {
    const newApproved = JSON.parse(localStorage.getItem('admin_approved') || '[]');
    if (JSON.stringify(newApproved) !== JSON.stringify(adminApproved)) {
        adminApproved = newApproved;
        myPlaces = JSON.parse(localStorage.getItem('yd_my_places') || '[]');
        renderFeaturedPlaces();
        renderLatestPlaces();
    }

    // Check for place overrides
    const newOverrides = JSON.parse(localStorage.getItem('yd_place_overrides') || '{}');
    applyPlaceOverrides();

    // Check for new ads/offers/jobs/courses
    const newAds = JSON.parse(localStorage.getItem('admin_ads') || '[]');
    const newOffers = JSON.parse(localStorage.getItem('admin_offers') || '[]');
    const newJobs = JSON.parse(localStorage.getItem('admin_jobs') || '[]');
    const newCourses = JSON.parse(localStorage.getItem('admin_courses') || '[]');

    if (JSON.stringify(newAds) !== JSON.stringify(adminAds)) {
        adminAds = newAds;
        initSlider();
    }
    if (JSON.stringify(newOffers) !== JSON.stringify(adminOffers) ||
        JSON.stringify(newJobs) !== JSON.stringify(adminJobs) ||
        JSON.stringify(newCourses) !== JSON.stringify(adminCourses)) {
        adminOffers = newOffers;
        adminJobs = newJobs;
        adminCourses = newCourses;
        renderDynamicSections();
        renderContentPages();
    }
}, 3000);
