// =======================================
// PRINT & CRAFT DASHBOARD
// =======================================

const productKey = "products";
const orderKey = "orders";

let products = JSON.parse(localStorage.getItem(productKey)) || [];
let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

// Dashboard Elements
const totalProducts = document.getElementById("totalProducts");
const lowStock = document.getElementById("lowStock");
const todaySales = document.getElementById("todaySales");
const pendingOrders = document.getElementById("pendingOrders");
const recentOrders = document.getElementById("recentOrders");

// ===============================
// LOAD DASHBOARD
// ===============================

loadDashboard();

function loadDashboard(){

    loadProductCount();

    loadLowStock();

    loadPendingOrders();

    loadTodaySales();

    loadRecentOrders();

}

// ===============================
// TOTAL PRODUCTS
// ===============================

function loadProductCount(){

    if(!totalProducts) return;

    totalProducts.textContent = products.length;

}

// ===============================
// LOW STOCK
// ===============================

function loadLowStock(){

    if(!lowStock) return;

    let total = 0;

    products.forEach(product=>{

        if(product.stock <= product.lowStock){

            total++;

        }

    });

    lowStock.textContent = total;

}

// ===============================
// PENDING ORDERS
// ===============================

function loadPendingOrders(){

    if(!pendingOrders) return;

    let total = 0;

    orders.forEach(order=>{

        if(order.status=="Pending"){

            total++;

        }

    });

    pendingOrders.textContent = total;

}
// ===============================
// TODAY'S SALES
// ===============================

function loadTodaySales(){

    if(!todaySales) return;

    let total = 0;

    const today = new Date().toISOString().split("T")[0];

    orders.forEach(order=>{

        if(order.date === today){

            total += Number(order.total);

        }

    });

    todaySales.textContent =
    "₱" + total.toLocaleString(undefined,{
        minimumFractionDigits:2
    });

}

// ===============================
// RECENT ORDERS
// ===============================

function loadRecentOrders(){

    if(!recentOrders) return;

    if(orders.length==0){

        recentOrders.innerHTML=`

        <tr>

            <td colspan="6" class="empty">

                No Orders Yet

            </td>

        </tr>

        `;

        return;

    }

    recentOrders.innerHTML="";

    const latest =
    [...orders].reverse().slice(0,5);

    latest.forEach(order=>{

        recentOrders.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${order.customer}</td>

<td>${order.platform}</td>

<td>${order.product}</td>

<td>₱${Number(order.total).toLocaleString()}</td>

<td>

<span class="status ${order.status=="Pending" ? "low-stock" : "in-stock"}">

${order.status}

</span>

</td>

</tr>

`;

    });

}

// ===============================
// AUTO REFRESH
// ===============================

window.addEventListener("storage",()=>{

    products =
    JSON.parse(localStorage.getItem(productKey)) || [];

    orders =
    JSON.parse(localStorage.getItem(orderKey)) || [];

    loadDashboard();

});

// ===============================
// REFRESH WHEN PAGE OPENS
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

});

console.log("Dashboard Loaded Successfully");