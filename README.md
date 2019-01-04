# RentSpider 
<font face="黑体" color="red">由GonyMaster发起的业余项目，旨在分析各个城市的房租（房价）数据。</font>  

#### 目前阶段:爬虫完善ing...  
---
## 启动
1. mongod --dbpath=c:/mdb
2. npm i 
3. npm start 

## 爬虫
爬取58租房栏目信息,存储本地mongdb  
2018年10月31日 目前完成了基本爬虫框架 包含IP池获取,DOM信息存储,百度地图经纬度转换。 
2018年11月6日 完成字体转换,抓取数据新增了户型和面积,个人房源暂未做转换后面有时间再弄。  
2018年12月 开始着重维护ip池。目前完成了ip抓取、ip筛选。现在ip源来自国外，质量比较高。  
2019年1月 完成了个人房源转换 保存页数 并发控制在3以确保被爬网页不封IP。  

![1](https://github.com/RentSpider/RentSpider/blob/master/img/1.png?raw=true)  

![2](https://github.com/RentSpider/RentSpider/blob/master/img/2.png?raw=true)

### 抓取的信息格式
  ``` js
    { 
    "_id" : ObjectId("5c2ec84ae6fe663568a05df0"), 
    "url" : "//short.***.com/zd_p/01d29255-4e1c-4358-8624-a34905577d01/?target=qc-16-xgk_hvimob_89980114658153q-feykn&end=end", 
    "title" : "整租|2000元全包精装太原路友谊路103平米三室两厅一", 
    "sum" : "2000", 
    "villageName" : "尚城小区", 
    "road" : "北京路", 
    "area" : "新市", 
    "payWay" : "半年付", 
    "isPerson" : "0", 
    "postTime" : "2019/01/04", 
    "location" : {
        "lng" : "87.5492187964", 
        "lat" : "43.8983242906"
    }, 
    "cm" : "102㎡", 
    "huxing" : "3室2厅1卫", 
    "__v" : NumberInt(0)
}
  ```
## 前端
最终决定用React来做了
## 后台
nodeJS
