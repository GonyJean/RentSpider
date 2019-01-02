# RentSpider 

#### 目前阶段:爬虫完善ing...  
---
## 启动
1. mongod --dbpath=c:/mdb
2. npm i 
3. npm start 

## 爬虫
爬取58租房栏目信息,存储本地mongdb  
2018年10月31日 目前完成了基本爬虫框架 包含IP池获取,DOM信息存储,百度地图经纬度转换  
2018年11月6日 完成字体转换,抓取数据新增了户型和面积,个人房源暂未做转换后面有时间再弄  
2018年12月 开始着重维护ip池 目前完成了ip抓取 ip筛选。现在ip源来自国外，质量比较高。

![1](D:\spider\RentSpider\img\1.png)  

![2](D:\spider\RentSpider\img\2.png)

## 前端
最终决定用React来做了
## 后台
nodeJS