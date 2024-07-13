// ==UserScript==
// @name         Arxiv TOC Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在arxiv论文页面添加目录导航功能
// @author       Your Name
// @match        *://ar5iv.labs.arxiv.org/html/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.style.position = 'fixed';
    tocContainer.style.left = '0';
    tocContainer.style.top = '0';
    tocContainer.style.width = '220px';
    tocContainer.style.height = '100%';
    tocContainer.style.overflowY = 'scroll';
    tocContainer.style.backgroundColor = '#fff';
    tocContainer.style.borderRight = '1px solid #ccc';
    tocContainer.style.padding = '20px 10px';
    tocContainer.style.zIndex = '1000';
    tocContainer.style.boxShadow = '2px 0 5px rgba(0,0,0,0.1)';
    tocContainer.style.borderRadius = '0 10px 10px 0';
    document.body.appendChild(tocContainer);

    // 添加标题
    const tocTitle = document.createElement('h2');
    tocTitle.textContent = '目录';
    tocTitle.style.fontFamily = 'Arial, sans-serif';
    tocTitle.style.fontSize = '1.5em';
    tocTitle.style.marginBottom = '20px';
    tocTitle.style.color = '#333';
    tocContainer.appendChild(tocTitle);

    // 提取小标题并生成目录
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach((header, index) => {
        const tocItem = document.createElement('div');
        tocItem.textContent = header.textContent;
        tocItem.style.cursor = 'pointer';
        tocItem.style.marginLeft = `${(parseInt(header.tagName[1]) - 1) * 10}px`;
        tocItem.style.padding = '5px 0';
        tocItem.style.fontFamily = 'Arial, sans-serif';
        tocItem.style.fontSize = '0.9em';
        tocItem.style.color = '#333';
        tocItem.classList.add('toc-link');
        tocItem.onmouseover = () => tocItem.style.color = '#007BFF';
        tocItem.onmouseout = () => {
            if (!tocItem.classList.contains('active')) {
                tocItem.style.color = '#333';
            }
        };
        tocItem.onclick = () => {
            header.scrollIntoView({ behavior: 'smooth' });
        };
        tocContainer.appendChild(tocItem);

        // 添加锚点
        const anchor = document.createElement('a');
        anchor.name = `toc-${index}`;
        header.parentNode.insertBefore(anchor, header);
    });

    // 样式调整
    const style = document.createElement('style');
    style.textContent = `
        .toc-link:hover {
            color: #007BFF;
        }
        .toc-link.active {
            color: #007BFF;
            font-weight: bold;
        }
        h2 {
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        div {
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(style);

    // 监听滚动事件，更新当前章节的高亮显示
    window.addEventListener('scroll', () => {
        let current = '';
        headers.forEach((header) => {
            const rect = header.getBoundingClientRect();
            if (rect.top <= 100) {
                current = header.previousElementSibling.name;
            }
        });

        document.querySelectorAll('.toc-link').forEach((link, index) => {
            link.classList.remove('active');
            if (`toc-${index}` === current) {
                link.classList.add('active');
            }
        });
    });
})();

