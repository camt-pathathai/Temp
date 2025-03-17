$(document).ready(function() {
    // เปิด Modal เพิ่มสินค้า
    $("#openAddProductModal").click(function() {
        $("#productModal").show();
    });

    // เปิด Modal เพิ่มหมวดหมู่
    $("#openAddCategoryModal").click(function() {
        $("#categoryModal").show();
    });

    // ฟังก์ชันดูสินค้า
    function viewProduct(id) {
        window.location.href = `/products/view/${id}`;
    }

    // ฟังก์ชันแก้ไขสินค้า
    function editProduct(id) {
        $.get(`/products/${id}`, function(product) {
            $("#productId").val(product.id);
            $("#productName").val(product.name);
            $("#productCategory").val(product.category);
            $("#productPrice").val(product.normal_price);
            $("#promoPrice").val(product.promo_price);
            $("#productImage").val(product.image);
            $("#productModal").show();
        });
    }

    // ฟังก์ชันลบสินค้า
    function deleteProduct(id) {
        if (confirm("ต้องการลบสินค้านี้หรือไม่?")) {
            $.post("/products/delete", { id: id }, function() {
                location.reload();
            });
        }
    }
});
$(document).ready(function() {
    // ปุ่ม "เพิ่มเกม" จะพาไปหน้าเพิ่มสินค้า
    $("#openAddProductModal").click(function() {
        window.location.href = "/products/add";
    });

    // ปุ่ม "จัดการสต็อก"
    $("#manageStock").click(function() {
        window.location.href = "/stock-management";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // ไฮไลต์เมนู Sidebar ที่ถูกเลือก
    const links = document.querySelectorAll(".sidebar nav ul li a");
    const currentPath = window.location.pathname;

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.parentElement.classList.add("active");
        }
    });
});


