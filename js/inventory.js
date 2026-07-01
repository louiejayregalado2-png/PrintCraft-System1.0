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

// ==============================
// COLLECTION
// ==============================

const productsRef = collection(db, "products");

// ==============================
// ELEMENTS
// ==============================

const tableBody = document.querySelector("tbody");

const addModal =
document.getElementById("addProductModal");

const saveBtn =
document.getElementById("saveProduct");

const inputs =
addModal.querySelectorAll(
"input, select, textarea"
);

let editID = null;

// ==============================
// LOAD PRODUCTS
// ==============================

loadProducts();

function loadProducts(){

onSnapshot(productsRef,(snapshot)=>{

tableBody.innerHTML="";

snapshot.forEach((document)=>{

const product = document.data();

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

<span class="${
product.stock<=product.lowStock
?
"pending"
:
"complete"
}">

${
product.stock<=product.lowStock
?
"Low Stock"
:
"In Stock"
}

</span>

</td>

<td>

<button

class="action-btn edit"

onclick="editProduct('${document.id}')">

<i class="bi bi-pencil"></i>

</button>

<button

class="action-btn delete"

onclick="deleteProduct('${document.id}')">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

});

});

}
// ==============================
// SAVE PRODUCT
// ==============================

saveBtn.addEventListener("click", async () => {

    const name = inputs[0].value.trim();
    const category = inputs[1].value;
    const price = Number(inputs[2].value);
    const stock = Number(inputs[3].value);
    const lowStock = Number(inputs[4].value);
    const imageInput = inputs[5];

    if(name=="" || price<=0){

        alert("Please complete all fields.");

        return;

    }

    let image = "https://placehold.co/60x60";

    if(imageInput.files.length>0){

        const reader = new FileReader();

        reader.onload = async function(e){

            image = e.target.result;

            if(editID==null){

                await addDoc(productsRef,{

                    name,
                    category,
                    price,
                    stock,
                    lowStock,
                    image

                });

            }else{

                await updateDoc(

                    doc(db,"products",editID),

                    {

                        name,
                        category,
                        price,
                        stock,
                        lowStock,
                        image

                    }

                );

                editID=null;

            }

            clearForm();

            bootstrap.Modal
            .getInstance(addModal)
            .hide();

        };

        reader.readAsDataURL(imageInput.files[0]);

    }else{

        if(editID==null){

            await addDoc(productsRef,{

                name,
                category,
                price,
                stock,
                lowStock,
                image

            });

        }else{

            await updateDoc(

                doc(db,"products",editID),

                {

                    name,
                    category,
                    price,
                    stock,
                    lowStock

                }

            );

            editID=null;

        }

        clearForm();

        bootstrap.Modal
        .getInstance(addModal)
        .hide();

    }

});
// ==============================
// EDIT PRODUCT
// ==============================

window.editProduct = async function(id){

    editID = id;

    const snapshot = await getDocs(productsRef);

    snapshot.forEach((document)=>{

        if(document.id === id){

            const product = document.data();

            inputs[0].value = product.name;
            inputs[1].value = product.category;
            inputs[2].value = product.price;
            inputs[3].value = product.stock;
            inputs[4].value = product.lowStock;

            saveBtn.textContent = "Update Product";

            const modal = new bootstrap.Modal(addModal);

            modal.show();

        }

    });

};

// ==============================
// DELETE PRODUCT
// ==============================

window.deleteProduct = async function(id){

    if(!confirm("Delete this product?")){

        return;

    }

    await deleteDoc(

        doc(db,"products",id)

    );

};

// ==============================
// SEARCH PRODUCT
// ==============================

const searchInput = document.getElementById("searchProduct");

if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const keyword =
        searchInput.value.toLowerCase();

        const rows =
        tableBody.querySelectorAll("tr");

        rows.forEach(row=>{

            row.style.display =
            row.innerText
            .toLowerCase()
            .includes(keyword)
            ?
            ""
            :
            "none";

        });

    });

}
// ==============================
// CATEGORY FILTER
// ==============================

const categoryFilter =
document.getElementById("categoryFilter");

if(categoryFilter){

categoryFilter.addEventListener("change",()=>{

const category =
categoryFilter.value.toLowerCase();

const rows =
tableBody.querySelectorAll("tr");

rows.forEach(row=>{

if(category===""){

row.style.display="";

return;

}

const productCategory =
row.cells[2].innerText.toLowerCase();

row.style.display =
productCategory===category
?
""
:
"none";

});

});

}

// ==============================
// CLEAR FORM
// ==============================

function clearForm(){

inputs[0].value="";
inputs[1].selectedIndex=0;
inputs[2].value="";
inputs[3].value="";
inputs[4].value=10;
inputs[5].value="";
inputs[6].value="";

editID=null;

saveBtn.textContent="Save Product";

}

// ==============================
// RESET MODAL
// ==============================

addModal.addEventListener(

"hidden.bs.modal",

()=>{

clearForm();

});

// ==============================
// READY
// ==============================

console.log("Firebase Inventory Ready");