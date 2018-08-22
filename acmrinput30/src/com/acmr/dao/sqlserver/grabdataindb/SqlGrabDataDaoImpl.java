package com.acmr.dao.sqlserver.grabdataindb;

import acmr.util.DataTable;

import com.acmr.dao.AcmrInputDPFactor;
import com.acmr.dao.grabdataindb.IGrabDataDao;

public class SqlGrabDataDaoImpl implements IGrabDataDao {

	@Override
	public String getOneForInputLog() {
		String sql1 = "select top 1 id from vw_grab_task_log where data_state='2' ";
		return AcmrInputDPFactor.getQuickQuery().getDataScarSql(sql1);
	}

	@Override
	public DataTable getOneLogDataForInput(String logid) {
		String sql1 = "select top 1000 * from vw_grab_task_log_data where log_id=? and state='00'";
		return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql1, new String[] { logid });
	}

	@Override
	public int UpdateLogState(String taskid, int state) {
		String sql1 = "update vw_grab_task_log set data_state=? where id=?";
		return AcmrInputDPFactor.getQuickQuery().executeSql(sql1, new Object[] { state, taskid });
	}

	@Override
	public int UpdateLogDataState(String id, int state, int version) {
		String sql1 = "update vw_grab_task_log_data set state=?,version=? where id=?";
		return AcmrInputDPFactor.getQuickQuery().executeSql(sql1, new Object[] { state, version, id });
	}
	@Override
	public DataTable getDiyDataForInput() {
		String sql1 = "select top 1000 * from TB_INPUT_TMP_DATA_DIY where state='00' order by id";
		return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql1);
	}

	@Override
	public int UpdateDiyDataState(String id, int state, int version) {
		String sql1 = "update TB_INPUT_TMP_DATA_DIY set indbtime=getdate(), state=?,version=? where id=?";
		return AcmrInputDPFactor.getQuickQuery().executeSql(sql1, new Object[] { state,version, id });
	}
}
