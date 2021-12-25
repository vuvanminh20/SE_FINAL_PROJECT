$(document).ready(() => {
    let row = 0;

    $('#btnAddRow').click(() => {
        row = row + 1;
        $('.import-form-container').append(`
            <div class="row import-row-` + row + `">
                <div class="col-1 index">
                    <span>` + (1 + row) + `</span>
                </div>
                <div class="col-5 product-list">
                    <select id="selectProduct` + row + `">
                        <option selected disabled>Vui lòng chọn sản phẩm cần nhập</option>
                    </select>
                </div>
                <div class="col-3">
                    <input id="txtQty` + row + `" required type="number" placeholder="Nhập số lượng sản phẩm">
                </div>
                <div class="col-3">
                    <input id="txtPrice` + row + `" required type="number" placeholder="Nhập đơn giá nhập">
                </div>
            </div>
        `);
        product.forEach((p) => {
            $('#selectProduct' + row).append($('<option>', {
                value: p._id,
                text: p.Name
            }));
        })
    });

    $('#btnDelRow').click(() => {
        $('.import-row-' + row).remove();
        row = row - 1;
    });

    $('#btnImport').click(() => {
        let productList = [];
        if (row === 0) {
            let product = $('#selectProduct0').val();
            let qty = $('#txtQty0').val();
            let price = $('#txtPrice0').val();
            if (product && qty > 0 && price >= 10000){
                productList.push({Product: product, importQty: qty, importPrice: price});
            }else{
                alert('Vui lòng kiểm tra lại thông tin ở dòng 1 !\nBạn hãy đảm bảo sản hẩm đã được chọn, số lượng lớn hơn 0 và giá nhập lớn hơn 10.000 vnd')
            }
        } else {
            for (let i = 0; i <= row; i++) {
                let product = $('#selectProduct' + i).val();
                let qty = $('#txtQty' + i).val();
                let price = $('#txtPrice' + i).val();
                if (product && qty > 0 && price >= 10000){
                    productList.push({Product: product, importQty: qty, importPrice: price});
                }else{
                    alert('Vui lòng kiểm tra lại thông tin ở dòng '+(i+1)+' !\nBạn hãy đảm bảo sản hẩm đã được chọn, số lượng lớn hơn 0 và giá nhập lớn hơn 10.000 vnd')
                }
            }
        }

        axios.post('/nhaphang', {productList:productList})
            .then(response=>{
                let {data} = response;
                if(data.code === 200){
                    alert('Nhập hàng thành công !');
                    window.location = '/';
                }else{
                    alert('Đã xảy ra lỗi ! Vui lòng thử lại');
                    window.location = '/nhaphang';
                }
            })
    });
});