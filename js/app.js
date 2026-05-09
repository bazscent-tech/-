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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hide');
        document.getElementById('app').style.display = 'block';
        setTimeout(() => document.getElementById('splash').remove(), 500);
        initApp();
    }, 2000);
});

function initApp() {
    renderStats();
    renderCategoriesScroll();
    renderCitiesScroll();
    renderFeaturedPlaces();
    renderLatestPlaces();
    renderCategoriesGrid();
    renderCitiesGrid();
    updateBadges();
    initSlider();
    initSearch();
}

// ===== SLIDER =====
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });
    sliderInterval = setInterval(() => goToSlide((sliderIndex + 1) % slides.length), 4000);
}

function goToSlide(index) {
    sliderIndex = index;
    document.getElementById('slider').style.transform = `translateX(${index * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

// ===== SEARCH =====
function initSearch() {
    const input = document.getElementById('searchInput');
    const clear = document.getElementById('searchClear');
    input.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        clear.style.display = q ? 'block' : 'none';
        if (q.length >= 2) {
            searchPlaces(q);
        }
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
                    <div class="place-card-name">${p.name}</div>
                    <span class="place-card-cat" style="background:${color}15;color:${color}">${p.cat}</span>
                    <div class="place-card-loc"><i class="fas fa-map-marker-alt"></i> ${p.city} - ${p.addr}</div>
                    <div class="place-card-rating">
                        ${getStars(p.rating)} <span>${p.rating}</span> <small>(${p.reviews})</small>
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
}

function showCategories() {
    showPage('categories');
    document.querySelectorAll('.nav-item')[1].classList.add('active');
}

function showCities() {
    showPage('cities');
    document.querySelectorAll('.nav-item')[3].classList.add('active');
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
    // Populate selects
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
    document.getElementById('detailContent').innerHTML = `
        <h2 class="detail-title">${p.name}</h2>
        <span class="detail-cat" style="background:${color}15;color:${color}">${p.cat}</span>
        ${p.verified ? '<span class="detail-cat" style="background:#e8f5e9;color:#2e7d32"><i class="fas fa-check-circle"></i> موثق</span>' : ''}
        <p class="detail-desc">${p.desc}</p>
        <div class="detail-rating">
            <div class="detail-rating-stars">${getStars(p.rating)}</div>
            <span class="detail-rating-num">${p.rating}</span>
            <span class="detail-rating-count">(${p.reviews} تقييم)</span>
        </div>
        <div class="detail-info">
            <div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e8f5e9;color:#2e7d32"><i class="fas fa-phone"></i></div>
                <div class="detail-info-text"><small>رقم الهاتف</small><b>${p.phone}</b></div>
            </div>
            ${p.whatsapp ? `<div class="detail-info-item">
                <div class="detail-info-icon" style="background:#e8f5e9;color:#25d366"><i class="fab fa-whatsapp"></i></div>
                <div class="detail-info-text"><small>واتساب</small><b>${p.whatsapp}</b></div>
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

// ===== ADD PLACE =====
function submitNewPlace(e) {
    e.preventDefault();
    const newPlace = {
        id: Date.now(),
        name: document.getElementById('addName').value,
        cat: document.getElementById('addCategory').value,
        city: document.getElementById('addCity').value,
        phone: document.getElementById('addPhone').value,
        whatsapp: document.getElementById('addWhatsapp').value || '',
        addr: document.getElementById('addAddress').value,
        rating: 0,
        reviews: 0,
        desc: document.getElementById('addDesc').value || 'مكان جديد',
        hours: 'غير محدد',
        verified: false,
        featured: false,
        lat: 0,
        lng: 0
    };
    myPlaces.push(newPlace);
    localStorage.setItem('yd_my_places', JSON.stringify(myPlaces));
    document.getElementById('addForm').reset();
    showToast('تم إضافة المكان بنجاح! ✅');
    renderStats();
    renderCategoriesGrid();
    renderCitiesGrid();
    showHome();
}

// ===== HELPERS =====
function getStars(r) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= Math.floor(r) ? '<i class="fas fa-star">' : i - 0.5 <= r ? '<i class="fas fa-star-half-alt">' : '<i class="far fa-star">';
    return s;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
