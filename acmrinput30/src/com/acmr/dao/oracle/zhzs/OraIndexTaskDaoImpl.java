package com.acmr.dao.oracle.zhzs;

import acmr.data.DataQuery;
import acmr.util.DataTable;
import acmr.util.DataTableRow;
import acmr.util.PubInfo;
import com.acmr.dao.AcmrInputDPFactor;
import com.acmr.dao.zhzs.IIndexTaskDao;
import com.acmr.model.zhzs.TaskZb;
import org.omg.PortableInterceptor.ACTIVE;

import javax.xml.crypto.Data;
import javax.xml.datatype.DatatypeConfigurationException;
import java.sql.SQLException;
import java.util.*;

public class OraIndexTaskDaoImpl implements IIndexTaskDao {
    @Override
    public DataTable getTaskZb(String taskcode){
        String sql = "select * from tb_coindex_task_zb where taskcode= ? ";
        return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql, new Object[]{taskcode});
    }
    @Override
    public  boolean hasTask(String indexcode, String ayearmon) {
        String sql="select * from tb_coindex_task where indexcode=? and ayearmon=?";
        DataTable table= AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{indexcode,ayearmon});
        List<DataTableRow> rows=table.getRows();
        if (rows.size()>0){
            return true;
        }
        else {
            return false;
        }
    }

    @Override
    public int create(String indexcode, String tcode, String ayearmon, String createtime) {
        if (indexcode.length()==0){
            return 0;
        }
        DataQuery dataQuery = null;

        try{

            dataQuery = AcmrInputDPFactor.getDataQuery();
            dataQuery.beginTranse();

            //新增任务
            String sql="insert into tb_coindex_task (code,indexcode,ayearmon,createtime) values (?,?,?,to_date(?,'yyyy-mm-dd hh24:mi:ss'))";
            dataQuery.executeSql(sql,new Object[]{tcode,indexcode,ayearmon,createtime});

            //复制模型tb_coindex_task_module
            String sql1="select * from tb_coindex_module where indexcode=?";
            DataTable table=dataQuery.getDataTableSql(sql1,new Object[]{indexcode});
            List<DataTableRow> rows=table.getRows();
            for (int i=0;i<rows.size();i++){
                //PubInfo.printStr(rows.get(i).getRows().toString());
                String code=UUID.randomUUID().toString().replace("-", "").toLowerCase();
                String orcode=rows.get(i).getString("code");
                String cname=rows.get(i).getString("cname");
                String procode=rows.get(i).getString("procode");
                String ifzs=rows.get(i).getString("ifzs");
                String ifzb=rows.get(i).getString("ifzb");
                String formula=rows.get(i).getString("formula");
                String sortcode=rows.get(i).getString("sortcode");
                String weight=rows.get(i).getString("weight");
                String dacimal=rows.get(i).getString("dacimal");
                String sql2="insert into tb_coindex_task_module (code,cname,taskcode,procode,ifzs,ifzb,formula,sortcode,weight,dacimal,orcode) values(?,?,?,?,?,?,?,?,?,?,?)";
                //String sql3="insert into tb_coindex_task_module_tmp (code,cname,taskcode,procode,ifzs,ifzb,formula,sortcode,weight,dacimal,orcode) values(?,?,?,?,?,?,?,?,?,?,?)";
                dataQuery.executeSql(sql2,new Object[]{code,cname,tcode,procode,ifzs,ifzb,formula,sortcode,weight,dacimal,orcode});
               // dataQuery.executeSql(sql3,new Object[]{code,cname,tcode,procode,ifzs,ifzb,formula,sortcode,weight,dacimal,orcode});
            }

            //修正tb_coindex_task_module的procode
            String sql9="select * from tb_coindex_task_module where taskcode=?";
            DataTable table3=dataQuery.getDataTableSql(sql9,new Object[]{tcode});
            List<DataTableRow> rows3=table3.getRows();
            for (int r=0;r<rows3.size();r++){
                String orprocode=rows3.get(r).getString("procode");
                String code=rows3.get(r).getString("code");
                String sql10="select * from tb_coindex_task_module where orcode=? and taskcode=?";
                if (orprocode!=""){
                    String procode=dataQuery.getDataTableSql(sql10,new Object[]{orprocode,tcode}).getRows().get(0).getString("code");
                    //更新这条module的procode
                    String sql11="update tb_coindex_task_module set procode=? where code=?";
                    dataQuery.executeSql(sql11,new Object[]{procode,code});
                }
            }


            //复制tb_coindex_task_module到tb_coindex_task_module_tmp
            String sql12="insert into tb_coindex_task_module_tmp (select * from tb_coindex_task_module where taskcode=?)";
            dataQuery.executeSql(sql12,new Object[]{tcode});

            //复制指标tb_coindex_task_zb
            String sql4="select * from tb_coindex_zb where indexcode=?";
            DataTable table1=dataQuery.getDataTableSql(sql4,new Object[]{indexcode});
            List<DataTableRow> rows1=table1.getRows();
            for (int j=0;j<rows1.size();j++){
                //PubInfo.printStr(rows1.get(j).getRows().toString());
                String code=UUID.randomUUID().toString().replace("-", "").toLowerCase();
                String zbcode=rows1.get(j).getString("zbcode");
                String company=rows1.get(j).getString("company");
                String datasource=rows1.get(j).getString("datasource");
                String regions=rows1.get(j).getString("regions");
                String datatimes=rows1.get(j).getString("datatimes");
                String unitcode=rows1.get(j).getString("unitcode");
                String dacimal=rows1.get(j).getString("dacimal");
                String procode=rows1.get(j).getString("code");
                String sql5="insert into tb_coindex_task_zb (code,taskcode,zbcode,company,datasource,regions,datatimes,unitcode,dacimal,procode) values(?,?,?,?,?,?,?,?,?,?)";
                dataQuery.executeSql(sql5,new Object[]{code,tcode,zbcode,company,datasource,regions,datatimes,unitcode,dacimal,procode});
            }

            //取数存入tb_coindex_data
            String sql6="select * from tb_coindex_task_zb where taskcode=?";
            DataTable table2=dataQuery.getDataTableSql(sql6,new Object[]{tcode});
            List<DataTableRow> rows2=table2.getRows();
            for (int m=0;m<rows2.size();m++){
                //PubInfo.printStr(rows2.get(m).getRows().toString());
                String code=rows2.get(m).getString("code");
                String zbcode=rows2.get(m).getString("zbcode");
                String company=rows2.get(m).getString("company");
                String datasource=rows2.get(m).getString("datasource");
                String regions=rows2.get(m).getString("regions");
                String unitcode=rows2.get(m).getString("unitcode");
                TaskZb taskZb=new TaskZb(code,tcode,zbcode,company,datasource,regions,unitcode);
                String sql7="select * from tb_coindex_task where code=?";
                String ayearmon1=dataQuery.getDataTableSql(sql7,new Object[]{tcode}).getRows().get(0).getString("ayearmon");
                String zbcode1=taskZb.getCode();

                List<String> regs= Arrays.asList(taskZb.getRegions().split(","));
                List<Double> datas=taskZb.getData(ayearmon1);
                for (int n=0;n<regs.size();n++){
                    String region=regs.get(n);
                    if (datas.get(n)!=null){
                        String data= String.valueOf(datas.get(n));
                        //PubInfo.printStr("data:"+data);
                        String sql8="insert into tb_coindex_data (taskcode,zbcode,region,ayearmon,data) values(?,?,?,?,to_number(?))";
                        dataQuery.executeSql(sql8,new Object[]{tcode,zbcode1,region,ayearmon1,data});
                    }
                    else {
                        String sql8="insert into tb_coindex_data (taskcode,zbcode,region,ayearmon) values(?,?,?,?)";
                        dataQuery.executeSql(sql8,new Object[]{tcode,zbcode1,region,ayearmon1});
                    }
                }
            }

            dataQuery.commit();

        }
        catch (SQLException e){
            if (dataQuery != null) {
                dataQuery.rollback();
                e.printStackTrace();
                return 1;
            }
        }
        finally {
            if (dataQuery != null) {
                dataQuery.releaseConnl();
            }
        }

        return 0;

    }


    @Override
    public DataTable getTaskList(String icode){
        String sql = "select * from tb_coindex_task where indexcode= ? ";
        return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql, new Object[]{icode});
    }
    @Override
    public DataTable findTask(String icode,String time){
        String sql = "select * from tb_coindex_task where indexcode= ? and lower(ayearmon) like?";
        return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql, new Object[]{icode,'%'+time+'%'});
    }

    @Override
    public boolean hasData(String sessionid,String taskcode) {
        String sql="select * from tb_coindex_data_tmp where sessionid=? and taskcode=?";
        DataTable table=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{sessionid,taskcode});
        List<DataTableRow> row=table.getRows();
        String sql1="select * from tb_coindex_data_result_tmp where sessionid=? and taskcode=?";
        DataTable table1=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql1,new Object[]{sessionid,taskcode});
        List<DataTableRow> row1=table1.getRows();
        if (row.size()>0||row1.size()>0){
            return true;
        }
        else {
            return false;
        }
    }
    @Override
    public int delTask(String code){
        StringBuffer sbf = new StringBuffer();
        List<Object> params = new ArrayList<Object>();
        sbf.append("delete from tb_coindex_task t where t.code = ? ");
        params.add(code);
        return AcmrInputDPFactor.getQuickQuery().executeSql(sbf.toString(), params.toArray());
    }

    @Override
    public DataTable getZBs(String taskcode) {
        String sql="select * from tb_coindex_task_zb where taskcode=?";
        DataTable table=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{taskcode});
        return table;
    }

    @Override
    public String getData(String taskcode, String region, String zbcode, String ayearmon) {
        String sql="select * from tb_coindex_data where taskcode=? and region=? and zbcode=? and ayearmon=? ";
        DataTable table=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{taskcode,region,zbcode,ayearmon});
        if (table.getRows().get(0).get("data")!=null){
            String data= String.valueOf(table.getRows().get(0).get("data"));
            return data;
        }
        else return null;
    }

    @Override
    public String getTmpData(String taskcode, String region, String zbcode, String ayearmon, String sessionid) {
        String sql="select * from tb_coindex_data_tmp where taskcode=? and region=? and zbcode=? and ayearmon=? and sessionid=?";
        DataTable table=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{taskcode,region,zbcode,ayearmon,sessionid});
        if (table.getRows().get(0).get("data")!=null){
            String data= String.valueOf(table.getRows().get(0).get("data"));
            return data;
        }
        else return null;
    }

    @Override
    public String getTime(String taskcode) {
        String sql="select * from tb_coindex_task where code=?";
        String ayearmon=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{taskcode}).getRows().get(0).getString("ayearmon");
        return ayearmon;
    }

    @Override
    public String getzbcode(String ZBcode) {
        String sql="select zbcode from tb_coindex_task_zb where code=?";
        return AcmrInputDPFactor.getQuickQuery().getDataScarSql(sql,new Object[]{ZBcode});
    }

    @Override
    public int ReData(String tcode,String sessionid) {
        DataQuery dataQuery=null;
        try{
            dataQuery = AcmrInputDPFactor.getDataQuery();
            dataQuery.beginTranse();

            //删掉tmp表中该session的记录
            String sql="delete from tb_coindex_data_tmp where sessionid=? and taskcode=?";
            dataQuery.executeSql(sql,new Object[]{sessionid,tcode});
    /*String sql="select * from tb_coindex_data_tmp where sessionid=?";
    DataTable table=dataQuery.getDataTableSql(sql,new Object[]{sessionid});
    if (table.getRows().size()>0){
        //表中有session的记录，删掉
        String
    }*/

            //从zb中找筛选条件取数
            String sql6="select * from tb_coindex_task_zb where taskcode=?";
            DataTable table2=dataQuery.getDataTableSql(sql6,new Object[]{tcode});
            List<DataTableRow> rows2=table2.getRows();
            for (int m=0;m<rows2.size();m++){
                //PubInfo.printStr(rows2.get(m).getRows().toString());
                String code=rows2.get(m).getString("code");
                String zbcode=rows2.get(m).getString("zbcode");
                String company=rows2.get(m).getString("company");
                String datasource=rows2.get(m).getString("datasource");
                String regions=rows2.get(m).getString("regions");
                String unitcode=rows2.get(m).getString("unitcode");
                TaskZb taskZb=new TaskZb(code,tcode,zbcode,company,datasource,regions,unitcode);
                String sql7="select * from tb_coindex_task where code=?";
                String ayearmon1=dataQuery.getDataTableSql(sql7,new Object[]{tcode}).getRows().get(0).getString("ayearmon");
                String zbcode1=taskZb.getCode();
                //对每个地区，时间 取值并按序存入tmp表
                List<String> regs= Arrays.asList(taskZb.getRegions().split(","));
                List<Double> datas=taskZb.getData(ayearmon1);
                for (int n=0;n<regs.size();n++){
                    String region=regs.get(n);
                    if (datas.get(n)!=null){
                        String data= String.valueOf(datas.get(n));
                        //PubInfo.printStr("data:"+data);
                        String sql8="insert into tb_coindex_data_tmp (taskcode,zbcode,region,ayearmon,data,sessionid) values(?,?,?,?,to_number(?),?)";
                        dataQuery.executeSql(sql8,new Object[]{tcode,zbcode1,region,ayearmon1,data,sessionid});
                    }
                    else {
                        String sql8="insert into tb_coindex_data_tmp (taskcode,zbcode,region,ayearmon,sessionid) values(?,?,?,?,?)";
                        dataQuery.executeSql(sql8,new Object[]{tcode,zbcode1,region,ayearmon1,sessionid});
                    }
                }
            }

            dataQuery.commit();


        }
        catch (SQLException e){
            if (dataQuery != null) {
                dataQuery.rollback();
                e.printStackTrace();
                return 1;
            }
        }
        finally {
            if (dataQuery != null) {
                dataQuery.releaseConnl();
            }
        }

        return 0;

    }
    @Override
    public DataTable getModuleData(String taskcode){
        String sql = "select * from tb_coindex_task_module_tmp where taskcode = ? and ifzs =0";
        return AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql, new Object[]{taskcode});
    }

    @Override
    public String getIcode(String taskcode) {
        String sql="select * from tb_coindex_task where code=?";
        String icode=AcmrInputDPFactor.getQuickQuery().getDataTableSql(sql,new Object[]{taskcode}).getRows().get(0).getString("indexcode");
        return icode;
    }
/*    public static void main(String[] args) {
        OraIndexTaskDaoImpl oraIndexTaskDao=new OraIndexTaskDaoImpl();
        oraIndexTaskDao.hasTask("R001","2014");
    }*/
}
