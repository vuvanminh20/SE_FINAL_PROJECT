$(document).ready(function () {
    let totalPrice = 0;
    let lengthProduct = product.length;
    for (let i = 0; i < lengthProduct; i++) {
        $('.order-form-container').append(`
            <div class="row order-row-` + i + `">
                <div class="col-1 index">
                    <span>`+(i+1)+`</span>
                </div>
                <div class="col-5 product-list">
                    <span>` + product[i].Name + `</span>
                </div>
                <div class="col-3">
                <input type="hidden" id="txtId` + i + `" value="` + product[i]._id + `">
                    <input id="txtQty` + i + `" type="number" value="0" placeholder="Nhập số lượng sản phẩm">
                </div>
                <div class="col-3">
                    <span>` + priceFormat(product[i].sellPrice) + ` vnđ</span>
                </div>
            </div>
            <hr>
        `)
    }

    $('#btnUpdate').click(()=>{
        totalPrice = 0
        for (let i = 0; i < lengthProduct; i++) {
            totalPrice = totalPrice + ($('#txtQty' + i).val() * product[i].sellPrice);
        }
        $('#txtTotalPrice').html(priceFormat(totalPrice) + 'vnđ')
    });

    $('#btnOrder').click(()=>{
        if(totalPrice >0){
            let Address = $('#txtAdress').val();
            let Phone = $('#txtPhone').val();
            let paymentType = $('input[name="btnradio"]:checked').val();
            let orderList = [];
            for (let i = 0; i < lengthProduct; i++) {
                if ($('#txtQty' + i).val() > 0){
                    orderList.push({'Product':$('#txtId' + i).val(),'Qty':$('#txtQty' + i).val()});
                }
            }
            // totalPayment

            if (Address.length >= 10 && Phone.length === 10){
                axios.post('/donhang',{
                    Address: Address,
                    Phone: Phone,
                    orderList:orderList,
                    totalPayment: totalPrice,
                    paymentType: paymentType,
                })
                    .then(response=>{
                        let {data} = response;
                        if(data.code === 200){
                            alert('Đặt hàng thành công !');
                            window.location = '/';
                        }else{
                            alert('Đã xảy ra lỗi ! Vui lòng thử lại');
                            window.location = '/donhang';
                        }
                    });
            }else{
                alert('Vui lòng kiểm tra lại địa chỉ / số điện thoại nhận hàng !');
            }
        }else{
            alert('Vui lòng chọn sản phẩm cần đặt !');
        }

    });
});

function priceFormat(digit) {
    return digit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}