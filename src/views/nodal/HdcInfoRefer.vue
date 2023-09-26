<template>
  <div>
    <Card>
      <p slot="title">
        创世节点信息查询
        <Button type="primary" size="small" @click="refreshData(1)">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper">
          <div class="poptip">
            <Input placeholder="用户手机号" v-model.trim="param.phone" />
          </div>

          <div class="poptip">
            <span>创世等级：</span>
            <Select v-model="param.memberStar" clearable>
              <Option v-for="item in 7" :value="item" :key="item">{{
                item
              }}</Option>
            </Select>
          </div>

          <div class="btns">
            <Button type="info" @click="getData(1)">搜索</Button>
          </div>
        </div>
        <div class="btnsWrapper clearfix">
       
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
import { queryHdcInfoRefer,exportMemberInfo } from "@/service/getData";

export default {
  data() {
    return {
      ifLoading: true,
      currentPageIdx: 1,
      totalNum: 0,
      columns: titles.HdcInfoReferColumns,
      rewardsList: [],
      param: {
        pageNo: 1,
        phone: null,
        memberStar: null,
        pageSize: 20,
      }
    };
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    getData(pageIndex) {
      this.ifLoading = true;
      this.param.pageNo = pageIndex;
      queryHdcInfoRefer(this.param).then((res) => {
        if (!res.code) {
          this.totalNum = res.totalElements;
          this.rewardsList = res.content
            .filter(
              (i) =>
                (i.mobilePhone =
                  i.mobilePhone == null ? "未填写" : i.mobilePhone)
            )
            .filter(
              (i) =>
                (i.toMobilePhone =
                  i.toMobilePhone == null ? "无" : i.toMobilePhone)
            )
            .filter(
              (i) =>
                (i.toMemberFirstTime =
                  i.toMemberFirstTime == null ? "--" : i.toMemberFirstTime)
            )
            .filter(
              (i) =>
                (i.toMemberStar =
                  i.toMemberStar == null ? "无" : i.toMemberStar)
            );
          this.ifLoading = false;
        } else {
          const errText = res.code == 500 ? "服务器错误" : res.message;
          this.$Message.error(errText);
          this.ifLoading = false;
        }
      });
    },

    exportExcel() {
      exportMemberInfo({}).then((res) => {
        util.putoutTeam("创世节点信息查询", res);
      });
    },
    refreshData() {
      this.param.phone = null;
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
