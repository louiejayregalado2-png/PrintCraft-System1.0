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

// ======================================
// FIREBASE COLLECTION
// ======================================

const productsRef = collection(db,"products");

// ======================================
// HTML ELEMENTS
// ======================================

const tableBody =
document.getElementById("productTable");

const modal =
document.getElementById("productModal");

const saveBtn =
document.getElementById("saveProduct");

const txtName =
document.getElementById("productName");

const txtCategory =
document.getElementById("productCategory");

const txtPrice =
document.getElementById("productPrice");

const txtStock =
document.getElementById("productStock");

const txtLowStock =
document.getElementById("lowStock");

const txtImage =
document.getElementById("productImage");

const txtDescription =
document.getElementById("description");

const searchBox =
document.getElementById("searchProduct");

const categoryFilter =
document.getElementById("categoryFilter");

let editID = null;

// ======================================
// LOAD PRODUCTS
// ======================================

loadProducts();

function loadProducts(){

onSnapshot(productsRef,(snapshot)=>{

tableBody.innerHTML="";

snapshot.forEach((item)=>{

const product=item.data();

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

tableBody.innerHTML+=`

<tr>

<td>

<img
src="${product.image}"
width="60"
height="60"
style="object-fit:cover;border-radius:10px;">

</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>₱${product.price}</td>

<td>${product.stock}</td>

<td>

<span class="${badge}">

${status}

</span>

</td>

<td>

<button
class="action-btn edit"
onclick="editProduct('${item.id}')">

<i class="bi bi-pencil"></i>

</button>

<button
class="action-btn delete"
onclick="deleteProduct('${item.id}')">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

});

});

}
// ======================================
// SAVE PRODUCT
// ======================================

saveBtn.addEventListener("click", async () => {

    const name = txtName.value.trim();
    const category = txtCategory.value;
    const price = Number(txtPrice.value);
    const stock = Number(txtStock.value);
    const lowStock = Number(txtLowStock.value);
    const description = txtDescription.value;

    if(name===""){

        alert("Please enter a product name.");

        return;

    }

    if(price<=0){

        alert("Please enter a valid price.");

        return;

    }

    if(stock<0){

        alert("Please enter a valid stock.");

        return;

    }

    let image = "https://placehold.co/60x60";

    // ==========================
    // IMAGE UPLOAD
    // ==========================

    if(txtImage.files.length>0){

        const reader = new FileReader();

        reader.onload = async function(e){

            image = e.target.result;

            await saveToFirebase(image);

        };

        reader.readAsDataURL(txtImage.files[0]);

    }else{

        await saveToFirebase(image);

    }

});

// ======================================
// SAVE TO FIREBASE
// ======================================

async function saveToFirebase(image){

    const product = {

        name: txtName.value.trim(),

        category: txtCategory.value,

        price: Number(txtPrice.value),

        stock: Number(txtStock.value),

        lowStock: Number(txtLowStock.value),

        description: txtDescription.value,

        image: image

    };

    if(editID===null){

        await addDoc(productsRef,product);

    }else{

        await updateDoc(

            doc(db,"products",editID),

            product

        );

    }

    clearForm();

    editID = null;

    saveBtn.textContent = "Save Product";

    bootstrap.Modal
        .getInstance(modal)
        .hide();

}
// ======================================
// EDIT PRODUCT
// ======================================

window.editProduct = async function(id){

    editID = id;

    const snapshot = await getDocs(productsRef);

    snapshot.forEach((item)=>{

        if(item.id===id){

            const product = item.data();

            txtName.value = product.name;

            txtCategory.value = product.category;

            txtPrice.value = product.price;

            txtStock.value = product.stock;

            txtLowStock.value = product.lowStock;

            txtDescription.value = product.description || "";

            saveBtn.textContent = "Update Product";

            const bsModal = new bootstrap.Modal(modal);

            bsModal.show();

        }

    });

};

// ======================================
// DELETE PRODUCT
// ======================================

window.deleteProduct = async function(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if(!confirmDelete){

        return;

    }

    await deleteDoc(

        doc(db,"products",id)

    );

};