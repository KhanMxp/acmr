<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/jsp/common/taglibs.jsp"%> 


<div class="form-group">
	<label class="col-sm-2 control-label">同义词</label>
	<div class="col-sm-5">
		<label><button type="button" class="btn btn-primary J_add_synonym">新增同义词</button></label>
		<input type="hidden" name="synonym" autocomplete="off" value="${tyc}">

		<div style="overflow-y: auto; max-height: 161px; border-top: 1px solid #ddd;">
			<table class="table table-hover table-bordered J_synonym_table">
				<tbody>
					<c:forEach items="${list}" var="list" varStatus="status">
						<tr>
							<td>
								<span class="item">${list.cname}</span>
								<input type="text" class="synonym_text">
								<span class="glyphicon glyphicon-pencil btn-sm"></span>
								<span class="glyphicon glyphicon-trash btn-sm"></span>
							</td>
						</tr>
					</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
</div>