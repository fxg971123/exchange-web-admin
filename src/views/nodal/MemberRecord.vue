<template>
  <div>
    <Card>
      <p slot="title">
        创世节点购买记录
        <Button type="primary" size="small" @click="refreshData(1)">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper">
          <div class="poptip">
            <Input placeholder="手机号" v-model.trim="param.phone" />
          </div>
          <div class="poptip">
            <span>创世等级：</span>
            <Select v-model="param.csLevel" clearable>
              <Option v-for="item in 7" :value="item" :key="item">{{
                item
              }}</Option>
            </Select>
          </div>
          <div class="poptip">
            <DatePicker
              type="daterange"
              placement="bottom-end"
              @on-change="dateRange"
              placeholder="选择时间区间"
            >
            </DatePicker>
          </div>

          <div class="btns">
            <Button type="info" @click="getData(1)">搜索</Button>
          </div>
        </div>
        <div class="btnsWrapper clearfix">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            @on-change="exportDateRange"
            placeholder="导出时间区间"
          >
          </DatePicker>
          <Button type="success" @click="exportExcel">导出</Button>
        </div>
      </Row>
      <Row class="tableWrapper">
        <Table
          border
          :columns="columns"
          :data="rewardsList"
          :loading="ifLoading"
        >
        </Table>
      </Row>
      <Row class="pageWrapper">
        <Page
          :total="totalNum"
          :current="currentPageIdx"
          :page-size="param.pageSize"
          @on-change="changePage"
          show-elevator
        ></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import util from "@/libs/util";
import titles from "./titles.json";
import { queryMemberRecord,exportMemberRecord } from "@/service/getData";

export default {
  data() {
    return {
      ifLoading: true,
      currentPageIdx: 1,
      totalNum: 0,
      columns: titles.memberRecordColumns,
      rewardsList: [],
      param: {
        pageNo: 1,
        csLevel: null,
        phone: null,
        startTime: null,
        endTime: null,
        pageSize: 20,
      },
      exportParam: {
        endTime: null,
        startTime: null,
      },
    };
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    getData(pageIndex) {
      this.ifLoading = true;
      this.param.pageNo = pageIndex;
      queryMemberRecord(this.param).then((res) => {
        if (!res.code) {
          this.totalNum = res.totalElements;
          this.rewardsList = res.content.filter(
            (i) =>
              (i.mobilePhone = i.mobilePhone == null ? "未填写" : i.mobilePhone)
          );
          this.ifLoading = false;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    dateRange(val) {
      this.param.startTime = val[0] != "" ? val[0] + " 00:00:00" : null;
      this.param.endTime = val[1] != "" ? val[1] + " 23:59:59" : null;
    },
    exportDateRange(val) {
      this.exportParam.startTime = val[0] != "" ? val[0] : null;
      this.exportParam.endTime = val[1] != "" ? val[1] : null;
    },
    exportExcel() {
      exportMemberRecord(this.exportParam).then((res) => {
        util.putoutTeam("创世节点购买记录", res);
      });
    },
    refreshData() {
      this.param.phone = null;
      this.param.startTime = null;
      this.param.endTime = null;
      this.getData(1);
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      const subObj = { pageNo: pageIndex };
      const newParam = Object.assign(subObj, this.param);
      console.debug("newParam", newParam);
      this.getData(pageIndex);
    },
  },
};
</script>
