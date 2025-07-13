const fs = require('fs');
const path = require('path');
const mammoth = require('../mcp_server/node_modules/mammoth');

/**
 * 读取Word文档
 */
async function readWordFile(filePath) {
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absPath)) {
        throw new Error(`文件不存在: ${absPath}`);
    }
    const result = await mammoth.extractRawText({ path: absPath });
    return result.value;
}

/**
 * 解析简历内容为JSON结构
 */
function parseResumeToJSON(content) {
    const resume = {
        personalInfo: {},
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
        languages: [],
        certifications: [],
        awards: [],
        rawContent: content
    };

    // 分行处理
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection = '';
    let currentExperience = null;
    let currentProject = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        
        // 检测个人信息
        if (line.includes('@') && line.includes('.')) {
            resume.personalInfo.email = line;
        } else if (/^1[3-9]\d{9}$/.test(line.replace(/[\s-]/g, ''))) {
            resume.personalInfo.phone = line;
        } else if (line.includes('LinkedIn') || line.includes('linkedin')) {
            resume.personalInfo.linkedin = line;
        } else if (line.includes('GitHub') || line.includes('github')) {
            resume.personalInfo.github = line;
        }
        
        // 检测姓名（通常在开头）
        if (i < 5 && line.length < 20 && !line.includes('@') && !line.includes('http') && /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(line)) {
            if (!resume.personalInfo.name || line.length > (resume.personalInfo.name || '').length) {
                resume.personalInfo.name = line;
            }
        }
        
        // 检测章节标题
        if (line.includes('教育经历') || line.includes('教育背景') || line.includes('Education')) {
            currentSection = 'education';
        } else if (line.includes('工作经历') || line.includes('工作经验') || line.includes('Work Experience') || line.includes('Experience')) {
            currentSection = 'work';
        } else if (line.includes('项目经验') || line.includes('项目经历') || line.includes('Projects')) {
            currentSection = 'projects';
        } else if (line.includes('技能') || line.includes('Skills')) {
            currentSection = 'skills';
        } else if (line.includes('语言') || line.includes('Languages')) {
            currentSection = 'languages';
        } else if (line.includes('证书') || line.includes('认证') || line.includes('Certifications')) {
            currentSection = 'certifications';
        } else if (line.includes('获奖') || line.includes('荣誉') || line.includes('Awards')) {
            currentSection = 'awards';
        }
        
        // 根据当前章节解析内容
        if (currentSection === 'education' && line.includes('大学') || line.includes('学院') || line.includes('University') || line.includes('College')) {
            resume.education.push({
                institution: line,
                degree: nextLine,
                period: ''
            });
        } else if (currentSection === 'work') {
            // 检测公司名称（通常包含有限公司、科技、集团等）
            if (line.includes('有限公司') || line.includes('科技') || line.includes('集团') || line.includes('Corp') || line.includes('Ltd') || line.includes('Inc')) {
                if (currentExperience) {
                    resume.workExperience.push(currentExperience);
                }
                currentExperience = {
                    company: line,
                    position: '',
                    period: '',
                    responsibilities: []
                };
            } else if (currentExperience && line.includes('年') && (line.includes('月') || line.includes('-'))) {
                currentExperience.period = line;
            } else if (currentExperience && (line.includes('工程师') || line.includes('开发') || line.includes('架构师') || line.includes('Engineer') || line.includes('Developer'))) {
                currentExperience.position = line;
            } else if (currentExperience && line.startsWith('·') || line.startsWith('•') || line.startsWith('-')) {
                currentExperience.responsibilities.push(line.substring(1).trim());
            }
        } else if (currentSection === 'projects') {
            if (line.includes('项目') && !line.startsWith('·') && !line.startsWith('•')) {
                if (currentProject) {
                    resume.projects.push(currentProject);
                }
                currentProject = {
                    name: line,
                    description: '',
                    technologies: [],
                    achievements: []
                };
            } else if (currentProject && line.startsWith('·') || line.startsWith('•') || line.startsWith('-')) {
                const content = line.substring(1).trim();
                if (content.includes('技术栈') || content.includes('技术：')) {
                    // 提取技术栈
                    const techMatch = content.match(/[:：](.+)/);
                    if (techMatch) {
                        currentProject.technologies = techMatch[1].split(/[,，、]/).map(t => t.trim());
                    }
                } else {
                    currentProject.achievements.push(content);
                }
            }
        } else if (currentSection === 'skills') {
            if (line.includes(':') || line.includes('：')) {
                const parts = line.split(/[:：]/);
                if (parts.length === 2) {
                    resume.skills.push({
                        category: parts[0].trim(),
                        items: parts[1].split(/[,，、]/).map(s => s.trim()).filter(s => s)
                    });
                }
            }
        }
    }
    
    // 添加最后的项目或工作经历
    if (currentExperience) {
        resume.workExperience.push(currentExperience);
    }
    if (currentProject) {
        resume.projects.push(currentProject);
    }
    
    return resume;
}

async function main() {
    try {
        const resumePath = 'F:\\Lynn\\简历\\LinGao_Resume2025_V2_Pure.docx';
        console.log('读取简历文件:', resumePath);
        
        const content = await readWordFile(resumePath);
        console.log('简历内容读取成功，长度:', content.length);
        
        const resumeJSON = parseResumeToJSON(content);
        console.log('简历解析完成');
        
        // 确保backend目录存在
        const backendDir = path.join(__dirname, '../packages/backend/src/data');
        if (!fs.existsSync(backendDir)) {
            fs.mkdirSync(backendDir, { recursive: true });
        }
        
        // 保存为JSON文件
        const outputPath = path.join(backendDir, 'resume.json');
        fs.writeFileSync(outputPath, JSON.stringify(resumeJSON, null, 2), 'utf8');
        
        console.log('简历JSON已保存到:', outputPath);
        console.log('解析结果预览:');
        console.log('- 姓名:', resumeJSON.personalInfo.name);
        console.log('- 邮箱:', resumeJSON.personalInfo.email);
        console.log('- 工作经历数量:', resumeJSON.workExperience.length);
        console.log('- 项目数量:', resumeJSON.projects.length);
        console.log('- 技能类别数量:', resumeJSON.skills.length);
        
    } catch (error) {
        console.error('处理简历时出错:', error.message);
        process.exit(1);
    }
}

main(); 