import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';

/**
 * 读取本地 Word 文档（.docx）并返回内容字符串
 * @param filePath Word 文件的绝对路径或相对路径
 * @returns Promise<string>
 */
export async function readWordFileToString(filePath: string): Promise<string> {
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absPath)) {
        throw new Error(`文件不存在: ${absPath}`);
    }
    const result = await mammoth.extractRawText({ path: absPath });
    return result.value;
}

// 示例用法
// (async () => {
//     const content = await readWordFileToString('your.docx');
//     console.log(content);
// })(); 