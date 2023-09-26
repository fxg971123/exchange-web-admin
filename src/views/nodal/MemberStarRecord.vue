<template>
  <div>
    <Card>
      <p slot="title">
        创世节点升星奖励
        <Button type="primary" size="small" @click="refreshData(1)">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          <div class="poptip">
            <Input placeholder="手机号" v-model.trim="param.phone" />
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
          ref="table"
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
import {
  queryMemberStarRecord,
  exportMemberStarRecord,
} from "@/service/getData";

export default {
  data() {
    return {
      ifLoading: true,
      currentPageIdx: 1,
      totalNum: 0,
      columns: titles.memberStarRecordColumns,
      rewardsList: [],
      param: {
        endTime: null,
        pageNo: 1,
        pageSize: 20,
        phone: null,
        startTime: null,
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
      queryMemberStarRecord(this.param).then((res) => {
        if (!res.code) {
          this.totalNum = res.totalElements;
          this.rewardsList = res.content
            .filter(
              (i) =>
                (i.memberPhone =
                  i.memberPhone == null ? "未填写" : i.memberPhone)
            )
            .filter(
              (i) =>
                (i.toMemberPhone =
                  i.toMemberPhone == null ? "无" : i.toMemberPhone)
            )
            .filter(
              (i) =>
                (i.referrerLevelName =
                  i.referrerLevelName == null ? "未知" : i.referrerLevelName)
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
      exportMemberStarRecord(this.exportParam).then((res) => {
        console.log("导出成功", res);
        util.putoutTeam("升星奖励查询", res);
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
