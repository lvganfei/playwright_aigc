import { test, Page, BrowserContext } from '@playwright/test';
import fs from 'fs/promises';

test('MSD手册主动脉夹层测试', async ({ page }: { page: Page; context: BrowserContext }) => {
  // 步骤1：导航至症状查询页面
  await page.goto('https://www.msdmanuals.cn/home/symptoms');
  
  // 步骤2：定位搜索框并输入关键词
  const searchInput = page.locator('input[role="combobox"][placeholder="搜索"]');
  await searchInput.fill('主动脉夹层');
  await searchInput.press('Enter');

  // 步骤3：增加全局超时配置
  test.setTimeout(60000);

  // 步骤4：等待加载完成并添加重试逻辑
  try {
    await page.waitForSelector('.loading-overlay', { 
      state: 'detached',
      timeout: 30000 
    });
  } catch (error) {
    await page.screenshot({ path: 'test-results/loading-timeout.png' });
    throw new Error('Loading overlay did not disappear within 30 seconds');
  }

  // 步骤5：优化选择器并添加显式等待
  const topicLink = page.locator('a.AllSearchItems_title__9c_2j:has-text("主动脉夹层")').first();
  await topicLink.waitFor({ 
    state: 'visible', 
    timeout: 30000 
  });

  // 添加元素截图用于调试
  await topicLink.screenshot({ path: 'test-results/topic-link.png' });
  
  // 点击前等待元素可交互
  await topicLink.click({ 
    timeout: 15000,
    force: true 
  });

  // 步骤5：等待新页面加载完成
  await page.waitForLoadState('networkidle');

  // 提取页面文本内容
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });

  // 创建存储目录（如果不存在）
  await fs.mkdir('test-results', { recursive: true });
  
  // 保存结果到JSON文件
  await fs.writeFile(
    'test-results/msdmanual_aorta.json',
    JSON.stringify({ content }, null, 2),
    'utf-8'
  );
});
