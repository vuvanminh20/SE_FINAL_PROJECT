let table = $('#tableOrderManage').DataTable();

$(document).ready(function () {
    loadTableOrder(order);

    $('.close-detail').click(() => {
        $('.order-detail').css('display', 'none');
    });

    $(document).on('click', '.btn-action', (event) => {
        event.preventDefault();
        let id = $(event.target).attr('action');
        let idArr = id.split('_');
        let action = idArr[0];
        let targetId = idArr[1];
        let target2 = idArr[2];
        let target3 = idArr[3];

        switch (action) {
            case 'print':
                let printOrder = order.find(x => x._id === targetId);
                let payment;
                let pStatus = 'Chưa thanh toán';
                switch (printOrder.paymentType) {
                    case 'momo':
                        payment = ' Ví điện tử Momo';
                    case 'cod':
                        payment = 'Thanh toán khi nhận hàng';
                    case 'bank':
                        payment = 'Chuyển khoản';
                }
                if (printOrder.paymentStatus === 1) {
                    pStatus = 'Đã thanh toán';
                }
                $('.print-table').empty();
                $('.print-table').append(`
                    <h2><b>PHIẾU XUẤT KHO</b></h2>
                    <div class="print-date">
                        Ngày xuất: ` + new Date(Date.now()).toLocaleDateString() + `<br>
                        Ngày đặt hàng: ` + new Date(parseInt(printOrder.Date)).toLocaleDateString() + `
                    </div>
                    <div class="row">
                        <div class="col-6">
                            Người nhận: ` + printOrder.User.Name + `
                        </div>
                        <div class="col-6">
                            Số điện thoại: ` + printOrder.Phone + `
                        </div>
                        <div class="col-12">
                            Địa chỉ giao hàng: ` + printOrder.Address + `
                        </div>
                        <div class="col-6">Hình thức thanh toán: ` + payment + `</div>
                        <div class="col-6">Trạng thái thanh toán: ` + pStatus + `</div>
                    </div>
                    <table class="table-print">
                        <tr>
                            <th>TT</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                        </tr>
                    </table>
                        <div class="print-price">
                            Tổng tiền: ` + priceFormat(printOrder.totalPayment) + ` vnđ
                        </div>   
                        <div class="row print-foot">
                            <div class="col-4">
                                <p>Người xuất</p>
                            </div>
                            <div class="col-4">
                                <p>Người giao</p>
                            </div>
                            <div class="col-4">
                                <p>Người nhận</p>
                            </div>
                        </div>
                `);

                for (let i = 0; i < printOrder.orderList.length; i++) {
                    $('.table-print').append(`
                        <tr>
                            <td>` + (i + 1) + `</td>
                            <td>` + printOrder.orderList[i].Product.Name + `</td>
                            <td>` + printOrder.orderList[i].Qty + `</td>
                            <td>` + priceFormat(printOrder.orderList[i].Product.sellPrice) + ` vnđ</td>
                        </tr>
                    `);
                }
                $('.print-table').printThis();

                break;
            case 'payment':
                axios.post('/capnhatdonhang', {id: targetId, action: action, status: target2})
                    .then(response => {
                        let {data} = response;
                        if (data.code === 200) {
                            let status;
                            if (parseInt(target2) === 0) {
                                switch (target3) {
                                    case 'momo':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 1 + '_momo" style="color:green">MOMO</span>';
                                    case 'bank':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 1 + '_bank" style="color:green">BANK</span>';
                                    case 'cod':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 1 + '_cod" style="color:green">COD</span>';
                                }
                            } else {
                                switch (target3) {
                                    case 'momo':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 0 + '_momo" style="color:red">MOMO</span>';
                                    case 'bank':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 0 + '_bank" style="color:red">BANK</span>';
                                    case 'cod':
                                        status = '<span class="btn-action" action="payment_' + targetId + '_' + 0 + '_cod" style="color:red">COD</span>';
                                }
                            }
                            $(event.target).replaceWith(status);
                        } else {
                            alert('Đã có lỗi xảy ra, vui lòng thử lại sau');
                            window.location = '/quanlydonhang';
                        }
                    });
                break;
            case 'delivery':
                axios.post('/capnhatdonhang', {id: targetId, action: action, status: target2})
                    .then(response => {
                        let {data} = response;
                        if (data.code === 200) {
                            let status;
                            if (parseInt(target2) === 0) {
                                status = '<span class="btn-action" action="delivery_' + targetId + '_' + 1 + '" style="color:firebrick">Đang giao</span>';
                            }
                            if (parseInt(target2) === 1) {
                                status = '<span class="btn-action" action="delivery_' + targetId + '_' + 2 + '" style="color:green">Đã giao</span>';
                            }
                            if (parseInt(target2) === 2) {
                                status = '<span class="btn-action" action="delivery_' + targetId + '_' + 0 + '" style="color:red">Chưa giao</span>';
                            }
                            $(event.target).replaceWith(status);
                        } else {
                            alert('Đã có lỗi xảy ra, vui lòng thử lại sau');
                            window.location = '/quanlydonhang';
                        }
                    });
                break;
            case 'detail':
                let detailOrder = order.find(x => x._id === targetId);

                $('.order-detail-table').empty();
                $('.order-detail-table').append(`        
                    <tr>
                        <th>TT</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                    </tr>
                `);

                for (let i = 0; i < detailOrder.orderList.length; i++) {
                    $('.order-detail-table').append(`
                        <tr>
                            <td>` + (i + 1) + `</td>
                            <td>` + detailOrder.orderList[i].Product.Name + `</td>
                            <td>` + detailOrder.orderList[i].Qty + `</td>
                            <td>` + priceFormat(detailOrder.orderList[i].Product.sellPrice) + ` vnđ</td>
                        </tr>
                    `);
                }

                $('.order-detail').css('display', 'block');
        }
    });
});

function loadTableOrder(data) {
    table.destroy();
    table = $('#tableOrderManage').DataTable({
        data: data,
        columns: [
            {data: '_id'},
            {
                data: 'User.Name',
            },
            {data: 'Phone'},
            {data: 'Address', width: '25%'},
            {
                data: 'Date',
                render: function (data) {
                    return new Date(parseInt(data)).toLocaleDateString();
                }
            },
            {
                data: 'totalPayment',
                render: function (data) {
                    return priceFormat(data) + 'vnđ';
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.paymentStatus === 0) {
                        switch (data.paymentType) {
                            case 'momo':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 0 + '_momo" style="color:red">MOMO</span>';
                            case 'bank':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 0 + '_bank" style="color:red">BANK</span>';
                            case 'cod':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 0 + '_cod" style="color:red">COD</span>';
                        }
                    } else {
                        switch (data.paymentType) {
                            case 'momo':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 1 + '_momo" style="color:green">MOMO</span>';
                            case 'bank':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 1 + '_bank" style="color:green">BANK</span>';
                            case 'cod':
                                return '<span class="btn-action" action="payment_' + data._id + '_' + 1 + '_cod" style="color:green">COD</span>';
                        }
                    }

                }
            },
            {
                data: null,
                render: function (data) {
                    switch (data.deliveryStatus) {
                        case 0:
                            return '<span class="btn-action" action="delivery_' + data._id + '_' + 0 + '" style="color:red">Chưa giao</span>';
                        case 1:
                            return '<span class="btn-action" action="delivery_' + data._id + '_' + 1 + '" style="color:firebrick">Đang giao</span>';
                        case 2:
                            return '<span class="btn-action" action="delivery_' + data._id + '_' + 2 + '" style="color:green">Đã giao</span>';
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    return '<i class="fas fa-print btn-action" action="print_' + data._id + '"></i> / <i class="fas fa-info btn-action" action="detail_' + data._id + '"></i>'
                }
            }
        ],
        columnDefs: [{
            searchable: false,
            orderable: false,
            targets: 0
        }],
        order: [[1, 'asc']],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.24/i18n/Vietnamese.json'
        }
    });
    table.on('draw.dt', function () {
        let PageInfo = $('#tableOrderManage').DataTable().page.info();
        table.column(0, {page: 'current'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });
}

function priceFormat(digit) {
    return digit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}