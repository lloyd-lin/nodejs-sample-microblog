console.log('Hello, TypeScript Node.js Project! 🚀');

// 简单的示例函数
function greet(name: string): string {
  return `Hello, ${name}! Welcome to the microblog project.`;
}

// 使用示例
const message = greet('Developer');
console.log(message);

// 导出供其他模块使用
export { greet }; 