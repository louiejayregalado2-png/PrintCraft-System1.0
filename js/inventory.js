// ===============================
// Print & Craft Inventory System
// ===============================

let products = JSON.parse(localStorage.getItem("products")) || [];

const tableBody = document.querySelector("tbody");

const addProductModal = document.getElementById("addProductModal");

const saveBtn = addProductModal
    ? addProductModal.querySelector(".btn-primary")
    : null;

const inputs = addProductModal
    ? addProductModal.querySelectorAll("input, select, textarea")
    : [];


// ===============================
// Render Products
// ===============================

function renderProducts(){

    if(!tableBody) return;

    tableBody.innerHTML = "";

    products.forEach((product,index)=>{

        let status =
            product.stock <= product.lowStock
            ? "Low Stock"
            : "In Stock";

        let badge =
            product.stock <= product.lowStock
            ? "pending"
            : "complete";

        tableBody.innerHTML += `

<tr>

<td>

<img src="${product.image}"
width="60"
height="60"
style="object-fit:cover;border-radius:10px;">

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

<button
class="action-btn edit"
onclick="editProduct(${index})">

<i class="bi bi-pencil"></i>

</button>

<button
class="action-btn delete"
onclick="deleteProduct(${index})">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

    });

}

renderProducts();
// ===============================
// Save Product
// ===============================

if (saveBtn) {

    saveBtn.addEventListener("click", () => {

        const name = inputs[0].value.trim();
        const category = inputs[1].value;
        const price = Number(inputs[2].value);
        const stock = Number(inputs[3].value);
        const lowStock = Number(inputs[4].value);
        const imageInput = inputs[5];

        if (
            name === "" ||
            price <= 0 ||
            stock < 0
        ) {

            alert("Please complete all fields.");
            return;

        }

        if (imageInput.files.length > 0) {

            const reader = new FileReader();

            reader.onload = function (e) {

                products.push({

                    name,
                    category,
                    price,
                    stock,
                    lowStock,
                    image: e.target.result

                });

                localStorage.setItem(
                    "products",
                    JSON.stringify(products)
                );

                renderProducts();

                bootstrap.Modal.getInstance(addProductModal).hide();

                inputs.forEach(input => {

                    if (input.type == "file") {

                        input.value = "";

                    } else {

                        input.value = "";

                    }

                });

            };

            reader.readAsDataURL(imageInput.files[0]);

        } else {

            products.push({

                name,
                category,
                price,
                stock,
                lowStock,
                image: "https://placehold.co/60x60"

            });

            localStorage.setItem(
                "products",
                JSON.stringify(products)
            );

            renderProducts();

            bootstrap.Modal.getInstance(addProductModal).hide();

            inputs.forEach(input => {

                if (input.type == "file") {

                    input.value = "";

                } else {

                    input.value = "";

                }

            });

        }

    });

}
// ===============================
// Edit Product
// ===============================

window.editProduct = function(index){

    const product = products[index];

    inputs[0].value = product.name;
    inputs[1].value = product.category;
    inputs[2].value = product.price;
    inputs[3].value = product.stock;
    inputs[4].value = product.lowStock;

    const modal = new bootstrap.Modal(addProductModal);
    modal.show();

    saveBtn.textContent = "Update Product";

    const newBtn = saveBtn.cloneNode(true);

    saveBtn.parentNode.replaceChild(newBtn, saveBtn);

    newBtn.addEventListener("click", function(){

        product.name = inputs[0].value.trim();
        product.category = inputs[1].value;
        product.price = Number(inputs[2].value);
        product.stock = Number(inputs[3].value);
        product.lowStock = Number(inputs[4].value);

        const imageInput = inputs[5];

        if(imageInput.files.length > 0){

            const reader = new FileReader();

            reader.onload = function(e){

                product.image = e.target.result;

                localStorage.setItem(
                    "products",
                    JSON.stringify(products)
                );

                renderProducts();

                modal.hide();

                location.reload();

            };

            reader.readAsDataURL(imageInput.files[0]);

        }else{

            localStorage.setItem(
                "products",
                JSON.stringify(products)
            );

            renderProducts();

            modal.hide();

            location.reload();

        }

    });

};

// ===============================
// Delete Product
// ===============================

window.deleteProduct = function(index){

    if(confirm("Delete this product?")){

        products.splice(index,1);

        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );

        renderProducts();

    }

};

// ===============================
// Search
// ===============================

const searchInput = document.querySelector(".search-box input");

if(searchInput){

    searchInput.addEventListener("keyup",function(){

        const value = this.value.toLowerCase();

        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row=>{

            row.style.display =
                row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

        });

    });

}