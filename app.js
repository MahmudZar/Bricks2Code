document.addEventListener('DOMContentLoaded', () => {

    const ICONS = {
        html: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.83325L3.052 13.7159L8 15.1666L12.978 13.7166L14 1.83325H2ZM11.366 5.86525H6.05L6.16467 7.20925H11.296L10.8787 11.5859L8.048 12.5066L5.194 11.5366L5.002 9.58192H6.35133L6.458 10.5226L8.058 11.0659L9.622 10.5573L9.82 8.55392H4.944L4.56933 4.52059H11.5107L11.366 5.86525Z" fill="currentColor"/></svg>`,
        css: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4841_1028)"><path d="M2 14.5L8 16.5L14 14.5L16 0.5H0M3 6.5H10L11 4.5H2V2.5H14L12 12.5H4V10.5H10V8.5H3" fill="currentColor"/></g><defs><clipPath id="clip0_4841_1028"><rect width="16" height="16" fill="white" transform="translate(0 0.5)"/></clipPath></defs></svg>`,
        js: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4841_1028)"><mask id="mask0_4841_1028" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="17"><path d="M0 0.5H16V16.5H0V0.5Z" fill="white"/></mask><g mask="url(#mask0_4841_1028)"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.5H16V16.5H0V0.5ZM12.2313 13.9133C11.4893 13.9133 11.07 13.5267 10.748 13L9.526 13.71C9.96733 14.582 10.8693 15.2473 12.266 15.2473C13.694 15.2473 14.7573 14.506 14.7573 13.152C14.7573 11.8967 14.036 11.3387 12.7587 10.79L12.3827 10.6293C11.7373 10.3493 11.458 10.1673 11.458 9.716C11.458 9.35133 11.738 9.072 12.178 9.072C12.6093 9.072 12.8873 9.254 13.1453 9.716L14.316 8.96467C13.8207 8.09333 13.134 7.76067 12.178 7.76067C10.8353 7.76067 9.976 8.61933 9.976 9.74733C9.976 10.9707 10.696 11.55 11.7813 12.012L12.1573 12.1733C12.8433 12.4733 13.252 12.656 13.252 13.1713C13.252 13.602 12.854 13.9133 12.2313 13.9133ZM6.40467 13.9033C5.888 13.9033 5.67267 13.55 5.43667 13.13L4.21267 13.8713C4.56733 14.622 5.26467 15.2447 6.468 15.2447C7.80067 15.2447 8.71333 14.536 8.71333 12.9793V7.846H7.21V12.9593C7.21 13.7107 6.898 13.9033 6.404 13.9033" fill="currentColor"/></g></g><defs><clipPath id="clip0_4841_1028"><rect width="16" height="16" fill="white" transform="translate(0 0.5)"/></clipPath></defs></svg>`
    };
    
    let dom, jsonEditor, htmlOutputEditor, cssOutputEditor;

    function init() {
        cacheDomElements();
        injectIcons();
        initEditors();
        initSplitters();
        setupEventListeners();
    }

    function cacheDomElements() {
        dom = {
            convertBtn: document.getElementById('convert-btn'),
            copyHtmlBtn: document.getElementById('copy-html-btn'),
            copyCssBtn: document.getElementById('copy-css-btn'),
            jsonEditor: document.getElementById('json-editor'),
            htmlOutput: document.getElementById('html-output'),
            cssOutput: document.getElementById('css-output'),
            headerActions: document.querySelector('.header-actions'),
            forceIdsCheckbox: document.getElementById('force-ids-checkbox'),
        };
    }

    function injectIcons() {
        document.getElementById('icon-js').innerHTML = ICONS.js;
        document.getElementById('icon-html').innerHTML = ICONS.html;
        document.getElementById('icon-css').innerHTML = ICONS.css;
    }

    function initEditors() {
        const commonConfig = { theme: 'dracula', lineNumbers: true, lineWrapping: true };
        jsonEditor = CodeMirror.fromTextArea(dom.jsonEditor, { ...commonConfig, mode: { name: "javascript", json: true } });
        jsonEditor.setValue(`{\n  "source": "bricksCopiedElements",\n  "sourceUrl": "https://example.com",\n  "version": "1.12.4",\n  "content": [],\n  "globalClasses": [],\n  "globalElements": []\n}`);
        htmlOutputEditor = CodeMirror.fromTextArea(dom.htmlOutput, { ...commonConfig, mode: 'xml', readOnly: true });
        cssOutputEditor = CodeMirror.fromTextArea(dom.cssOutput, { ...commonConfig, mode: 'css', readOnly: true });
    }

    function initSplitters() {
        Split(['#json-panel', '#code-panel'], { sizes: [40, 60], minSize: [300, 400], gutterSize: 8, cursor: 'col-resize' });
        Split(['#html-output-container', '#css-output-container'], { direction: 'vertical', sizes: [60, 40], minSize: 100, gutterSize: 8, cursor: 'row-resize' });
    }

    function setupEventListeners() {
        dom.convertBtn.addEventListener('click', convertBricksToCode);
        dom.copyHtmlBtn.addEventListener('click', () => copyToClipboard(htmlOutputEditor, 'HTML'));
        dom.copyCssBtn.addEventListener('click', () => copyToClipboard(cssOutputEditor, 'CSS'));
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-btn';
        clearBtn.className = 'main-btn btn-secondary';
        clearBtn.textContent = 'Clear';
        dom.headerActions.prepend(clearBtn);
        clearBtn.addEventListener('click', clearAll);
    }
    
    function clearAll() {
        jsonEditor.setValue(`{\n  "source": "bricksCopiedElements",\n  "sourceUrl": "https://example.com",\n  "version": "1.12.4",\n  "content": [],\n  "globalClasses": [],\n  "globalElements": []\n}`);
        htmlOutputEditor.setValue('');
        cssOutputEditor.setValue('');
        showToast('All fields cleared', 'success');
    }

    function convertBricksToCode() {
        const jsonString = jsonEditor.getValue();
        if (!jsonString.trim()) return showToast('JSON input is empty.', 'warning');
        let bricksData;
        try {
            bricksData = JSON.parse(jsonString);
        } catch (error) {
            return showToast('Invalid JSON format. Please check your input.', 'error');
        }
        if (!bricksData.content || !Array.isArray(bricksData.content)) {
            return showToast('Invalid Bricks data. Missing "content" array.', 'error');
        }
        try {
            const elementTree = buildTree(bricksData.content);
            const classMap = createClassMap(bricksData.globalClasses || []);
            const html = generateHtml(elementTree, classMap);
            const css = generateCss(bricksData);
            htmlOutputEditor.setValue(html);
            cssOutputEditor.setValue(css);
            [htmlOutputEditor, cssOutputEditor].forEach(editor => {
                CodeMirror.commands.selectAll(editor);
                editor.execCommand("indentAuto");
                editor.setCursor(0);
            });
            showToast('Conversion successful!', 'success');
        } catch(error) {
            showToast('An error occurred during conversion.', 'error');
            console.error("Conversion Error:", error);
            htmlOutputEditor.setValue(`/*\n  An error occurred during conversion.\n  Check the console for more details.\n  Error: ${error.message}\n*/`);
            cssOutputEditor.setValue('');
        }
    }

    function buildTree(elements) {
        if (!elements || elements.length === 0) return [];
        const elementMap = new Map(elements.map(el => [el.id, { ...el, _children: [] }]));
        const tree = [];
        elements.forEach(el => {
            if (el.parent && el.parent !== 0 && elementMap.has(el.parent)) {
                elementMap.get(el.parent)._children.push(elementMap.get(el.id));
            } else {
                tree.push(elementMap.get(el.id));
            }
        });
        return tree;
    }

    function createClassMap(globalClasses) {
        return new Map((globalClasses || []).map(gc => [gc.id, gc.name]));
    }
    
    function generateHtml(tree, classMap, indent = 0) {
        let htmlString = '';
        const indentation = '  '.repeat(indent);
        const selfClosingTags = new Set(['br', 'hr', 'input']);

        for (const element of tree) {
            if (element.name === 'code' && (element.settings?.javascriptCode || element.settings?.type === 'javascript')) continue;
            
            const settings = element.settings || {};

            // ** START FIX: Handle SVG element **
            if (element.name === 'svg' && settings.code) {
                const hasElementStyles = hasStyles(element);
                let svgCode = settings.code;
                
                let attrsToInject = '';
                if (settings._cssId) {
                    attrsToInject += ` id="${settings._cssId}"`;
                } else if (dom.forceIdsCheckbox.checked || hasElementStyles) {
                    attrsToInject += ` id="brxe-${element.id}"`;
                }
                const classes = new Set();
                if (settings._cssClasses) settings._cssClasses.split(' ').filter(Boolean).forEach(c => classes.add(c));
                if (settings._cssGlobalClasses) settings._cssGlobalClasses.forEach(id => classMap.has(id) && classes.add(classMap.get(id)));
                if (classes.size > 0) attrsToInject += ` class="${Array.from(classes).join(' ')}"`;
                
                if (attrsToInject) {
                    svgCode = svgCode.replace(/<svg/i, `<svg${attrsToInject}`);
                }
                
                htmlString += `${indentation}${svgCode.trim()}\n`;
                continue;
            }
            // ** END FIX **

            const tag = determineTag(element);
            const hasElementStyles = hasStyles(element);
            const attributes = buildAttributes(element, classMap, hasElementStyles);

            if (tag === 'img') {
                htmlString += `${indentation}<img${attributes}>\n`;
                continue;
            }
            htmlString += `${indentation}<${tag}${attributes}>`;
            if (selfClosingTags.has(tag)) {
                htmlString += '\n';
                continue;
            }
            if (element.name === 'image') {
                const imgAttrs = buildAttributes(element, classMap, hasElementStyles, true);
                htmlString += `\n${indentation}  <img${imgAttrs}>`;
                const hasCaption = settings.caption === 'custom' && settings.captionCustom;
                if (hasCaption) {
                    htmlString += `\n${indentation}  <figcaption>${settings.captionCustom}</figcaption>`;
                }
                htmlString += `\n${indentation}</${tag}>\n`;
                continue;
            }
            let content = '';
            if (settings.text) {
                content = settings.text;
            } 
            if (element._children?.length > 0) {
                htmlString += '\n' + generateHtml(element._children, classMap, indent + 1);
                htmlString += `${indentation}</${tag}>\n`;
            } else {
                htmlString += `${content}</${tag}>\n`;
            }
        }
        return htmlString;
    }

    function determineTag(element) {
        const settings = element.settings || {};
        if (element.name === 'image') {
            if (settings.tag === 'custom' && settings.customTag) return settings.customTag.toLowerCase();
            if (settings.tag && settings.tag !== 'custom') return settings.tag.toLowerCase();
            return 'img';
        }
        if (settings.tag === 'custom' && settings.customTag) return settings.customTag.toLowerCase();
        if (settings.tag && settings.tag !== 'custom') return settings.tag.toLowerCase();
        const nameMap = { 'section': 'section', 'container': 'div', 'heading': 'h1', 'text-basic': 'p', 'text': 'div', 'text-link': 'a', 'svg': 'svg', 'button': 'button', 'code': 'pre' };
        return nameMap[element.name] || 'div';
    }

    function buildAttributes(element, classMap, hasElementStyles, isImgTag = false) {
        const settings = element.settings || {};
        let attrs = '';
        const isUnwrappedImage = element.name === 'image' && !settings.tag;

        if (isImgTag || isUnwrappedImage) {
            if (settings.image?.url) attrs += ` src="${settings.image.url}"`;
            if (settings.altText) attrs += ` alt="${settings.altText}"`;
            if (settings.loading) attrs += ` loading="${settings.loading}"`;
            if (settings.showTitle) attrs += ` title="${settings.altText || ''}"`;
            if (isUnwrappedImage) {
                if (settings._cssId) {
                    attrs += ` id="${settings._cssId}"`;
                } else if (dom.forceIdsCheckbox.checked || hasElementStyles) {
                    attrs += ` id="brxe-${element.id}"`;
                }
                const classes = new Set();
                if (settings._cssClasses) settings._cssClasses.split(' ').filter(Boolean).forEach(c => classes.add(c));
                if (settings._cssGlobalClasses) settings._cssGlobalClasses.forEach(id => classMap.has(id) && classes.add(classMap.get(id)));
                if (classes.size > 0) attrs += ` class="${Array.from(classes).join(' ')}"`;
            }
        } else {
            if (settings._cssId) {
                attrs += ` id="${settings._cssId}"`;
            } else if (dom.forceIdsCheckbox.checked || hasElementStyles) {
                attrs += ` id="brxe-${element.id}"`;
            }
            const classes = new Set();
            if (element.name === 'container') classes.add('container');
            if (element.name === 'image') classes.add('brxe-image');
            if (settings._cssClasses) settings._cssClasses.split(' ').filter(Boolean).forEach(c => classes.add(c));
            if (settings._cssGlobalClasses) settings._cssGlobalClasses.forEach(id => classMap.has(id) && classes.add(classMap.get(id)));
            if (classes.size > 0) attrs += ` class="${Array.from(classes).join(' ')}"`;
            if (settings.link?.url) {
                attrs += ` href="${settings.link.url}"`;
                if (settings.link.target) attrs += ` target="${settings.link.target}"`;
                if (settings.link.rel) attrs += ` rel="${settings.link.rel}"`;
            }
            if (settings._attributes) settings._attributes.forEach(attr => attr.name && (attrs += ` ${attr.name}="${attr.value || ''}"`));
        }
        return attrs;
    }
    
    const withPx = (v) => (v === null || v === undefined || v === '') ? v : (isNaN(parseFloat(v)) || !isFinite(v)) ? v : (String(v) !== '0' ? `${v}px` : '0');
    const handleColor = (c) => c && (c.raw || c.hex || c);
    const handleShorthand = (vo, p, fn = v => v) => (vo ? ['top','right','bottom','left'].reduce((a,s) => (vo[s]!==undefined&&vo[s]!==null&&vo[s]!=='')?a.concat(`${p}-${s}: ${fn(vo[s])};`):a,[]) : []);
    const u = undefined, n = null;

    const STYLE_MAPPERS = { _position:v=>v&&`position:${v};`,_zIndex:v=>(v!==u&&v!==n&&v!=='')&&`z-index:${v};`,_top:v=>(v!==u&&v!==n&&v!=='')&&`top:${withPx(v)};`,_right:v=>(v!==u&&v!==n&&v!=='')&&`right:${withPx(v)};`,_bottom:v=>(v!==u&&v!==n&&v!=='')&&`bottom:${withPx(v)};`,_left:v=>(v!==u&&v!==n&&v!=='')&&`left:${withPx(v)};`,_margin:v=>handleShorthand(v,'margin',withPx),_padding:v=>handleShorthand(v,'padding',withPx),_width:v=>v&&`width:${withPx(v)};`,_widthMin:v=>v&&`min-width:${withPx(v)};`,_widthMax:v=>v&&`max-width:${withPx(v)};`,_height:v=>v&&`height:${withPx(v)};`,_heightMin:v=>v&&`min-height:${withPx(v)};`,_heightMax:v=>v&&`max-height:${withPx(v)};`,_aspectRatio:v=>v&&`aspect-ratio:${v.replace(':',' / ')};`,_visibility:v=>v&&`visibility:${v};`,_overflow:v=>v&&`overflow:${v.replace('hiden','hidden')};`,_opacity:v=>(v!==u&&v!==n&&v!=='')&&`opacity:${v};`,_cursor:v=>v&&`cursor:${v};`,_mixBlendMode:v=>v&&`mix-blend-mode:${v};`,_pointerEvents:v=>v&&`pointer-events:${v};`,_isolation:v=>v&&`isolation:${v};`,_order:v=>(v!==u&&v!==n)&&`order:${v};`,_display:v=>v&&`display:${v};`,_direction:v=>v&&`flex-direction:${v};`,_flexDirection:v=>v&&`flex-direction:${v};`,_flexWrap:v=>v&&`flex-wrap:${v};`,_alignItems:v=>v&&`align-items:${v};`,_justifyContent:v=>v&&`justify-content:${v};`,_columnGap:v=>v&&`column-gap:${withPx(v)};`,_rowGap:v=>v&&`row-gap:${withPx(v)};`,_gap:v=>v&&(v.row||v.column)&&`gap:${withPx(v.row||0)} ${withPx(v.column||0)};`,_flexGrow:v=>(v!==u&&v!==n)&&`flex-grow:${v};`,_flexShrink:v=>(v!==u&&v!==n)&&`flex-shrink:${v};`,_flexBasis:v=>v&&`flex-basis:${withPx(v)};`,_alignSelf:v=>v&&`align-self:${v};`,_gridGap:v=>v&&`gap:${withPx(v)};`,_gridTemplateColumns:v=>v&&`grid-template-columns:${v};`,_gridTemplateRows:v=>v&&`grid-template-rows:${v};`,_gridAutoColumns:v=>v&&`grid-auto-columns:${v};`,_gridAutoRows:v=>v&&`grid-auto-rows:${v};`,_gridAutoFlow:v=>v&&`grid-auto-flow:${v};`,_justifyItemsGrid:v=>v&&`justify-items:${v};`,_alignItemsGrid:v=>v&&`align-items:${v};`,_justifyContentGrid:v=>v&&`justify-content:${v};`,_alignContentGrid:v=>v&&`align-content:${v};`,_gridItemColumnSpan:v=>v&&`grid-column:span ${v};`,_gridItemRowSpan:v=>v&&`grid-row:span ${v};`,_background:v=>{const r=[];v.color&&r.push(`background-color:${handleColor(v.color)};`);v.image?.url&&r.push(`background-image:url('${v.image.url}');`);v.position&&r.push(`background-position:${v.position};`);v.attachment&&r.push(`background-attachment:${v.attachment};`);v.repeat&&r.push(`background-repeat:${v.repeat};`);v.size&&r.push(`background-size:${v.size};`);v.blendMode&&r.push(`background-blend-mode:${v.blendMode};`);return r;},_border:v=>{const r=[];v.style&&r.push(`border-style:${v.style};`);v.color&&r.push(`border-color:${handleColor(v.color)};`);v.width&&r.push(...handleShorthand(v.width,'border-width',withPx));v.radius&&r.push(...handleShorthand(v.radius,'border-radius',withPx));return r;},_typography:v=>{const r=[];v['font-family']?.name?r.push(`font-family:'${v['font-family'].name}', ${v['font-family'].fallback||'sans-serif'};`):typeof v['font-family']==='string'&&r.push(`font-family:${v['font-family']};`);v['font-size']&&r.push(`font-size:${withPx(v['font-size'])};`);v['font-weight']&&r.push(`font-weight:${v['font-weight']};`);v['font-style']&&r.push(`font-style:${v['font-style']};`);v['line-height']&&r.push(`line-height:${v['line-height']};`);v['letter-spacing']&&r.push(`letter-spacing:${withPx(v['letter-spacing'])};`);v['text-align']&&r.push(`text-align:${v['text-align']};`);v['text-transform']&&r.push(`text-transform:${v['text-transform']};`);v['text-decoration']&&r.push(`text-decoration:${v['text-decoration']};`);v['white-space']&&r.push(`white-space:${v['white-space']};`);v['text-wrap']&&r.push(`text-wrap:${v['text-wrap']};`);v.color&&r.push(`color:${handleColor(v.color)};`);return r;},_transformOrigin:v=>v&&`transform-origin:${v};`,_cssTransition:v=>v&&`transition:${v};`,_transform:v=>{const t=[],o=['translateX','translateY','scaleX','scaleY','rotateX','rotateY','rotateZ','skewX','skewY'];for(const k of o)if(v[k]&&parseFloat(v[k])!==0){const u={translateX:'px',translateY:'px',rotateX:'deg',rotateY:'deg',rotateZ:'deg',skewX:'deg',skewY:'deg'}[k]||'';k.startsWith('scale')?parseFloat(v[k])!==1&&t.push(`${k}(${v[k]})`):t.push(`${k}(${v[k]}${u})`);}return t.length>0?`transform:${t.join(' ')};`:[]},_boxShadow:v=>!Array.isArray(v)||v.length===0?[]:`box-shadow:${v.map(s=>`${s.inset?'inset ':''}${withPx(s.x)||'0'} ${withPx(s.y)||'0'} ${withPx(s.blur)||'0'} ${withPx(s.spread)||'0'} ${handleColor(s.color)||'rgba(0,0,0,0.1)'}`).join(', ')};`,
        _objectFit: (v) => v && `object-fit: ${v};`,
        _objectPosition: (v) => v && `object-position: ${v};`,
        stretch: (v) => v === true ? 'width: 100%;' : null,
        // ** START FIX: Add mappers for SVG specific styles **
        width: (v) => v && `width: ${withPx(v)};`,
        height: (v) => v && `height: ${withPx(v)};`,
        // stroke and fill will be handled specially
        // ** END FIX **
    };

    function hasStyles(element) {
        const settings = element.settings || {};
        if (settings._cssCustom && (settings._cssCustom.includes(`#brxe-${element.id}`) || settings._cssCustom.includes('%root%'))) return true;
        for (const key in settings) {
            // Check both underscored and non-underscored keys
            if (STYLE_MAPPERS[key]) return true;
        }
        return false;
    }

    function generateRulesFromSettings(settings) {
        let rules = [];
        for (const key in settings) {
            if (STYLE_MAPPERS[key]) {
                const result = STYLE_MAPPERS[key](settings[key]);
                if (Array.isArray(result)) rules.push(...result.filter(Boolean));
                else if (result) rules.push(result);
            }
        }
        return rules;
    }
    
    function generateCss(bricksData) {
        const cssMap = new Map();
        const standaloneCssBlocks = [];
        const ensureSelector = (selector) => {
            if (!cssMap.has(selector)) cssMap.set(selector, { gui: new Set(), custom: '' });
        };
        (bricksData.globalClasses || []).forEach(gc => {
            const selector = `.${gc.name}`;
            ensureSelector(selector);
            generateRulesFromSettings(gc.settings || {}).forEach(rule => cssMap.get(selector).gui.add(rule));
            if (gc.settings?._cssCustom) {
                const customDeclarations = (gc.settings._cssCustom.match(/{([\s\S]*)}/) || [])[1] || '';
                if (customDeclarations) cssMap.get(selector).custom += `\n  ${customDeclarations.trim()}`;
            }
        });
        (bricksData.content || []).forEach(element => {
            const settings = element.settings || {};
            const guiRules = generateRulesFromSettings(settings);
            
            // ** START FIX: Handle SVG specific CSS generation **
            const isSvgElement = element.name === 'svg';
            let baseSelector;
            if (hasStyles(element) || settings._cssCustom) {
                baseSelector = settings._cssId ? `#${settings._cssId}` : `#brxe-${element.id}`;
            }

            if (isSvgElement && baseSelector) {
                 if (settings.fill) {
                    standaloneCssBlocks.push(`${baseSelector} :not([fill="none"]) {\n  fill: ${handleColor(settings.fill)} !important;\n}`);
                 }
                 if (settings.stroke) {
                    standaloneCssBlocks.push(`${baseSelector} :not([stroke="none"]) {\n  stroke: ${handleColor(settings.stroke)} !important;\n}`);
                 }
                 if (settings.strokeWidth) {
                    standaloneCssBlocks.push(`${baseSelector} * {\n  stroke-width: ${settings.strokeWidth} !important;\n}`);
                 }
            }
            // ** END FIX **
            
            if (guiRules.length > 0 && baseSelector) {
                ensureSelector(baseSelector);
                const isUnwrappedImage = element.name === 'image' && !settings.tag;
                const imgSelector = isUnwrappedImage ? baseSelector : `${baseSelector} > img`;
                
                guiRules.forEach(rule => {
                    if (rule.startsWith('object-fit') || rule.startsWith('object-position')) {
                        ensureSelector(imgSelector);
                        cssMap.get(imgSelector).gui.add(rule);
                    } else {
                        cssMap.get(baseSelector).gui.add(rule);
                    }
                });
            }
            if (settings._cssCustom) {
                const ruleRegex = /([^{]+)\s*{([^}]+)}/g;
                let match;
                let remainingCss = settings._cssCustom;
                while ((match = ruleRegex.exec(settings._cssCustom)) !== null) {
                    let selector = match[1].trim().replace(/%root%/g, `#brxe-${element.id}`);
                    const declarations = match[2].trim();
                    ensureSelector(selector);
                    cssMap.get(selector).custom += `\n  ${declarations}`;
                    remainingCss = remainingCss.replace(match[0], '');
                }
                if (remainingCss.trim()) standaloneCssBlocks.push(remainingCss.trim());
            }
            if (element.name === 'code' && (settings.css || settings.cssCode)) {
                standaloneCssBlocks.push(`/* --- From Code Element: ${element.label || element.id} --- */\n${settings.css || settings.cssCode}`);
            }
        });
        let finalCss = '';
        for (const [selector, styles] of cssMap.entries()) {
            const { gui, custom } = styles;
            if (gui.size === 0 && !custom.trim()) continue;
            finalCss += `${selector} {\n`;
            if (gui.size > 0) finalCss += `  ${[...gui].join('\n  ')}`;
            if (custom.trim()) {
                 if (gui.size > 0) finalCss += '\n';
                 finalCss += `\n  /* --- Custom CSS --- */`;
                 finalCss += `\n  ${custom.trim()}`;
            }
            finalCss += '\n}\n\n';
        }
        if (standaloneCssBlocks.length > 0) {
            finalCss += standaloneCssBlocks.join('\n\n');
        }

        return finalCss.trim();
    }
    
    function copyToClipboard(editor, type) {
        const text = editor.getValue();
        if (!text) return showToast(`Nothing to copy for ${type}.`, 'warning');
        navigator.clipboard.writeText(text).then(() => showToast(`${type} copied to clipboard!`, 'success'), () => showToast(`Failed to copy ${type}.`, 'error'));
    }

    function showToast(message, type) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    init();
});