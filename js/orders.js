// ==========================================
// PRINT & CRAFT MANAGEMENT SYSTEM
// ORDERS
// ==========================================

const ORDER_KEY = "orders";
const PRODUCT_KEY = "products";

let orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
let products = JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];

let editIndex = -1;

// ==============================
// ELEMENTS
// ==============================

const table = document.getElementById("ordersTable");

const customer = document.getElementById("customerName");
const platform = document.getElementById("platform");
const product = document.getElementById("productSelect");
const quantity = document.getElementById("quantity");
const total = document.getElementById("total");
const status = document.getElementById("status");
const orderDate = document.getElementById("orderDate");
const notes = document.getElementById("notes");

const btnSave = document.getElementById("saveOrder");

const search = document.getElementById("searchOrder");
const filter = document.getElementById("statusFilter");

const modal = new bootstrap.Modal(
document.getElementById("orderModal")
);

// ==============================
// INITIALIZE
// ==============================

loadProducts();

renderOrders();

if(orderDate){

    orderDate.value =
    new Date().toISOString().split("T")[0];

}

// ==============================
// LOAD PRODUCTS
// ==============================

function loadProducts(){

    if(!product) return;

    product.innerHTML="";

    if(products.length==0){

        product.innerHTML=

        `<option>No Products Available</option>`;

        return;

    }

    products.forEach(item=>{

        product.innerHTML+=`

<option value="${item.name}">

${item.name}

</option>

`;

    });

}

// ==============================
// RENDER ORDERS
// ==============================

function renderOrders(){

    if(!table) return;

    table.innerHTML="";

    let keyword =
    search.value.toLowerCase();

    let statusFilter =
    filter.value;

    let filtered =

    orders.filter(order=>{

        let searchMatch =

        order.customer
        .toLowerCase()
        .includes(keyword);

        let statusMatch =

        statusFilter==""
        ||

        order.status==statusFilter;

        return searchMatch && statusMatch;

    });

    if(filtered.length==0){

        table.innerHTML=

        `

<tr>

<td colspan="8"

class="empty">

No Orders Found

</td>

</tr>

`;

        return;

    }

    filtered.forEach((order,index)=>{

        table.innerHTML+=`

<tr>

<td>${order.id}</td>

<td>${order.customer}</td>

<td>${order.platform}</td>

<td>${order.product}</td>

<td>${order.quantity}</td>

<td>₱${order.total}</td>

<td>

<span class="${
order.status.toLowerCase()
}">

${order.status}

</span>

</td>

<td>

<div class="actions">

<button

class="edit-btn"

onclick="editOrder(${index})">

<i class="bi bi-pencil-fill"></i>

</button>

<button

class="delete-btn"

onclick="deleteOrder(${index})">

<i class="bi bi-trash-fill"></i>

</button>

</div>

</td>

</tr>

`;

    });

}
// ==============================
// SAVE ORDER
// ==============================

btnSave.addEventListener("click", function () {

    if (customer.value.trim() == "") {

        alert("Customer name is required.");
        return;

    }

    if (products.length == 0) {

        alert("No products found in Inventory.");
        return;

    }

    const selectedProduct = products.find(p => p.name == product.value);

    if (!selectedProduct) {

        alert("Product not found.");
        return;

    }

    const qty = Number(quantity.value);

    if (qty <= 0) {

        alert("Invalid quantity.");
        return;

    }

    if (editIndex == -1) {

        if (selectedProduct.stock < qty) {

            alert("Not enough stock.");

            return;

        }

        selectedProduct.stock -= qty;

    }

    const order = {

        id: "ORD-" + Date.now(),

        customer: customer.value,

        platform: platform.value,

        product: product.value,

        quantity: qty,

        total: Number(total.value),

        status: status.value,

        date: orderDate.value,

        notes: notes.value

    };

    if (editIndex == -1) {

        orders.push(order);

    } else {

        orders[editIndex] = order;

        editIndex = -1;

    }

    localStorage.setItem(

        ORDER_KEY,

        JSON.stringify(orders)

    );

    localStorage.setItem(

        PRODUCT_KEY,

        JSON.stringify(products)

    );

    renderOrders();

    clearForm();

    modal.hide();

});

// ==============================
// CLEAR FORM
// ==============================

function clearForm(){

    customer.value = "";

    platform.selectedIndex = 0;

    product.selectedIndex = 0;

    quantity.value = 1;

    total.value = "";

    status.selectedIndex = 0;

    notes.value = "";

    orderDate.value =
    new Date().toISOString().split("T")[0];

}
// ==============================
// EDIT ORDER
// ==============================

window.editOrder = function(index){

    const order = orders[index];

    editIndex = index;

    customer.value = order.customer;
    platform.value = order.platform;
    product.value = order.product;
    quantity.value = order.quantity;
    total.value = order.total;
    status.value = order.status;
    orderDate.value = order.date;
    notes.value = order.notes;

    document.querySelector(".modal-title").textContent =
    "Edit Order";

    btnSave.textContent =
    "Update Order";

    modal.show();

};

// ==============================
// DELETE ORDER
// ==============================

window.deleteOrder = function(index){

    if(!confirm("Delete this order?")) return;

    const order = orders[index];

    const item = products.find(p=>p.name==order.product);

    if(item){

        item.stock += Number(order.quantity);

    }

    orders.splice(index,1);

    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(orders)
    );

    localStorage.setItem(
        PRODUCT_KEY,
        JSON.stringify(products)
    );

    renderOrders();

};

// ==============================
// SEARCH
// ==============================

search.addEventListener("keyup",()=>{

    renderOrders();

});

// ==============================
// FILTER
// ==============================

filter.addEventListener("change",()=>{

    renderOrders();

});

// ==============================
// AUTO COMPUTE TOTAL
// ==============================

product.addEventListener("change",computeTotal);

quantity.addEventListener("input",computeTotal);

function computeTotal(){

    const item = products.find(
        p=>p.name==product.value
    );

    if(!item){

        total.value="";

        return;

    }

    total.value =
    item.price * Number(quantity.value);

}

// ==============================
// RESET MODAL
// ==============================

document
.getElementById("orderModal")
.addEventListener(
"hidden.bs.modal",
()=>{

    clearForm();

    editIndex = -1;

    document.querySelector(".modal-title").textContent =
    "Add Order";

    btnSave.textContent =
    "Save Order";

});

// ==============================
// STORAGE UPDATE
// ==============================

window.addEventListener("storage",()=>{

    orders =
    JSON.parse(localStorage.getItem(ORDER_KEY)) || [];

    products =
    JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];

    loadProducts();

    renderOrders();

});

// ==============================
// INITIAL LOAD
// ==============================

loadProducts();

renderOrders();

computeTotal();

console.log("Orders Loaded Successfully");