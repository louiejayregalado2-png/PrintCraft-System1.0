// =====================================
// PRINT & CRAFT INVENTORY SYSTEM
// =====================================

let products = JSON.parse(localStorage.getItem("products")) || [];

let editIndex = -1;

const table = document.getElementById("productTable");

const modal = new bootstrap.Modal(document.getElementById("productModal"));

const txtName = document.getElementById("productName");
const txtCategory = document.getElementById("productCategory");
const txtPrice = document.getElementById("productPrice");
const txtStock = document.getElementById("productStock");
const txtLowStock = document.getElementById("lowStock");
const txtImage = document.getElementById("productImage");
const txtDescription = document.getElementById("description");

const btnSave = document.getElementById("saveProduct");

const search = document.getElementById("searchProduct");
const filter = document.getElementById("categoryFilter");

// =====================================
// LOAD PRODUCTS
// =====================================

renderProducts();

function renderProducts(){

    table.innerHTML="";

    let keyword = search.value.toLowerCase();
    let category = filter.value;

    let filtered = products.filter(product=>{

        let matchName =
        product.name.toLowerCase().includes(keyword);

        let matchCategory =
        category=="" ||
        product.category==category;

        return matchName && matchCategory;

    });

    if(filtered.length==0){

        table.innerHTML=`

        <tr>

            <td colspan="7"
            style="text-align:center;padding:40px;">

                No Products Found

            </td>

        </tr>

        `;

        return;

    }

    filtered.forEach((product,index)=>{

        let status =
        product.stock<=product.lowStock
        ? "Low Stock"
        : "In Stock";

        let badge =
        product.stock<=product.lowStock
        ? "low-stock"
        : "in-stock";

        table.innerHTML+=`

<tr>

<td>

<img
src="${product.image}"
style="
width:60px;
height:60px;
object-fit:cover;
border-radius:12px;">

</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>₱${product.price}</td>

<td>${product.stock}</td>

<td>

<span class="status ${badge}">

${status}

</span>

</td>

<td>

<div class="action">

<button
class="edit"
onclick="editProduct(${index})">

<i class="bi bi-pencil-fill"></i>

</button>

<button
class="delete"
onclick="deleteProduct(${index})">

<i class="bi bi-trash-fill"></i>

</button>

</div>

</td>

</tr>

`;

    });

}
// =====================================
// SAVE PRODUCT
// =====================================

btnSave.addEventListener("click", function () {

    if (txtName.value.trim() == "") {

        alert("Product Name is required.");
        return;

    }

    const saveProduct = (image) => {

        const product = {

            name: txtName.value.trim(),
            category: txtCategory.value,
            price: Number(txtPrice.value),
            stock: Number(txtStock.value),
            lowStock: Number(txtLowStock.value),
            description: txtDescription.value,
            image: image

        };

        if (editIndex == -1) {

            products.push(product);

        } else {

            products[editIndex] = product;
            editIndex = -1;

        }

        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );

        renderProducts();

        clearForm();

        modal.hide();

    };

    if (txtImage.files.length > 0) {

        const reader = new FileReader();

        reader.onload = function (e) {

            saveProduct(e.target.result);

        };

        reader.readAsDataURL(txtImage.files[0]);

    } else {

        let image = "https://placehold.co/60x60";

        if (editIndex != -1) {

            image = products[editIndex].image;

        }

        saveProduct(image);

    }

});

// =====================================
// CLEAR FORM
// =====================================

function clearForm() {

    txtName.value = "";
    txtCategory.selectedIndex = 0;
    txtPrice.value = "";
    txtStock.value = "";
    txtLowStock.value = 10;
    txtDescription.value = "";
    txtImage.value = "";

}

// =====================================
// SAVE TO LOCAL STORAGE
// =====================================

function saveStorage() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}
// =====================================
// EDIT PRODUCT
// =====================================

window.editProduct = function(index){

    const product = products[index];

    editIndex = index;

    txtName.value = product.name;
    txtCategory.value = product.category;
    txtPrice.value = product.price;
    txtStock.value = product.stock;
    txtLowStock.value = product.lowStock;
    txtDescription.value = product.description;

    document.querySelector(".modal-title").textContent = "Edit Product";
    btnSave.textContent = "Update Product";

    modal.show();

};

// =====================================
// DELETE PRODUCT
// =====================================

window.deleteProduct = function(index){

    if(!confirm("Are you sure you want to delete this product?")){

        return;

    }

    products.splice(index,1);

    saveStorage();

    renderProducts();

};

// =====================================
// SEARCH
// =====================================

search.addEventListener("keyup",function(){

    renderProducts();

});

// =====================================
// CATEGORY FILTER
// =====================================

filter.addEventListener("change",function(){

    renderProducts();

});

// =====================================
// RESET MODAL WHEN CLOSED
// =====================================

document
.getElementById("productModal")
.addEventListener("hidden.bs.modal",function(){

    clearForm();

    editIndex = -1;

    document.querySelector(".modal-title").textContent = "Add Product";

    btnSave.textContent = "Save Product";

});

// =====================================
// INITIALIZE
// =====================================

renderProducts();