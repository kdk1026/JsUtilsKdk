/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2019.03.10
 * @version 1.0
 * @description 범용적으로 사용하고자 했으나 참고용일듯...
 */
var lang_kor = {
	"decimal" : "",
	"emptyTable" : "데이터가 없습니다.",
	"info" : "_START_ - _END_ (총 _TOTAL_ 건)",
	"infoEmpty" : "0명",
	"infoFiltered" : "(전체 _MAX_ 건 중 검색결과)",
	"infoPostFix" : "",
	"thousands" : ",",
	"lengthMenu" : "_MENU_ 개씩 보기",
	"loadingRecords" : "로딩중...",
	"processing" : "처리중...",
	"search" : "검색 : ",
	"zeroRecords" : "검색된 데이터가 없습니다.",
	"paginate" : {
		"first" : "첫 페이지",
		"last" : "마지막 페이지",
		"next" : "다음",
		"previous" : "이전"
	},
	"aria" : {
		"sortAscending" : " :  오름차순 정렬",
		"sortDescending" : " :  내림차순 정렬"
	}
};

$.extend($.fn.dataTable.defaults, {
	language : lang_kor,
	processing : true,
	searching: false
});

/**
 * <pre>
 * 서버에서 페이징 처리하지 않는 경우 적합
 * 각각의 상황에 맞게 클라이언트에서 처리 (검색, 페이징, 정렬 등)
 * </pre>
 * @param {Element} $tableElement
 * @param {string} url
 * @param {string} type
 * @param {Object} headers - 요청 헤더가 없을 경우, {}
 * @param {Object} params - 요청 파라미터가 없을 경우, {}
 * @param {Object[]} columns
 * @param {Object[]} columnDefs - 각 컬럼 커스터마이징 없을 경우, []
 * @returns
 */
function initDataTable($tableElement, url, type, headers, params, columns, columnDefs) {
	var oTable = $tableElement.DataTable({
		ordering : true,
		serverSide : false,
		ajax : {
			"url" : url,
			"type" : type,
			"contentType" : "application/x-www-form-urlencoded",
			"headers": headers,
			"data" : params
		},
		columns : columns,
		columnDefs : columnDefs
	});

	return oTable;
}

/**
 * <pre>
 * 서버에서 페이징 처리하는 경우 적합
 * 서버에서 검색, 정렬 등을 처리
 * 
 * <파라미터 참고> https://datatables.net/manual/server-side
 * </pre>
 * @param {Element} $tableElement
 * @param {string} url
 * @param {string} type
 * @param {Object} headers - 요청 헤더가 없을 경우, {}
 * @param {Object} params - 요청 파라미터가 없을 경우, {}
 * @param {Object[]} columns
 * @param {Object[]} columnDefs - 각 컬럼 커스터마이징 없을 경우, []
 * @returns
 */
function initDataTableServerSide($tableElement, url, type, headers, params, columns, columnDefs) {
	var oTable = $tableElement.DataTable({
		ordering : false,
		serverSide : true,
		ajax : {
			"url" : url,
			"type" : type,
			"contentType" : "application/x-www-form-urlencoded",
			"headers": headers,
			"data" : params
		},
		columns : columns,
		columnDefs : columnDefs
	});
	
	return oTable;
}

/*
	-------------------------------
	- CSS 정의 예시
	-------------------------------
		<style type="text/css">
			#dataTable th {text-align: center;}
			#dataTable .dt-center {text-align: center; vertical-align: middle;}
			#dataTable .dt-right {text-align: right; vertical-align: middle;}
			#dataTable .dt-left {vertical-align: middle;}
			#dataTable .selected {background-color: #B0BED9;}
		</style>

	-------------------------------
	- columns 예시
	-------------------------------
		thead 의 th 개수와 일치해야 함
		{ data: "id", className: "dt-center", orderable: true }
		...
		...
		{
			render: function(data, type, row) {
				return '<input type="checkbox" name="chk" value="'+row.id+'">';
			}	
		}

	-------------------------------
	- columnDefs 예시
	-------------------------------
		{
			"targets": 1,
			"render": function(data) {
				return '<a href="#">'+data+'</a>';
			}
		}

	-------------------------------
	- Table Row 링크 클릭 예시
	-------------------------------
		$table.children('tbody').on( 'click', 'a', function (e) {
			e.preventDefault();
			var data = oTable.row( $(this).parents('tr') ).data();
			console.log(data);
		});

	-------------------------------
	- Table Row 선택 예시
	-------------------------------
		$table.on('click', 'tr', function() {
			$(this).toggleClass('selected');
			
			var data = oTable.rows('.selected').data();
			console.log( data  );
		});

	-------------------------------
	- Table checkbox 예시
	-------------------------------
		[헤더]
			<th><input type="checkbox" class="form-control" id="check-all"></th>

		[columns]
			{
				render: function(data, type, row) {
					return '<input type="checkbox" name="chk" value="'+row.id+'">';
				}	
			}

		[Script]
			$('#check-all').click(function(){
				var rows = oTable.rows({ 'search': 'applied' }).nodes();
				$('input[type="checkbox"]', rows).prop('checked', this.checked);
			});

			$('#btn').click(function(){
				var rowcollection =  oTable.$(":checked", {"page": "all"});
				var items = [];
				rowcollection.each(function(index, elem){
					items.push($(elem).val());
				});
				console.log(items);
			});

*/