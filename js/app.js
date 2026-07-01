// =========================================
// PRINT & CRAFT MANAGEMENT SYSTEM
// DASHBOARD
// =========================================

const PRODUCT_KEY = "products";
const ORDER_KEY = "orders";

let products = JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];
let orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];

// Dashboard Cards
const todaySales = document.getElementById("todaySales");
const pendingOrders = document.getElementById("pendingOrders");
const totalProducts = document.getElementById("totalProducts");
const lowStock = document.getElementById("lowStock");

// Summary Cards
const summaryProducts = document.getElementById("summaryProducts");
const summaryOrders = document.getElementById("summaryOrders");
const summarySales = document.getElementById("summarySales");
const summaryLowStock = document.getElementById("summaryLowStock");

// Recent Orders
const recentOrders = document.getElementById("recentOrders");

// =========================================
// LOAD DASHBOARD
// =========================================

function loadDashboard(){

    products =
    JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];

    orders =
    JSON.parse(localStorage.getItem(ORDER_KEY)) || [];

    updateCards();

    updateSummary();

    loadRecentOrders();

}

document.addEventListener("DOMContentLoaded",loadDashboard);

// =========================================
// UPDATE CARDS
// =========================================

function updateCards(){

    if(totalProducts){

        totalProducts.textContent = products.length;

    }

    if(summaryProducts){

        summaryProducts.textContent = products.length;

    }

    let low = products.filter(product=>

        product.stock <= product.lowStock

    ).length;

    if(lowStock){

        lowStock.textContent = low;

    }

    if(summaryLowStock){

        summaryLowStock.textContent = low;

    }

    let pending = orders.filter(order=>

        order.status=="Pending"

    ).length;

    if(pendingOrders){

        pendingOrders.textContent = pending;

    }

    let today = new Date().toISOString().split("T")[0];

    let todayTotal = 0;

    orders.forEach(order=>{

        if(order.date==today){

            todayTotal += Number(order.total);

        }

    });

    if(todaySales){

        todaySales.textContent =
        "₱" + todayTotal.toFixed(2);

    }

}
// =========================================
// UPDATE SUMMARY
// =========================================

function updateSummary(){

    if(summaryOrders){

        summaryOrders.textContent = orders.length;

    }

    let totalSales = 0;

    orders.forEach(order=>{

        if(order.status !== "Cancelled"){

            totalSales += Number(order.total);

        }

    });

    if(summarySales){

        summarySales.textContent =
        "₱" + totalSales.toLocaleString(undefined,{
            minimumFractionDigits:2,
            maximumFractionDigits:2
        });

    }

}

// =========================================
// RECENT ORDERS
// =========================================

function loadRecentOrders(){

    if(!recentOrders) return;

    recentOrders.innerHTML = "";

    if(orders.length === 0){

        recentOrders.innerHTML = `

<tr>

<td colspan="6" class="empty">

No Orders Yet

</td>

</tr>

`;

        return;

    }

    const latestOrders =
    [...orders]
    .sort((a,b)=>new Date(b.date)-new Date(a.date))
    .slice(0,5);

    latestOrders.forEach(order=>{

        let badge = "completed";

        if(order.status==="Pending"){

            badge="pending";

        }

        if(order.status==="Cancelled"){

            badge="cancelled";

        }

        recentOrders.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${order.customer}</td>

<td>${order.platform}</td>

<td>${order.product}</td>

<td>₱${Number(order.total).toLocaleString()}</td>

<td>

<span class="${badge}">

${order.status}

</span>

</td>

</tr>

`;

    });

}

// =========================================
// AUTO REFRESH
// =========================================

window.addEventListener("storage",()=>{

    loadDashboard();

});

// Refresh every second so Dashboard
// updates after adding Orders/Products

setInterval(loadDashboard,1000);

console.log("Dashboard Loaded");