let table = $('#tableOrderTrack').DataTable();

$(document).ready(function () {
    loadTableOrder(order);

    $('.close-detail').click(() => {
        $('.order-detail').css('display', 'none');
    });

    $(document).on('click', '#tableOrderTrack tbody tr', function () {
        let data = $(this)[0].innerHTML;
        let regex = /(?:action|className)=(?:["']\W+\s*(?:\w+)\()?["']([^'"]+)['"]/gmi;
        let tmp = regex.exec(data);
        let idArr = tmp[1].split('_');
        let targetId = idArr[1];
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

    });
});

function loadTableOrder(data) {
    table.destroy();
    table = $('#tableOrderTrack').DataTable({
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
        let PageInfo = $('#tableOrderTrack').DataTable().page.info();
        table.column(0, {page: 'current'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });
}

function priceFormat(digit) {
    return digit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}