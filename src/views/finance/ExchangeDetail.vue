<template>
    <div>
        <Card>
            <p slot="title">
                兑换明细
                <Button type="primary" size="small" @click="refreshPageManual">
                    <Icon type="refresh"></Icon>
                    刷新
                </Button>
            </p>
            <Row class="tradeRecord">
                <div class="tableWrapper">
                    <Table :columns="columns" :data="list"></Table>
                    <Page :total="total" :page-size=10  @on-change="changePage"></Page>
                </div>
                <p class="line"></p>
            </Row>
        </Card>
    </div>
</template>

<script>
    import { exchangeDetail } from '@/service/getData';
    const getParamsFun = (pageSize) => (pageNo) => (realName) => (mobilePhone) => (email) => ({
        pageNo, pageSize, realName, mobilePhone, email
    });
    const getParams = getParamsFun(10);
    export default {
        data() {
            return {
                list: [],
                total: 0,
                realName: "",
                pageNo: 1,
                mobilePhone: "",
                email: "",
                currentPageIdx: 1,
                ifLoading: true,
                columns: [
                    {
                        title: "兑换账号",
                        key:"memberRealName"
                    },
                    {
                        title: "时间",
                        key:"createTime"
                    },
                    {
                        title: "数量",
                        key:"amount"
                    },
                    {
                        title: "币种",
                        key:"symbol"
                    },
                    {
                        title: "兑换码",
                        key:"exchangeCode"
                    }
                ]
            }
        },
        methods: {
            init() {
                const params = getParams(this.pageNo)(this.realName)(this.mobilePhone)(this.email);
                exchangeDetail(params).then(res => {
                    if (!res.code) {
                        console.log(res.data.content)
                        this.ifLoading = false;
                        this.list = res.data.content;
                        this.total = res.data.totalElements;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            refreshPageManual() {
                this.realName = "";
                this.currentPageIdx = 1;
                this.pageNo = 1;
                this.mobilePhone = "";
                this.email = "";
                this.init();
            },
            search() {
                this.pageNum = this.currentPageIdx = 1;
                this.init();
            },
            changePage(index) {
                this.pageNo = this.currentPageIdx = index;
                this.init();
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style>

</style>
