const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 字符数组
const chars = ['L', 'O', 'V', 'E'];
const drops = [];
let codeRainStarted = false; // 控制代码雨是否开始
let codeRainOpacity = 0; // 控制代码雨的透明度，用于渐显效果

// 初始化雨滴
function initDrops() {
    const columns = Math.floor(canvas.width / 20); // 每列宽度为20像素
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}
initDrops();

// 绘制代码雨
function draw() {
    // 如果代码雨还没开始，直接返回
    if (!codeRainStarted) return;
    
    // 设置半透明黑色背景，形成拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置文字样式，使用透明度控制渐显效果
    ctx.fillStyle = `rgba(255, 105, 180, ${codeRainOpacity})`; // 粉色带透明度
    ctx.font = '20px "JetBrains Mono", monospace';
    
    // 如果透明度还没达到1，逐渐增加
    if (codeRainOpacity < 1) {
        codeRainOpacity += 0.01; // 控制渐显速度
    }

    // 绘制每一列
    for (let i = 0; i < drops.length; i++) {
        // 随机选择字符
        const char = chars[Math.floor(Math.random() * chars.length)];

        // 绘制字符
        const x = i * 20;
        const y = drops[i] * 20;
        ctx.fillText(char, x, y);

        // 如果雨滴到底部或随机重置，则重置到顶部
        if (y > canvas.height || Math.random() > 0.98) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

// 动画循环
setInterval(draw, 30); // 约30帧每秒

// 页面加载完成后，设置音乐和图片
document.addEventListener('DOMContentLoaded', function() {
    // 设置背景音乐
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.src = '1.mp3';
    }
    
    // 设置照片
    const photoImg = document.querySelector('.photo-frame img');
    if (photoImg) {
        photoImg.src = '1.png';
    }
    
    // 监听开始按钮点击事件，开始代码雨
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            // 不要立即开始代码雨，由烟花动画结束后触发
            
            // 清除画布，准备开始代码雨
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }
    
    // 创建一个全局函数，用于在烟花结束后显示过渡文字和开始代码雨
    window.showTransitionText = function() {
        // 创建一个新的画布元素用于显示过渡文字
        const textCanvas = document.createElement('canvas');
        textCanvas.width = window.innerWidth;
        textCanvas.height = window.innerHeight;
        textCanvas.style.position = 'absolute';
        textCanvas.style.top = '0';
        textCanvas.style.left = '0';
        textCanvas.style.zIndex = '3';
        textCanvas.style.pointerEvents = 'none';
        document.body.appendChild(textCanvas);
        
        const textCtx = textCanvas.getContext('2d');
        
        // 文字渐显动画
        let textOpacity = 0;
        const fadeInText = function() {
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            
            // 设置文字样式
            textCtx.font = '36px "Microsoft YaHei", sans-serif';
            textCtx.fillStyle = `rgba(255, 105, 180, ${textOpacity})`;
            textCtx.textAlign = 'center';
            textCtx.textBaseline = 'middle';
            
            // 绘制文字
            textCtx.fillText("莹莹,快看,粉色的代码雨", textCanvas.width / 2, textCanvas.height / 2);
            
            textOpacity += 0.03; // 加快渐显速度
            
            if (textOpacity < 1) {
                requestAnimationFrame(fadeInText);
            } else {
                // 文字完全显示后，立即开始代码雨并淡出文字
                setTimeout(function() {
                    // 开始代码雨
                    codeRainStarted = true;
                    codeRainOpacity = 0; // 从透明开始
                    
                    // 淡出文字
                    const fadeOutText = function() {
                        textOpacity -= 0.03; // 加快渐隐速度
                        
                        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
                        textCtx.fillStyle = `rgba(255, 105, 180, ${textOpacity})`;
                        textCtx.fillText("莹莹,快看,粉色的代码雨", textCanvas.width / 2, textCanvas.height / 2);
                        
                        if (textOpacity > 0) {
                            requestAnimationFrame(fadeOutText);
                        } else {
                            // 移除文字画布
                            document.body.removeChild(textCanvas);
                        }
                    };
                    
                    fadeOutText();
                }, 2000); // 缩短等待时间为0.5秒
            }
        };
        
        fadeInText();
    };
});