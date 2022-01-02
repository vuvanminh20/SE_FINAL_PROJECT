let table = $('#tableProfitStatic').DataTable();

$(document).ready(() => {
    $('#monthPicker').change(() => {
        let rawMonth = ($('#monthPicker').val()).split('-');
        let month = rawMonth[1];
        let year = rawMonth[0];
        let productStatis = [];

        if (order.length > 0 || importP.length > 0) {
            for (let i = 0; i < product.length; i++) {
                productStatis.push({'id': product[i]._id, 'name': product[i].Name, 'in': 0, 'out': 0});
            }

            for (let i = 0; i < importP.length; i++) {
                let tmp = importP[i];
                let tmpDate = (new Date(parseInt(tmp.Date)).toLocaleDateString()).split('/');
                if (tmpDate[0] === month && tmpDate[2] === year) {
                    for (let j = 0; j < tmp.importList.length; j++) {
                        let tmp1 = tmp.importList[j]
                        let index = productStatis.findIndex((obj => obj.id == tmp1.Product._id));
                        productStatis[index].in = parseInt(productStatis[index].in) + (parseInt(tmp1.importQty) * parseInt(tmp1.importPrice));
                    }
                }
            }

            for (let i = 0; i < order.length; i++) {
                let tmp = order[i];
                let tmpDate = (new Date(parseInt(tmp.Date)).toLocaleDateString()).split('/');
                if (tmpDate[0] === month && tmpDate[2] === year) {
                    for (let j = 0; j < tmp.orderList.length; j++) {
                        let tmp1 = tmp.orderList[j]
                        let index = productStatis.findIndex((obj => obj.id == tmp1.Product._id));
                        productStatis[index].out = parseInt(productStatis[index].out) + (parseInt(tmp1.Product.sellPrice) * parseInt(tmp1.Qty));
                    }
                }
            }

            loadTable(productStatis);
            $('.statis-empty').css('display', 'none');
            $('.table-container').css('display', 'block');
        } else {
            $('.table-container').css('display', 'none');
            $('.statis-empty').css('display', 'block');
        }

    });
});

function loadTable(data) {
    table.destroy();
    table = $('#tableProfitStatic').DataTable({
        data: data,
        columns: [
            {data: 'id'},
            {data: 'name', width: '25%'},
            {
                data: 'in',
                render: function (data) {
                    return '<span>' + priceFormat(data) + ' vnđ</span>';
                }
            },
            {
                data: 'out',
                render: function (data) {
                    return '<span>' + priceFormat(data) + ' vnđ</span>';
                }
            },
            {
                data: null,
                render: function (data) {
                    let tmp = parseInt(data.out) - parseInt(data.in)
                    if (tmp > 0) {
                        return '<span style="color:green;">' + priceFormat(tmp) + ' vnđ</span>'
                    } else {
                        return '<span style="color:red;">' + priceFormat(tmp) + ' vnđ</span>'
                    }
                    return priceFormat();
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
        let PageInfo = $('#tableProfitStatic').DataTable().page.info();
        table.column(0, {page: 'current'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });
}

function priceFormat(digit) {
    return digit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}