// 测试点击聊天按钮
const button = document.querySelector('button[aria-label="robot"]');
if (button) {
  button.click();
  console.log('聊天按钮已点击');
} else {
  console.log('未找到聊天按钮');
}
