使用playwright-mcp 进行网页自动化测试，将测试脚本保存到 ./tests/msdmanual_aorta.spec.js中。测试步骤：
1. 打开https://www.msdmanuals.cn/home/symptoms ，等待页面加载完毕。
2. 寻找role=combobox，placeholder="搜索"的input元素，找到后输入"主动脉夹层"并回车
3. 等待“加载中”浮层消失后寻找“医学主题”下面的link，它的文本是“主动脉夹层”。点击它。
4. 等待页面加载完成，提取页面纯文本内容输出到./test-results/msdmanual_aorta.json文件中。