let itemsPerPage = 4;
let currentPage = 1;
let products = [];
let cart = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products, page = 1) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    paginatedItems.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productDiv);
    });

    displayPagination(products.length, page);
}

function displayPagination(totalItems, page) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Prev';
    prevButton.disabled = page === 1;
    prevButton.onclick = () => displayProducts(products, page - 1);
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => displayProducts(products, i);
        if (i === page) {
            pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = page === totalPages;
    nextButton.onclick = () => displayProducts(products, page + 1);
    paginationContainer.appendChild(nextButton);
}

function addToCart(productId) {
    const product = products.find(product => product.id === productId);
    cart.push(product);
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    const cartItems = cart.map(item => `
        <div class="cart-item">
            <p>${item.title}</p>
            <p>$${item.price}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);
    const totalQuantity = cart.length;

    cartContainer.innerHTML = `
        ${cartItems}
        <h3>Total Quantity: ${totalQuantity}</h3>
        <h3>Total Price: $${totalPrice}</h3>
    `;
}

function removeFromCart(productId) {
    cart = cart.filter(product => product.id !== productId);
    displayCart();
}

function Filters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categorySelect = document.getElementById('categorySelect').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchInput);
        const matchesCategory = categorySelect === 'all' || product.category === categorySelect;
        const matchesPrice = (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
        return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts, 1);
}

function populateCategories(products) {
    const categories = [...new Set(products.map(product => product.category))];
    const categorySelect = document.getElementById('categorySelect');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categorySelect.appendChild(option);
    });
}

async function init() {
    products = await fetchProducts();
    populateCategories(products);
    displayProducts(products, currentPage);
}

init();
