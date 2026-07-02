import {
    db,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    doc,
    onSnapshot
} from "./firebase.js";

// =====================================
// FIRESTORE COLLECTION
// =====================================

const productsCollection = collection(db, "products");

// =====================================
// DOM ELEMENTS
// =====================================

const productTable = document.getElementById("productTable");

const productModal = document.getElementById("productModal");

const modal = new bootstrap.Modal(productModal);

const saveButton = document.getElementById("saveProduct");

const productName = document.getElementById("productName");

const productCategory = document.getElementById("productCategory");

const productPrice = document.getElementById("productPrice");

const productStock = document.getElementById("productStock");

const productLowStock = document.getElementById("lowStock");

const productImage = document.getElementById("productImage");

const productDescription = document.getElementById("description");

const searchInput = document.getElementById("searchProduct");

const categoryFilter = document.getElementById("categoryFilter");

// =====================================
// VARIABLES
// =====================================

let products = [];

let editProductID = null;

// =====================================
// START
// =====================================

initializeInventory();

// =====================================
// INITIALIZE
// =====================================

function initializeInventory(){

    listenProducts();

    searchInput.addEventListener("input",renderProducts);

    categoryFilter.addEventListener("change",renderProducts);

}

// =====================================
// FIREBASE LISTENER
// =====================================

function listenProducts(){

    onSnapshot(productsCollection,(snapshot)=>{

        products=[];

        snapshot.forEach((item)=>{

            products.push({

                id:item.id,

                ...item.data()

            });

        });

        renderProducts();

    });

}

// =====================================
// RENDER TABLE
// =====================================

function renderProducts(){

    productTable.innerHTML="";

    let keyword=searchInput.value.toLowerCase();

    let category=categoryFilter.value;

    let filtered=products.filter(product=>{

        let searchMatch=

        product.name

        .toLowerCase()

        .includes(keyword);

        let categoryMatch=

        category===""

        ||

        product.category===category;

        return searchMatch && categoryMatch;

    });

    if(filtered.length===0){

        productTable.innerHTML=`

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

        const status=

        product.stock<=product.lowStock

        ?

        "Low Stock"

        :

        "In Stock";

        const badge=

        product.stock<=product.lowStock

        ?

        "pending"

        :

        "complete";

        productTable.innerHTML+=`

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

data-id="${product.id}">

<i class="bi bi-pencil-fill"></i>

</button>

<button

class="action-btn delete"

data-id="${product.id}">

<i class="bi bi-trash-fill"></i>

</button>

</td>

</tr>

`;

    });

}
// =====================================
// SAVE BUTTON
// =====================================

saveButton.addEventListener("click", async () => {

    if (!validateForm()) return;

    saveButton.disabled = true;

    saveButton.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2"></span>
    Saving...
    `;

    let image = "https://placehold.co/300x300";

    if (productImage.files.length > 0) {

        const reader = new FileReader();

        reader.onload = async function (e) {

            image = e.target.result;

            await saveProduct(image);

        };

        reader.readAsDataURL(productImage.files[0]);

    } else {

        if (editProductID === null) {

            await saveProduct(image);

        } else {

            const current = products.find(
                p => p.id === editProductID
            );

            image = current ? current.image : image;

            await saveProduct(image);

        }

    }

});

// =====================================
// VALIDATE FORM
// =====================================

function validateForm(){

    if(productName.value.trim()===""){

        alert("Please enter Product Name.");

        productName.focus();

        return false;

    }

    if(Number(productPrice.value)<=0){

        alert("Please enter a valid Price.");

        productPrice.focus();

        return false;

    }

    if(Number(productStock.value)<0){

        alert("Please enter a valid Stock.");

        productStock.focus();

        return false;

    }

    if(Number(productLowStock.value)<0){

        alert("Please enter a valid Low Stock.");

        productLowStock.focus();

        return false;

    }

    return true;

}

// =====================================
// SAVE TO FIREBASE
// =====================================

async function saveProduct(image){

    const data={

        name:productName.value.trim(),

        category:productCategory.value,

        price:Number(productPrice.value),

        stock:Number(productStock.value),

        lowStock:Number(productLowStock.value),

        description:productDescription.value.trim(),

        image:image,

        updatedAt:Date.now()

    };

    try{

        if(editProductID===null){

            data.createdAt=Date.now();

            await addDoc(productsCollection,data);

        }

        else{

            await updateDoc(

                doc(db,"products",editProductID),

                data

            );

        }

        clearForm();

        editProductID=null;

        modal.hide();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    saveButton.disabled=false;

    saveButton.innerHTML="Save Product";

}
// =====================================
// EDIT PRODUCT
// =====================================

window.editProduct = function(id){

    const product = products.find(item => item.id === id);

    if(!product){

        return;

    }

    editProductID = id;

    productName.value = product.name;

    productCategory.value = product.category;

    productPrice.value = product.price;

    productStock.value = product.stock;

    productLowStock.value = product.lowStock;

    productDescription.value = product.description || "";

    productImage.value = "";

    saveButton.innerHTML = "Update Product";

    modal.show();

};

// =====================================
// DELETE PRODUCT
// =====================================

window.deleteProduct = async function(id){

    const product = products.find(item => item.id === id);

    if(!product){

        return;

    }

    if(!confirm(`Delete "${product.name}"?`)){

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

// =====================================
// TABLE BUTTON EVENTS
// =====================================

productTable.addEventListener("click",(e)=>{

    const editButton = e.target.closest(".edit");

    const deleteButton = e.target.closest(".delete");

    if(editButton){

        editProduct(

            editButton.dataset.id

        );

    }

    if(deleteButton){

        deleteProduct(

            deleteButton.dataset.id

        );

    }

});

// =====================================
// SORT PRODUCTS
// =====================================

function sortProducts(){

    products.sort((a,b)=>{

        return a.name.localeCompare(b.name);

    });

}

window.sortProducts = sortProducts;
// =====================================
// CLEAR FORM
// =====================================

function clearForm(){

    productName.value = "";

    productCategory.selectedIndex = 0;

    productPrice.value = "";

    productStock.value = "";

    productLowStock.value = 10;

    productDescription.value = "";

    productImage.value = "";

}

// =====================================
// RESET FORM
// =====================================

function resetForm(){

    editProductID = null;

    clearForm();

    saveButton.disabled = false;

    saveButton.innerHTML = "Save Product";

}

// =====================================
// MODAL EVENTS
// =====================================

productModal.addEventListener("hidden.bs.modal",()=>{

    resetForm();

});

// =====================================
// IMAGE SIZE CHECK
// =====================================

productImage.addEventListener("change",()=>{

    if(productImage.files.length===0){

        return;

    }

    const file = productImage.files[0];

    if(file.size > 2 * 1024 * 1024){

        alert("Image size must not exceed 2MB.");

        productImage.value = "";

    }

});

// =====================================
// ENTER KEY SUPPORT
// =====================================

document.addEventListener("keydown",(e)=>{

    if(

        e.key==="Enter"

        &&

        productModal.classList.contains("show")

        &&

        document.activeElement.tagName!=="TEXTAREA"

    ){

        e.preventDefault();

        saveButton.click();

    }

});

// =====================================
// AUTO REFRESH
// =====================================

window.addEventListener("focus",()=>{

    renderProducts();

});

// =====================================
// FIREBASE CONNECTION
// =====================================

onSnapshot(productsCollection,

(snapshot)=>{

    console.log(

        "Connected to Firestore",

        snapshot.size

    );

},

(error)=>{

    console.error(error);

}

);
// =====================================
// TABLE ACTIONS
// =====================================

productTable.addEventListener("click",(e)=>{

    const editBtn=e.target.closest(".edit");

    const deleteBtn=e.target.closest(".delete");

    if(editBtn){

        editProduct(editBtn.dataset.id);

    }

    if(deleteBtn){

        deleteProduct(deleteBtn.dataset.id);

    }

});

// =====================================
// WINDOW FUNCTIONS
// =====================================

window.editProduct=editProduct;

window.deleteProduct=deleteProduct;

window.renderProducts=renderProducts;

// =====================================
// START APPLICATION
// =====================================

document.addEventListener("DOMContentLoaded",()=>{

    clearForm();

    renderProducts();

    console.log("Inventory System Started");

});

// =====================================
// FIRESTORE STATUS
// =====================================

onSnapshot(

    productsCollection,

    ()=>{

        console.log("Firestore Connected");

    },

    (error)=>{

        console.error(error);

        alert("Firebase Error: "+error.message);

    }

);

// =====================================
// DEBUG
// =====================================

console.log("Inventory.js Loaded Successfully");

// =====================================
// END OF FILE
// =====================================