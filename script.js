let cryptoData = [];

// Ma'lumotlarni API'dan olish funksiyasi
async function fetchCryptoPrices() {
    const grid = document.getElementById('crypto-grid');
    grid.innerHTML = '<div class="loading-text">Yangi kurslar yuklanmoqda...</div>';

    try {
        // CoinGecko ochiq API xizmati
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false');
        
        if (!response.ok) throw new Error("API ulanishida xatolik yuz berdi");
        
        cryptoData = await response.json();
        renderCryptoCards(cryptoData);

    } catch (error) {
        grid.innerHTML = `<div class="loading-text" style="color: #ef4444;">Xatolik: Ma'lumotlarni olib bo'lmadi. Birozdan so'ng qayta urining.</div>`;
    }
}

// Kartalarni ekranga chiqarish
function renderCryptoCards(data) {
    const grid = document.getElementById('crypto-grid');
    grid.innerHTML = '';

    if(data.length === 0) {
        grid.innerHTML = '<div class="loading-text">Hech narsa topilmadi.</div>';
        return;
    }

    data.forEach(coin => {
        const priceChange = coin.price_change_percentage_24h;
        const isUp = priceChange >= 0;
        
        const card = document.createElement('div');
        card.className = 'crypto-card';
        
        card.innerHTML = `
            <div class="coin-info">
                <img src="${coin.image}" alt="${coin.name}">
                <h3>${coin.name}</h3>
                <span class="symbol">${coin.symbol}</span>
            </div>
            <div class="price-row">
                $${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div class="change-row ${isUp ? 'change-up' : 'change-down'}">
                ${isUp ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)}% (24s)
            </div>
        `;
        grid.appendChild(card);
    });
}

// Qidiruv tizimi logikasi
document.getElementById('search-crypto').addEventListener('input', (e) => {
    const searchWord = e.target.value.toLowerCase().trim();
    const filteredCoins = cryptoData.filter(coin => 
        coin.name.toLowerCase().includes(searchWord) || 
        coin.symbol.toLowerCase().includes(searchWord)
    );
    renderCryptoCards(filteredCoins);
});

// Yangilash tugmasi
document.getElementById('refresh-btn').addEventListener('click', fetchCryptoPrices);

// Dastur ishga tushganda avtomatik yuklash
window.addEventListener('DOMContentLoaded', fetchCryptoPrices);