// 引入必要的模組
require('dotenv').config()
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs'); // 需要添加这一行
const { exec } = require('child_process');
const OpenAI =require('openai');
const app = express();
const PORT = 3002;
// 設定 API 金鑰和端點
const client = new OpenAI({
    api_key:process.env['OPENAI_API_KEY'],
});
const anythingllmApiKey = process.env.ANYTHINGLLM_API_KEY;
const apiEndpoint = 'http://localhost:3000/api/v1/workspace/blockdiagram/chat'; // 替換為您的 ANYTHINGLLM API 端點

// 中間件來解析 JSON 請求
app.use(express.json());

// 提供靜態文件（HTML, CSS, JS 等）
app.use(express.static(path.join(__dirname, 'public')));
app.use('/svg_output', express.static(path.join(__dirname, 'svg_output')));
app.use(express.static(path.join(__dirname)));
// 定義與前端的 POST 請求來代理發送消息給 ANYTHINGLLM
app.post('/api/chat', async (req, res) => {
    const startTime = Date.now(); // 请求开始处理的时间
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'Bad Request: message is required.' });
        }

        // 向 ANYTHINGLLM 發送 POST 請求
        const response = await axios.post(apiEndpoint, {
            message: userMessage,
            mode: 'chat'
        }, {
            headers: {
                'Authorization': `Bearer ${anythingllmApiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 120000
        });

        const endTime = Date.now(); // 请求处理完成的时间

        console.log(`後端處理時間: ${endTime - startTime} 毫秒`);
        // 回應前端
        res.json(response.data);
    } catch (error) {
        // 打印詳細的錯誤信息
        if (error.response) {
            // 來自伺服器的錯誤響應
            console.error('Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // 請求已發出，但沒有收到回應
            console.error('No response received:', error.request);
        } else {
            // 設置請求時發生錯誤
            console.error('Error Message:', error.message);
        }
        res.status(500).json({ error: '伺服器錯誤，請稍後再試。' });
    }
});

app.post('/api/generate-ppt', async (req, res) => {
    const { code, fileName } = req.body;
    if (!code || !fileName) {
        return res.status(400).json({ error: '请求必须包含生成代码和文件名。' });
    }

    const tempJsFile = path.join(__dirname, 'tempPPTGen.js');
    const outputPptx = path.join(__dirname, fileName);
    const svgOutputDir = path.join(__dirname, 'svg_output');

    try {
       

        fs.writeFileSync(tempJsFile, code);


        // 执行生成 PPTX 文件的脚本
        exec(`node ${tempJsFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行代码时发生错误: ${stderr}`);
                return res.status(500).json({ error: '生成 PPTX 文件时发生错误。' });
            }

            console.log(`PPTX 生成輸出: ${stdout}`);
            console.log(`生成的 PPT 文件名: ${fileName}`); // 打印生成的檔名
            console.log(`檔案完整路徑: ${outputPptx}`);    // 打印完整路徑
            
            // 检查生成的文件是否存在
            if (fs.existsSync(outputPptx)) {
                console.log(`檢查的 PPTX 文件路徑: ${outputPptx}`);
                console.log(`執行的命令: python ppt_to_svg.py ${outputPptx} ${svgOutputDir}`);
                
                // 调用 Python 脚本将 PPTX 转换为 SVG
                exec(`python ppt_to_svg.py ${outputPptx} ${svgOutputDir}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`PPTX 转换为 SVG 时发生错误: ${stderr}`);
                        return res.status(500).json({ error: 'PPTX 转换为 SVG 时发生错误。' });
                    }
            
                    console.log(`SVG 转换输出: ${stdout}`);
                    res.json({ message: 'PPTX 转换为 SVG 成功', svgDir: svgOutputDir, fileName });
                });
            } else {
                console.error(`生成的 PPTX 文件不存在: ${outputPptx}`);
                res.status(500).json({ error: '生成的 PPTX 文件不存在。' });
            }
            
        });
    } catch (error) {
        console.error('处理生成 PPTX 的请求时发生错误:', error);
        res.status(500).json({ error: '生成 PPTX 文件时发生错误。' });
    }
});
// 添加获取 SVG 文件列表的路由
app.get('/api/svg-list', (req, res) => {
    const svgOutputDir = path.join(__dirname, 'svg_output');
    
    // 读取 svg_output 目录下的所有 SVG 文件
    fs.readdir(svgOutputDir, (err, files) => {
        if (err) {
            console.error('读取 SVG 文件时发生错误:', err);
            return res.status(500).json({ error: '读取 SVG 文件时发生错误。' });
        }

        // 过滤出 .svg 文件
        const svgFiles = files.filter(file => file.endsWith('.svg'));
        res.json({ svgFiles });
    });
});
app.post('/api/gpt-chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            // 确保这个 return 语句与 res 一起在同一个函数作用域内
            return res.status(400).json({ error: 'Bad Request: message is required.' });
        }

        // 构建 GPT 提示
        const gptPrompt = `幫我用verilog寫一個"${userMessage}"電路。`;

        // 向 GPT 发送请求
        const gptResponse = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant who is proficient in Verilog." },
                { role: "user", content: gptPrompt }
            ],
            max_tokens: 700,
            temperature: 0.7
        });

        const gptOutput = gptResponse.choices[0]?.message?.content || 'GPT 无回應';

        // 打印 GPT 输出
        console.log('GPT Output:', gptOutput);

        // 回应前端
        res.json({ gptOutput });
    } catch (error) {
        // 打印详细的错误信息
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        res.status(500).json({ error: '服务器错误，请稍后再试。' });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
});
