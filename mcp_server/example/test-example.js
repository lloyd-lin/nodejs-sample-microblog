// MCP Server 使用示例
const { readWordFileToString } = require('../dist/index.js');

async function example() {
  console.log('MCP Server - Word Document Reader Example');
  console.log('=========================================');
  
  // 函数可用性测试
  console.log('✓ readWordFileToString function loaded:', typeof readWordFileToString);
  
  // 注意：要测试实际的Word文档读取功能，需要准备一个.docx文件
  console.log('\n要测试实际功能，请使用以下代码：');
  console.log('const content = await readWordFileToString("./your-document.docx");');
  console.log('console.log(content);');
  
  console.log('\n模块导入成功！MCP Server 构建正常。');
}

example().catch(console.error); 