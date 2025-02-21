let lastUserMessage = "";
document.getElementById("send-button").addEventListener("click", function () {
    const userMessage = document.getElementById("user-input").value.trim();
    if (userMessage !== "") {
        lastUserMessage = userMessage; // 存储这次的用户输入
        appendMessage("user", userMessage);
        document.getElementById("user-input").value = "";

        // 调用后端的 /api/chat 以获取回应
        sendMessageToLLM(userMessage).then(response => {
            if (response && response.textResponse) {
                appendMessage("llm", response.textResponse);

                // 提取代码并执行
                const code = extractCodeFromResponse(response.textResponse);
                if (code) {
                    executePPTGenCode(code);
                } else {
                    console.error("未找到有效的JavaScript代码");
                }
            } else {
                appendMessage("llm", "对不起，服务器目前无法处理您的请求，请稍后再试。");
            }
        });
    }
});

document.getElementById("send-to-gpt-button").addEventListener("click", function () {
    if (lastUserMessage) {
        sendMessageToGPT(lastUserMessage);
    } else {
        alert("沒有可用的用戶消息可以發送給 GPT。");
    }
});

document.getElementById("download-ppt-button").addEventListener("click", function () {
    const pptFileName = window.generatedPptFileName || "output.pptx"; // 使用檔名或默認值
    const pptUrl = `/${pptFileName}`; // 根據檔名構建 URL

    console.log("下載按鈕觸發，使用的 PPT 文件名:", pptFileName);
    console.log("構建的下載 URL:", pptUrl);

    // 創建隱藏的 <a> 元素以觸發下載
    const link = document.createElement("a");
    link.href = pptUrl;
    link.download = pptFileName; // 設定下載的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 點擊後移除元素
});



// 發送消息給 GPT，並顯示 GPT 的回覆
async function sendMessageToGPT(message) {
    createNewGptReply("正在生成中請稍後...");
    try {
        const response = await fetch('/api/gpt-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (response.ok) {
            const data = await response.json();
            // 此处使用 createNewGptReply，而不是 appendMessage
            createNewGptReply(data.gptOutput);
        } else {
            console.error('Error:', response.status, response.statusText);
            createNewGptReply("gpt", "GPT 服务器响应失败，请稍后重试。");
        }
    } catch (error) {
        console.error('Network Error:', error);
        createNewGptReply("gpt", "网络错误，无法连接到 GPT 服务器。");
    }
}

// 創建一個新的 GPT 回覆框並滾動到該位置
function createNewGptReply(gptOutput) {
    const gptRepliesContainer = document.getElementById("gpt-replies");
    const replyDiv = document.createElement("div");
    replyDiv.classList.add("gpt-reply");
    gptRepliesContainer.appendChild(replyDiv);

    let index = 0;
    const prefix = "system: ";
    replyDiv.innerHTML = prefix;
    let htmlMessage = "";

    // 使用逐字生成的方式显示 GPT 的回复
    const interval = setInterval(() => {
        htmlMessage += gptOutput[index];
        replyDiv.innerHTML = `${prefix}${marked.parse(htmlMessage)}`;
        index++;
        gptRepliesContainer.scrollTop = gptRepliesContainer.scrollHeight;

        if (index >= gptOutput.length) {
            clearInterval(interval);
            // 高亮代码块
            replyDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }, 20);

    // 滾動到最新的 GPT 回覆
    replyDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}



async function sendMessageToLLM(message) {
    const startTime = performance.now();
    appendMessage("llm", "機器人正在生成回复，這可能需要一些時間...");

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        clearLastMessage();
        const endTime = performance.now();
        console.log(`API 请求响应时间: ${endTime - startTime} 毫秒`);

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
    return null;
}


function clearLastMessage() {
    const chatBox = document.getElementById("chat-box");
    if (chatBox.lastChild && chatBox.lastChild.textContent.includes("機器人正在输入...")) {
        chatBox.removeChild(chatBox.lastChild);
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "llm-message");
    chatBox.appendChild(messageDiv);

    if (sender === "user") {
        messageDiv.textContent = `您: ${message}`;
    } else {
        let index = 0;
        const prefix = "機器人: ";
        messageDiv.innerHTML = prefix;
        let htmlMessage = "";

        const interval = setInterval(() => {
            htmlMessage += message[index];
            messageDiv.innerHTML = `${prefix}${marked.parse(htmlMessage)}`;
            index++;
            chatBox.scrollTop = chatBox.scrollHeight;

            if (index >= message.length) {
                clearInterval(interval);
                messageDiv.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 20);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function extractCodeFromResponse(responseText) {
    const codeBlockRegex = /```javascript\s*([\s\S]*?)\s*```/;
    const match = codeBlockRegex.exec(responseText);
    if (match && match[1]) {
        const code = match[1].trim();
        
        // 使用正则表达式提取文件名
        const fileNameMatch = /pres\.writeFile\(\{\s*fileName:\s*['"](.+?)['"]\s*\}\)/.exec(code);
        const fileName = fileNameMatch ? fileNameMatch[1] : "output.pptx"; // 默认文件名为 output.pptx

        return { code, fileName };
    }
    return null;
}
function executePPTGenCode(codeObj) {
    const { code, fileName } = codeObj;

    fetch('/api/generate-ppt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, fileName })
    }).then(response => response.json())
    .then(data => {
        if (data.svgDir) {
            displaySvgFiles(data.svgDir);
             // 儲存動態生成的 PPT 檔名
             window.generatedPptFileName = data.fileName;
             console.log("接收到的 PPT 文件名:", window.generatedPptFileName);
        } else {
            console.error("SVG 转换失败。");
        }
    }).catch(error => {
        console.error("请求生成 PPTX 时发生错误:", error);
    });
}
function displaySvgFiles(svgDir) {
    fetch('/api/svg-list')
        .then(response => response.json())
        .then(data => {
            const svgPreview = document.getElementById("svg-preview");

            // 清除之前的 SVG 預覽
            svgPreview.innerHTML = '';

            if (data.svgFiles && data.svgFiles.length > 0) {
                // 加載新的 SVG 文件
                data.svgFiles.forEach(svgFile => {
                    const img = document.createElement("img");
                    // 添加時間戳避免緩存
                    img.src = `/svg_output/${svgFile}?t=${new Date().getTime()}`;
                    img.alt = svgFile;
                    svgPreview.appendChild(img);
                });
            } else {
                console.error("沒有找到 SVG 文件。");
                svgPreview.innerHTML = '<p>沒有找到 SVG 文件。</p>';
            }
        })
        .catch(error => {
            console.error("加載 SVG 文件時發生錯誤:", error);
            const svgPreview = document.getElementById("svg-preview");
            svgPreview.innerHTML = '<p>加載 SVG 文件時發生錯誤。</p>';
        });
}


