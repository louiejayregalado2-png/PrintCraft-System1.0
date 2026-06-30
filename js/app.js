// =====================================
// Print & Craft Management System
// app.js
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Print & Craft Management System Loaded");

    // Sidebar Active Menu
    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(menu => menu.classList.remove("active"));

            item.classList.add("active");

        });

    });

    // New Order Button
    const newOrderBtn = document.querySelector(".btn-order");

    if (newOrderBtn) {

        newOrderBtn.addEventListener("click", () => {

            alert("New Order feature will be added in the next lessons.");

        });

    }

    // View All Button
    const viewBtn = document.querySelector(".view-btn");

    if (viewBtn) {

        viewBtn.addEventListener("click", () => {

            alert("Orders page coming soon.");

        });

    }

    // Edit Buttons
    const editButtons = document.querySelectorAll(".edit");

    editButtons.forEach(button => {

        button.addEventListener("click", () => {

            alert("Edit Order feature coming soon.");

        });

    });

    // Delete Buttons
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const confirmDelete = confirm("Delete this order?");

            if(confirmDelete){

                alert("Delete feature coming soon.");

            }

        });

    });

    // Search
    const searchInput = document.querySelector(".search-box input");

    if(searchInput){

        searchInput.addEventListener("keyup", function(){

            const value = this.value.toLowerCase();

            const rows = document.querySelectorAll("tbody tr");

            rows.forEach(row=>{

                row.style.display =
                row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

            });

        });

    }

});