import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "./firebase.js";

// ===========================================
// FIRESTORE
// ===========================================

const productsRef = collection(db, "products");

// ===========================================
// ELEMENTS
// ===========================================

const tableBody = document.getElementById("productTable");

const modalElement = document.getElementById("productModal");

const modal = new bootstrap.Modal(modalElement);

const saveBtn = document.getElementById("saveProduct");

const txtName = document.getElementById("productName");

const txtCategory = document.getElementById("productCategory");

const txtPrice = document.getElementById("productPrice");

const txtStock = document.getElementById("productStock");

const txtLowStock = document.getElementById("lowStock");

const txtImage = document.getElementById("productImage");

const txtDescription = document.getElementById("description");

const searchBox = document.getElementById("searchProduct");

const categoryFilter = document.getElementById("categoryFilter");

// ===========================================
// VARIABLES
// ===========================================

let products = [];

let editID = null;

// ===========================================
// START
// ===========================================

loadProducts();

// ===========================================
// LOAD PRODUCTS
// ===========================================

function loadProducts(){

    onSnapshot(productsRef,(snapshot)=>{

        products = [];

        snapshot.forEach((document)=>{

            products.push({

                id: document.id,

                ...document.data()

            });

        });

        renderProducts();

    });

}

// ===========================================
// RENDER PRODUCTS
// ===========================================

function renderProducts(){

    tableBody.innerHTML = "";

    let keyword = searchBox.value.toLowerCase();

    let category = categoryFilter.value;

    let filtered = products.filter(product=>{

        const matchSearch =

        product.name
        .toLowerCase()
        .includes(keyword);

        const matchCategory =

        category==""

        ||

        product.category==category;

        return matchSearch && matchCategory;

    });

    if(filtered.length===0){

        tableBody.innerHTML = `

<tr>

<td colspan="7"
style="text-align:center;padding:40px;">

No Products Found

</td>

</tr>

`;

        return;

    }

    filtered.forEach(product=>{

        const status =

        product.stock<=product.lowStock

        ?

        "Low Stock"

        :

        "In Stock";

        const badge =

        product.stock<=product.lowStock

        ?

        "pending"

        :

        "complete";

        tableBody.innerHTML += `

<tr>

<td>

<img

src="${product.image}"

style="

width:60px;

height:60px;

border-radius:12px;

object-fit:cover;">

</td>

<td>

${product.name}

</td>

<td>

${product.category}

</td>

<td>

₱${Number(product.price).toLocaleString()}

</td>

<td>

${product.stock}

</td>

<td>

<span class="status ${badge}">

${status}

</span>

</td>

<td>

<button

class="action-btn edit"

onclick="editProduct('${product.id}')">

<i class="bi bi-pencil-fill"></i>

</button>

<button

class="action-btn delete"

onclick="deleteProduct('${product.id}')">

<i class="bi bi-trash-fill"></i>

</button>

</td>

</tr>

`;

    });

}
// ===========================================
// SAVE BUTTON
// ===========================================

saveBtn.addEventListener("click", async () => {

    if (txtName.value.trim() === "") {

        alert("Please enter Product Name.");

        txtName.focus();

        return;

    }

    if (Number(txtPrice.value) <= 0) {

        alert("Please enter a valid Price.");

        txtPrice.focus();

        return;

    }

    if (Number(txtStock.value) < 0) {

        alert("Please enter a valid Stock.");

        txtStock.focus();

        return;

    }

    saveBtn.disabled = true;

    saveBtn.innerHTML = `

<span class="spinner-border spinner-border-sm me-2"></span>

Saving...

`;

    let image = "https://placehold.co/300x300";

    if (txtImage.files.length > 0) {

        const reader = new FileReader();

        reader.onload = async function (e) {

            image = e.target.result;

            await saveProduct(image);

        };

        reader.readAsDataURL(txtImage.files[0]);

    } else {

        if (editID == null) {

            await saveProduct(image);

        } else {

            const oldProduct = products.find(

                p => p.id === editID

            );

            image = oldProduct
                ? oldProduct.image
                : image;

            await saveProduct(image);

        }

    }

});

// ===========================================
// SAVE PRODUCT
// ===========================================

async function saveProduct(image) {

    const product = {

        name: txtName.value.trim(),

        category: txtCategory.value,

        price: Number(txtPrice.value),

        stock: Number(txtStock.value),

        lowStock: Number(txtLowStock.value),

        description: txtDescription.value.trim(),

        image: image,

        updatedAt: Date.now()

    };

    try {

        if (editID === null) {

            product.createdAt = Date.now();

            await addDoc(

                productsRef,

                product

            );

        } else {

            await updateDoc(

                doc(db, "products", editID),

                product

            );

        }

        clearForm();

        editID = null;

        modal.hide();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveBtn.disabled = false;

    saveBtn.innerHTML =

        editID === null

        ?

        "Save Product"

        :

        "Update Product";

}
// ===========================================
// EDIT PRODUCT
// ===========================================

window.editProduct = function(id){

    const product = products.find(p => p.id === id);

    if(!product){

        return;

    }

    editID = id;

    txtName.value = product.name;

    txtCategory.value = product.category;

    txtPrice.value = product.price;

    txtStock.value = product.stock;

    txtLowStock.value = product.lowStock;

    txtDescription.value = product.description || "";

    txtImage.value = "";

    saveBtn.innerHTML = "Update Product";

    modal.show();

};

// ===========================================
// DELETE PRODUCT
// ===========================================

window.deleteProduct = async function(id){

    const product = products.find(p=>p.id===id);

    if(!product){

        return;

    }

    const confirmDelete = confirm(

        `Delete "${product.name}"?`

    );

    if(!confirmDelete){

        return;

    }

    try{

        await deleteDoc(

            doc(db,"products",id)

        );

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

// ===========================================
// SEARCH
// ===========================================

searchBox.addEventListener("input",()=>{

    renderProducts();

});

// ===========================================
// CATEGORY FILTER
// ===========================================

categoryFilter.addEventListener("change",()=>{

    renderProducts();

});

// ===========================================
// SORT PRODUCTS
// ===========================================

function sortProducts(){

    products.sort((a,b)=>{

        return a.name.localeCompare(b.name);

    });

}

window.sortProducts = sortProducts;
// ===========================================
// CLEAR FORM
// ===========================================

function clearForm(){

    txtName.value = "";

    txtCategory.selectedIndex = 0;

    txtPrice.value = "";

    txtStock.value = "";

    txtLowStock.value = 10;

    txtDescription.value = "";

    txtImage.value = "";

}

// ===========================================
// RESET FORM
// ===========================================

function resetForm(){

    editID = null;

    clearForm();

    saveBtn.disabled = false;

    saveBtn.innerHTML = "Save Product";

}

// ===========================================
// MODAL CLOSED
// ===========================================

modalElement.addEventListener(

    "hidden.bs.modal",

    ()=>{

        resetForm();

    }

);

// ===========================================
// IMAGE PREVIEW CHECK
// ===========================================

txtImage.addEventListener("change",()=>{

    if(txtImage.files.length==0){

        return;

    }

    console.log(

        "Selected:",

        txtImage.files[0].name

    );

});

// ===========================================
// ENTER KEY SUPPORT
// ===========================================

document.addEventListener("keydown",(e)=>{

    if(

        e.key==="Enter"

        &&

        modalElement.classList.contains("show")

        &&

        document.activeElement.tagName!=="TEXTAREA"

    ){

        e.preventDefault();

        saveBtn.click();

    }

});

// ===========================================
// REFRESH WHEN WINDOW FOCUSED
// ===========================================

window.addEventListener("focus",()=>{

    renderProducts();

});

// ===========================================
// FIREBASE CONNECTION CHECK
// ===========================================

onSnapshot(productsRef,

()=>{

    console.log("✅ Firestore Connected");

},

(error)=>{

    console.error(error);

}

);

// ===========================================
// INITIALIZE
// ===========================================

window.renderProducts = renderProducts;

window.clearForm = clearForm;

window.resetForm = resetForm;

console.log("Inventory Part 4 Loaded");
// ===========================================
// LOADING BUTTON
// ===========================================

function setButtonLoading(isLoading){

    if(isLoading){

        saveBtn.disabled = true;

        saveBtn.innerHTML = `

<span class="spinner-border spinner-border-sm me-2"></span>

Saving...

`;

    }else{

        saveBtn.disabled = false;

        saveBtn.innerHTML =

        editID == null

        ?

        "Save Product"

        :

        "Update Product";

    }

}

// ===========================================
// IMAGE VALIDATION
// ===========================================

txtImage.addEventListener("change",()=>{

    if(txtImage.files.length==0){

        return;

    }

    const file = txtImage.files[0];

    if(file.size > 2 * 1024 * 1024){

        alert("Image must be less than 2MB.");

        txtImage.value = "";

        return;

    }

});

// ===========================================
// FIREBASE STATUS
// ===========================================

onSnapshot(productsRef,

(snapshot)=>{

    console.log(

        "Products Loaded:",

        snapshot.size

    );

},

(error)=>{

    console.error(error);

    alert(

        "Cannot connect to Firebase."

    );

}

);

// ===========================================
// WINDOW FUNCTIONS
// ===========================================

window.editProduct = editProduct;

window.deleteProduct = deleteProduct;

window.renderProducts = renderProducts;

// ===========================================
// START
// ===========================================

document.addEventListener(

"DOMContentLoaded",

()=>{

    clearForm();

    renderProducts();

    console.log(

        "Inventory Ready"

    );

}

);

// ===========================================
// END OF FILE
// ===========================================