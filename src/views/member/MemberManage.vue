<template>
  <div>
    <Card>
      <p slot="title">
        会员管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          <div class="poptip">
            <Poptip
              trigger="hover"
              content="请输入用户名、邮箱、手机号、姓名搜索"
              placement="bottom-start"
            >
              <Input
                placeholder="请输入用户名、邮箱、手机号、姓名搜索"
                v-model.trim="filterSearch.account"
                style="width: 300px"
              />
            </Poptip>
          </div>

          <div class="poptip">
            <span>会员状态：</span>
            <Select v-model="filterSearch.commonStatus">
              <Option
                v-for="item in memberStatusArr"
                :value="item.status"
                :key="item.status"
                >{{ item.text }}</Option
              >
            </Select>
          </div>

          <div class="poptip">
            <span>是否代理商：</span>
            <Select v-model="filterSearch.superPartner">
              <Option
                v-for="item in superPartnerArr"
                :value="item.value"
                :key="item.value"
                >{{ item.text }}</Option
              >
            </Select>
          </div>

          <div class="btns">
            <Button type="info" size="small" @click="searchByFilter"
              >搜索</Button
            >
          </div>
        </div>
    
        <div class="btnsWrapper clearfix">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            @on-change="exportDateRange"
            placeholder="导出时间区间(最多选择7天)"
          >
          </DatePicker>
          <Button type="success"
          @click="exportExcel">导出</Button>
        </div>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
        <Table
          :columns="columns_first"
          :data="userpage"
          border
          :loading="ifLoading"
          ref="tabel"
          class="user_center"
        >
        </Table>
      </Row>

      <Row class="pageWrapper">
        <Page
          :total="totalNum"
          style="margin-top:8px"
          :current="currentPageIdx"
          @on-change="changePage"
          show-elevator
        ></Page>
      </Row>
    </Card>
    <Modal
      class="auditModel"
      v-model="detailModel"
      title="增加邀请关系"
      @on-ok="setInviterDetail"
    >
      <ul>
        <li>
          <span><i>*</i>ID：</span>
          <p>
            <Input v-model.trim="this.userId" disabled></Input>
            <span>{{}}</span>
          </p>
        </li>
        <li>
          <span><i>*</i>设置邀请人的id：</span>
          <p><Input v-model.trim="inviterId"></Input></p>
          <!--                    <p> <Input v-model.trim="inviterId"></Input> </p>-->
        </li>
      </ul>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util";
import { setStore, getStore, removeStore } from "@/config/storage";
import {
  memberManage,
  forbiddenMember,
  forbiddenMemberTrans,
  setSuperPartner,
  setInviter,
  exportMemberList
} from "@/service/getData";

export default {
  data() {
    return {
      exportParam: {
        endTime: null,
        startTime: null,
      },
      currentPageIdx: 1,
      filterSearch: {
        account: "",
        commonStatus: "",
        superPartner: "",
      },
      //弹窗和信息
      detailModel: false,
      userId: "",
      inviterId: null,
      memberStatusArr: [
        { status: 0, text: "正常" },
        { status: 1, text: "非法" },
        { status: "", text: "全部" },
      ],
      superPartnerArr: [
        { value: "0", text: "否" },
        { value: "1", text: "是" },
      ],
      totalNum: null,
      ifLoading: true,
      usemmuber: "",
      pageIndex: 1,
      loading: true,
      columns_first: [
        /* {
          type: "selection",
          width: 60,
        }, */
        {
          title: "会员ID",
          key: "id",
          minWidth: 80,
        },
        {
          title: "会员名称",
          key: "username",
          minWidth: 170,
        },
        {
          title: "手机号码",
          key: "mobilePhone",
          minWidth: 115,
        },
        {
          title: "会员等级",
          key: "memberLevel",
          minWidth: 90,
          render: (h, obj) => {
            let memberLevel = obj.row.memberLevel;
            let memberLevelTxt = null;
            if (!memberLevel) memberLevelTxt = "普通会员";
            else if (memberLevel === 1) memberLevelTxt = "实名";
            else if (memberLevel === 2) memberLevelTxt = "认证";
            return h("span", {}, memberLevelTxt);
          },
        },
        {
          title: "真实姓名",
          key: "realName",
          minWidth: 90,
        },
        {
          title: "邀请者ID",
          key: "inviterId",
          minWidth: 90,
        },
        {
          title: "注册时间",
          minWidth: 155,
          key: "registrationTime",
        },
        {
          title: "交易状态",
          key: "transactionStatus",
          minWidth: 90,
          render: (h, obj) => {
            let userStatus = obj.row.transactionStatus;
            let statusTxt = !userStatus ? "禁用" : "正常";
            return h("span", {}, statusTxt);
          },
        },

        {
          title: "状态",
          minWidth: 90,
          key: "status",
          render: (h, obj) => {
            let userStatus = obj.row.status;
            let statusTxt = null;
            userStatus === 0 ? (statusTxt = "正常") : (statusTxt = "非法");

            return h("span", {}, statusTxt);
          },
        },
        {
          title: "会员邮箱",
          key: "email",
          minWidth: 170,
        },
        {
          title: "代理商",
          key: "superPartner",
          minWidth: 100,
          render: (h, obj) => {
            let superPartner = obj.row.superPartner;
            let text = null;
            superPartner == 0 && (text = "普通会员");
            superPartner == 1 && (text = "超级代理商");
            superPartner == 2 && (text = "超级合伙人");
            return h("span", {}, text);
          },
        },
        {
          title: "操作",
          key: "action",
          minWidth: 250,
          fixed: "right",
          align: "center",
          render: (h, obj) => {
            let memberStatus = !obj.row.status ? 1 : 0;
            let memberTxt = !obj.row.status ? "禁用" : "解禁";
            let memberStatusTrans = !obj.row.transactionStatus ? 1 : 0;
            let memberTxtTrans = !obj.row.transactionStatus
              ? "允许交易"
              : "禁止交易";
            let memberSuperSpartner = obj.row.superPartner === "0" ? "1" : "0";
            let setSuperSpartnerTxt =
              obj.row.superPartner === "0" ? "授权代理商" : "取消代理商";
            // let
            return h("div", {}, [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      removeStore("memberID");
                      setStore("memberID", obj.row.id);
                      this.$router.push("/member/memberdetail");
                    },
                  },
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "10px", marginLeft: "10px" },
                  on: {
                    click: () => {
                      if (obj.row.inviterId != null) {
                        this.$Message.error("已存在邀请人");
                        return;
                      }
                      this.detailModel = true;
                      this.userId = obj.row.id;
                      // this.inviterId = obj.row.inviterId;
                    },
                  },
                },
                "增加邀请关系"
              ),
              h(
                "Dropdown",
                {
                  props: {
                    transfer: true,
                  },
                  on: {
                    "on-click": (name) => {
                      if (name === "forbidden") {
                        forbiddenMember({
                          memberId: obj.row.id,
                          status: memberStatus,
                        })
                          .then((res) => {
                            if (!res.code) {
                              this.$Message.success(res.message);
                            } else this.$Message.error(res.message);
                            this.refreshPage({
                              pageNo: this.currentPageIdx,
                              pageSize: 10,
                              property: "registrationTime",
                              direction: 1,
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else if (name === "forbiddenTrans") {
                        forbiddenMemberTrans({
                          memberId: obj.row.id,
                          status: memberStatusTrans,
                        }).then((res) => {
                          if (!res.code) {
                            this.$Message.success(res.message);
                          } else this.$Message.error(res.message);
                          this.refreshPage({
                            pageNo: this.currentPageIdx,
                            pageSize: 10,
                            property: "registrationTime",
                            direction: 1,
                          });
                        });
                      } else if (name === "setSuperSpartner") {
                        setSuperPartner({
                          memberId: obj.row.id,
                          superPartner: memberSuperSpartner,
                        }).then((res) => {
                          if (!res.code) {
                            this.$Message.success(res.message);
                          } else this.$Message.error(res.message);
                          this.refreshPage({
                            pageNo: this.currentPageIdx,
                            pageSize: 10,
                            property: "registrationTime",
                            direction: 1,
                          });
                        });
                      }
                    },
                  },
                },
                [
                  h(
                    "DropdownMenu",
                    {
                      slot: "list",
                    },
                    [
                      h(
                        "DropdownItem",
                        {
                          props: {
                            name: "forbidden",
                          },
                        },
                        memberTxt
                      ),
                      h(
                        "DropdownItem",
                        {
                          props: {
                            name: "forbiddenTrans",
                          },
                        },
                        memberTxtTrans
                      ),
                      h(
                        "DropdownItem",
                        {
                          props: {
                            name: "setSuperSpartner",
                          },
                        },
                        setSuperSpartnerTxt
                      ),
                    ]
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small",
                      },
                      style: {
                        color: "#2d8cf0",
                        marginRight: "5px",
                      },
                    },
                    "更多"
                  ),
                ]
              ),
            ]);
          },
        },
      ],
      userpage: [],
    };
  },
  methods: {
    refreshPageManual() {
      for (let val in this.filterSearch) {
        this.filterSearch[val] = "";
      }
      this.currentPageIdx = 1;
      this.refreshPage({
        pageNo: 1,
        pageSize: 10,
        property: "registrationTime",
        direction: 1,
      });
    },
    exportDateRange(val) {
      this.exportParam.startTime = val[0] != "" ? val[0] : null;
      this.exportParam.endTime = val[1] != "" ? val[1] : null;
    },
    exportExcel() {
      if(this.exportParam.endTime ==  null || this.exportParam.startTime ==  null) {
        this.$Message.warning('时间范围不能为空')
        return
      }
      if((new Date(this.exportParam.endTime)-new Date(this.exportParam.startTime))/1000/86400>7){
        this.$Message.warning('选择的时间范围不能超过7天');
        return
      }
      exportMemberList(this.exportParam).then((res) => {
        util.putoutTeam("新注册会员列表", res);
      });
      /* this.$refs.tabel.exportCsv({
        filename: "hello",
      }); */
    },
    searchByFilter() {
      this.$store.commit("switchLoading", true);
      memberManage(this.filterSearch)
        .then((res) => {
          if (!res.code) {
            this.ifLoading = false;
            this.userpage = res.data.content;
            this.totalNum = res.data.totalElements;
            this.$store.commit("switchLoading", false);
          } else console.log(this.$Message.error(res.message));
        })
        .catch((err) => console.log(err));
    },

    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.ifLoading = true;
      let obj = Object.assign(
        {
          pageNo: pageIndex,
          pageSize: 10,
          property: "registrationTime",
          direction: 1,
        },
        this.filterSearch
      );
      this.refreshPage(obj);
    },
    setInviterDetail() {
      let params = {
        id: this.userId,
        inviterId: this.inviterId,
      };
      setInviter(params).then((res) => {
        if (!res.code) {
          this.$Message.success("修改成功！");
          this.refreshPageManual();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    refreshPage(obj = {}) {
      this.ifLoading = true;
      memberManage(obj).then((res) => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        }
      });
    },
  },
  mounted() {
    this.refreshPage({
      property: "registrationTime",
      direction: 1,
    });
  },
  // watch: {
  //   // account( newval, oldVal ) {
  //   //   if(!String(newval).length ) {
  //   //     this.refreshPage({  property: 'registrationTime', direction: 1 });
  //   //   }
  //   // }
  // }
};
</script>

<style lang="less" scoped>
.search-mask {
  position: absolute;
  z-index: 8888;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}
</style>
