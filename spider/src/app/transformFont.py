# -*- coding: utf-8 -*-
from fontTools.ttLib import TTFont     # 导包
font = TTFont('./font.woff')    # 打开文件
font.saveXML('./6329.xml')     # 转换成 xml 文件并保存


# wordList = [0,1,2,3,4,5,6,7,8,9]

# print(utf8List)