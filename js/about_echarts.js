// 添加饼状图
function addPie(usedTatalSize,totalSize){
	var usedTatalSize = usedTatalSize;
	var totalSize = totalSize * 1024;
	var usedPersent = parseFloat(usedTatalSize / totalSize * 100).toFixed(1);
	var unUsedPersent = 100 - usedPersent;
	// 路径配置
	require.config({
		paths: {
			echarts: 'http://echarts.baidu.com/build/dist'
		}
	});
	// 使用
	require(
		[
			'echarts',
			'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
		],
		function (ec) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = ec.init(document.getElementsByClassName('leftTopDownLeftVolume')[0]);
			var option = {
				calculable : true,
				color:["#2ec6c8","#d77a80"],
				legend: {
					x : 'left',
					data:['已用','未用'],
					selectedMode:false
				},
				series : [
					{
						name:'访问来源',
						type:'pie',
						//radius : [usedPersent +'%', unUsedPersent + '%'],
						radius : '55%',
						itemStyle : {
							normal : {
								label : {
									show : false
								},
								labelLine : {
									show : false
								}
							}
						},
						data:[
							{value:usedPersent, name:'已用'},
							{value:unUsedPersent , name:'未用'}
						]
					}
				]
			};
			myChart.setOption(option);
		}
	);
}