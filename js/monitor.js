$(document).ready(function () {
	refresh();
	function refresh() {
		var resultFromServer = null;
		$.getJSON('./data/test.json', function (data) {
            resultFromServer = data;
            // 所有节点总容量
            var totalSize = 0;
            var bricks = resultFromServer.volumes.bricks;
            var currentBrickNum = 0;
            var currentBrickTotalNum = 0;
            var totalBrickNum = bricks.length;
            var currentFileNum = 0;
            console.log(resultFromServer)
            var filelist = resultFromServer.filelist;
            var totalFileNum = filelist.length;

            for (var i = 0; i < bricks.length; i++) {
                totalSize += parseFloat(bricks[i].size[0])
            }
            totalSize = totalSize.toFixed(1);
            // 所有节点已用容量
            var usedTatalSize = 0;
            for (var i = 0; i < bricks.length; i++) {
                usedTatalSize += parseFloat(bricks[i].size[1])
            }
            addPie(usedTatalSize, totalSize);
            // 修改容量
            $('#totalSize').html("容量(GB):" + usedTatalSize + "/" + totalSize * 1024);

            // 修改文件总数
            $('#fileNum').html("文件总数:" + resultFromServer.filelist.length);

            // 获取成功节点数
            var successNum = 0;

            $('#brickNum').html('总数：' + bricks.length + '(' + successNum + '成功,' + (bricks.length - successNum) + '失败)');

            // 更新文件信息表格：
            updateFileList(currentFileNum, totalFileNum);
            function updateFileList(currentFileNum, totalFileNum) {
                $('#fileList').html("");
                var start = currentFileNum;
                var end = 0;
                if (totalFileNum - currentFileNum >= 10) {
                    end = start + 10;
                } else {
                    end = totalFileNum;
                }
                for (var i = start; i < end; i++) {
                    var fileName = filelist[i].file_name + "";
                    var fileType = fileName.split('.')[fileName.split('.').length - 1];
                    if (fileName.length > 33) {
                        fileName = fileName.substr(0, 30);
                        fileName += '...'
                    }
                    var fileSize = filelist[i].size.split('.')[0] + 'KB';
                    var oneFile =
                        '<tr>' +
                        '  <th scope="row">' +
                        '    <p>' + i + '</p>' +
                        '  </th>' +
                        '  <td>' +
                        '    <a><p class="filename">' + fileName + '</p></a>' +
                        '  </td>' +
                        '  <td>' +
                        '    <p>' + fileType + '</p>' +
                        '  </td>' +
                        '  <td>' +
                        '    <p>' + fileSize + '</p>' +
                        '  </td>' +
                        '</tr>';
                    $('#fileList').append(oneFile);
                }
            }

            // 更新节点信息表格
            updateBricksList(currentBrickNum, totalBrickNum);
            function updateBricksList(currentBrickNum, totalBrickNum) {
                $("#brickList").html("");
                var start = currentBrickNum;
                var end = 0;
                if (totalBrickNum - currentBrickNum >= 4) {
                    end = start + 4;
                } else {
                    end = totalBrickNum;
                }
                for (var i = start; i < end; i++) {
                    var brickName = bricks[i].brick_name;
                    var brickIp = bricks[i].path.split(':/')[0];
                    var brickStatusImg = (bricks[i].online == 'Y') ? './img/ok.png' : './img/error.png';
                    var brickTotalNum = bricks[i].size[0];
                    var brickUsedNum = bricks[i].size[1];
                    var volumeSize = parseFloat(brickUsedNum) / (parseFloat(brickTotalNum) * 1024) * 470;
                    var oneBrick =
                        '<tr   class="brickListTr">' +
                        '  <td>' +
                        '    <div style="background-image:url(./img/none-pc.png);" class="img">' +
                        '      <p>' + brickName + '</p>' +
                        '    </div>' +
                        '  </td>' +
                        '  <td style="width:510px;">' +
                        '    <div class="leftListUp"><span>' +
                        '        <label>节点名称</label></span>' +
                        '      <p>' + brickName + '</p><span>' +
                        '        <label>节点状态</label></span><img src="' + brickStatusImg + '"/>' +
                        '    </div>' +
                        '    <div class="leftListDown">' +
                        '      <div class="volume">' +
                        '        <div class="volumeSize" style="width:' + volumeSize + 'px"></div>' +
                        '        <p>已用量/总容量: ' + brickUsedNum + '/' + brickTotalNum + '</p>' +
                        '      </div>' +
                        '    </div>' +
                        '  </td>' +
                        '  <td>' +
                        '    <input type="button" value="删除" class="btn btn-primary"/>' +
                        '  </td>' +
                        '</tr>';
                    $("#brickList").append(oneBrick);
                }
            }

            // 更新状态总览内容进行分页
            updateTotalStatusPage(currentBrickTotalNum, totalBrickNum);
            function updateTotalStatusPage(currentBrickTotalNum, totalBrickNum) {
                $(".leftTopDownLeft").html("");
                var start = currentBrickTotalNum;
                var end = 0;
                if (totalBrickNum - currentBrickTotalNum >= 4) {
                    end = start + 4;
                } else {
                    end = totalBrickNum;
                }
                // 状态总览图片
                var okServer = '<img src="./img/ok-pc.png"/>';
                var errorServer = '<img src="./img/error-pc.png"/>';
                for (var i = start; i < end; i++) {
                    if (bricks[i].online == 'Y') {
                        successNum++;
                        $('.leftTopDownLeft').append(okServer);
                    } else {
                        $('.leftTopDownLeft').append(errorServer);
                    }
                }
            }

            // 节点列表分页
            bricksPageStatus(currentBrickNum, totalBrickNum);
            // 设置bricks列表上一页和下一页的禁用与否
            function bricksPageStatus(currentBrickNum, totalBrickNum) {  // 判断brick的上一页下一页可用性
                if (totalBrickNum <= 4 || (totalBrickNum - currentBrickNum) <= 4) { // 满足条件禁用下一页
                    $('#brickNextList').attr("disabled", "disabled");
                }
                if (totalBrickNum <= 4 || currentBrickNum < 4) { // 满足条件禁用上一页
                    $('#brickPrevList').attr("disabled", "disabled");
                }
                if (totalBrickNum - currentBrickNum > 4) { // 满足条件启用下一页
                    $('#brickNextList').removeAttr("disabled");
                }
                if (currentBrickNum >= 4) {
                    $('#brickPrevList').removeAttr("disabled");
                }
            }

            // 状态总览分页
            totalStatusPage(currentBrickTotalNum, totalBrickNum);
            // 设置bricks列表上一页和下一页的禁用与否
            function totalStatusPage(currentBrickTotalNum, totalBrickNum) {  // 判断brick的上一页下一页可用性
                if (totalBrickNum <= 4 || (totalBrickNum - currentBrickTotalNum) <= 4) { // 满足条件禁用下一页
                    $('#brickNextTotal').attr("disabled", "disabled");
                }
                if (totalBrickNum <= 4 || currentBrickTotalNum < 4) { // 满足条件禁用上一页
                    $('#brickPrevTotal').attr("disabled", "disabled");
                }
                if (totalBrickNum - currentBrickTotalNum > 4) { // 满足条件启用下一页
                    $('#brickNextTotal').removeAttr("disabled");
                }
                if (currentBrickTotalNum >= 4) {
                    $('#brickPrevTotal').removeAttr("disabled");
                }
            }

            tablePageStatus(currentFileNum, totalFileNum);
            // 设置文件列表上一页和下一页的禁用与否
            function tablePageStatus(currentFileNum, totalFileNum) {
                if (totalFileNum <= 10 || currentFileNum < 10) { // 上一页不可用
                    $("#tablePrev").attr("disabled", "disabled");

                }
                if (totalFileNum <= 10 || (totalFileNum - currentFileNum) <= 10) { // 下一页不可用
                    $("#tableNext").attr("disabled", "disabled");
                }
                if (currentFileNum >= 10) { // 上一页可用
                    $('#tablePrev').removeAttr("disabled");
                }
                if (totalFileNum - currentFileNum > 10) { // 下一页可用
                    $('#tableNext').removeAttr("disabled");
                }
            }

            // 分页
            function pageEvent(totalNum, currentNum, updateFileList, tablePageStatus, type, onePageNum, node) {
                if ($(node).attr("disabled")) {
                    return currentNum;
                } else {
                    if (type == "up") {
                        currentNum = currentNum - onePageNum;
                    } else if (type == "down") {
                        currentNum = currentNum + onePageNum;
                    }
                    updateFileList(currentNum, totalNum);
                    tablePageStatus(currentNum, totalNum);
                    return currentNum;
                }
            }

            $('#tableNext').click(function () {
                currentFileNum = pageEvent(totalFileNum, currentFileNum, updateFileList, tablePageStatus, "down", 10, '#tableNext')
            });
            $('#tablePrev').click(function () {
                currentFileNum = pageEvent(totalFileNum, currentFileNum, updateFileList, tablePageStatus, "up", 10, '#tablePrev')
            });
            $('#brickNextList').click(function () {
                currentBrickNum = pageEvent(totalBrickNum, currentBrickNum, updateBricksList, bricksPageStatus, "down", 4, '#brickNextList')
            });
            $('#brickPrevList').click(function () {
                currentBrickNum = pageEvent(totalBrickNum, currentBrickNum, updateBricksList, bricksPageStatus, "up", 4, '#brickPrevList')
            });
            $('#brickNextTotal').click(function () {
                currentBrickTotalNum = pageEvent(totalBrickNum, currentBrickTotalNum, updateTotalStatusPage, totalStatusPage, "down", 4, '#brickNextTotal')
            });
            $('#brickPrevTotal').click(function () {
                currentBrickTotalNum = pageEvent(totalBrickNum, currentBrickTotalNum, updateTotalStatusPage, totalStatusPage, "up", 4, '#brickPrevTotal')
            });
            $('.brickListTr .btn-primary').click(function (e) {
                var index = $('.brickListTr .btn-primary').index($(e.target));
                var ip = resultFromServer.volumes[0].bricks[index].brick_name;
                $.get('http://202.114.114.213:2016/removebrick?brick=' + ip, function (data) {
                    refresh();
                })
            })

            $('#addBrick').click(function () {
                $('.dropdown-menu').show();
            });

            $('.dropdown-menu li').click(function (e) {
                $('.dropdown-menu').hide();
                var ip = $(e.target).text().trim();
                $.get('http://202.114.114.213:2016/addbrick?brick=' + ip, function () {
                    refresh();
                })
            })

            $('#fileList').on("click", '.filename', function (e) {
                var index = $('.filename').index($(e.target));
                var filename = filelist[index].file_name;
                window.open('test.html?filename=' + filename, '', 'width=880,height=500,top=100,left=100,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
            });
        });
	}

});
