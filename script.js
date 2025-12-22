const dropZone = document.getElementById('dropZone');
        const imageInput = document.getElementById('imageInput');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const exportListBtn = document.getElementById('exportListBtn');
        const settingsBtn = document.getElementById('settingsBtn');

        // Settings
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        const sizeCheckboxes = document.querySelectorAll('.size-options input[type="checkbox"]');
        const customWidthsInput = document.getElementById('customWidths');
        const fitModeSelect = document.getElementById('fitMode');
        const customAspectRatioInput = document.getElementById('customAspectRatio');

        let convertedImages = [];
        let zip = new JSZip();

        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        dropZone.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => handleFiles(e.target.files));
        settingsBtn.addEventListener('click', openSettingsModal);

        // Main action buttons
        downloadAllBtn.addEventListener('click', downloadAllAsZip);
        clearAllBtn.addEventListener('click', clearAll);
        exportListBtn.addEventListener('click', openExportModal);

        // Settings event listener
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value;
        });

        async function handleFiles(files) {
            if (files.length === 0) {
                showError('No valid images selected!');
                return;
            }

            loadingDiv.style.display = 'block';

            const selectedSizes = Array.from(sizeCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            const customWidthsValue = customWidthsInput.value;
            const selectedRatios = getSelectedAspectRatios();
            const fitMode = fitModeSelect.value;

            const quality = parseInt(qualitySlider.value) / 100;

            for (const file of Array.from(files)) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') continue;

                try {
                    const reader = new FileReader();
                    const imgData = await new Promise((resolve) => {
                        reader.onload = (event) => {
                            const imageElement = new Image();
                            imageElement.onload = () => resolve({ imageElement, name: file.name, originalSize: file.size });
                            imageElement.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    });

                    const groupCard = createImageGroupCard(imgData.name, imgData.originalSize);
                    resultDiv.appendChild(groupCard);
                    const resultGrid = groupCard.querySelector('.result-grid');

                    // Create a set of unique widths to generate, preventing upscaling.
                    const targetWidths = new Set();
                    const originalWidth = imgData.imageElement.naturalWidth;

                    selectedSizes.forEach(size => {
                        if (size === 'original') {
                            targetWidths.add(originalWidth);
                        } else {
                            const presetWidth = parseInt(size);
                            // Only add preset widths that are smaller or equal to the original.
                            if (presetWidth <= originalWidth) {
                                targetWidths.add(presetWidth);
                            }
                        }
                    });

                    if (customWidthsValue) {
                        const customWidths = customWidthsValue
                            .split(',')
                            .map(w => parseInt(w.trim()))
                            .filter(w => !isNaN(w) && w > 0);

                        customWidths.forEach(width => {
                            if (width <= originalWidth) {
                                targetWidths.add(width);
                            }
                        });
                    }

                    for (const width of targetWidths) {
                        for (const ratio of selectedRatios) {
                            const { blob, width: finalWidth, height } = await resizeAndConvert(imgData.imageElement, width, quality, ratio, fitMode);
                            const url = URL.createObjectURL(blob);
                            const baseName = imgData.name.split('.').slice(0, -1).join('');
                            
                            // Construct filename: name-800.webp or name-800-16x9.webp
                            let ratioSuffix = ratio === 'original' ? '' : `-${ratio.replace(':','x')}`;
                            const newName = `${baseName}-${finalWidth}${ratioSuffix}.webp`;

                            zip.file(newName, blob);
                            // Mark as "Original" only if it's the original width AND original ratio
                            const isOriginal = (finalWidth === originalWidth) && (ratio === 'original');
                            
                            const resultItem = createResultItem(newName, url, blob.size, imgData.originalSize, finalWidth, height, isOriginal);
                            resultGrid.appendChild(resultItem);
                            convertedImages.push({ blob, name: newName, url, width: finalWidth, height, size: blob.size, originalName: imgData.name });
                        }
                    }

                } catch (error) {
                    showError(`Error converting ${file.name}: ${error.message}`);
                }
            }

            // Add manifest.json to the ZIP
            const manifest = convertedImages.map(img => ({
                name: img.name,
                width: img.width,
                height: img.height,
                size: img.size,
                originalName: img.originalName
            }));
            zip.file('manifest.json', JSON.stringify(manifest, null, 2));

            loadingDiv.style.display = 'none';
            if (resultDiv.hasChildNodes()) {
                downloadAllBtn.style.display = 'block';
                exportListBtn.style.display = 'block';
                clearAllBtn.style.display = 'block';
            }
        }

        function getSelectedAspectRatios() {
            const ratios = [];
            document.querySelectorAll('.aspect-ratio-cb:checked').forEach(cb => ratios.push(cb.value));
            const custom = customAspectRatioInput.value.trim();
            if (custom) {
                custom.split(',').forEach(r => {
                    if (r.includes(':')) ratios.push(r.trim());
                });
            }
            if (ratios.length === 0) ratios.push('original');
            return [...new Set(ratios)];
        }

        function getRatioValue(ratioStr) {
            if (!ratioStr || ratioStr === 'original') return null;
            const parts = ratioStr.split(':');
            if (parts.length === 2) {
                const w = parseFloat(parts[0]);
                const h = parseFloat(parts[1]);
                if (!isNaN(w) && !isNaN(h) && h !== 0) return w / h;
            }
            return null;
        }

        async function resizeAndConvert(imageElement, targetWidth, quality, targetRatioStr, fitMode) {
            const srcW = imageElement.naturalWidth;
            const srcH = imageElement.naturalHeight;
            const targetRatio = getRatioValue(targetRatioStr);

            let canvasW, canvasH;
            
            if (targetRatio) {
                canvasW = targetWidth;
                canvasH = Math.round(targetWidth / targetRatio);
            } else {
                // Original Ratio
                const ratio = srcW / srcH;
                canvasW = targetWidth;
                canvasH = Math.round(targetWidth / ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = canvasW;
            canvas.height = canvasH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingQuality = 'high';

            // Draw logic
            if (!targetRatio) {
                ctx.drawImage(imageElement, 0, 0, canvasW, canvasH);
            } else {
                // Calculate Source Crop (Cover mode default for now, or implement fitMode logic)
                let sx = 0, sy = 0, sWidth = srcW, sHeight = srcH;
                if (fitMode === 'cover') {
                    const srcRatio = srcW / srcH;
                    if (srcRatio > targetRatio) { // Source is wider
                        sWidth = srcH * targetRatio; sx = (srcW - sWidth) / 2;
                    } else { // Source is taller
                        sHeight = srcW / targetRatio; sy = (srcH - sHeight) / 2;
                    }
                    ctx.drawImage(imageElement, sx, sy, sWidth, sHeight, 0, 0, canvasW, canvasH);
                } else if (fitMode === 'fill') {
                    ctx.drawImage(imageElement, 0, 0, canvasW, canvasH);
                } else if (fitMode === 'contain') {
                    // Fill background white (optional)
                    // ctx.fillStyle = 'white'; ctx.fillRect(0,0,canvasW,canvasH);
                    const scale = Math.min(canvasW / srcW, canvasH / srcH);
                    const dW = srcW * scale;
                    const dH = srcH * scale;
                    const dx = (canvasW - dW) / 2;
                    const dy = (canvasH - dH) / 2;
                    ctx.drawImage(imageElement, 0, 0, srcW, srcH, dx, dy, dW, dH);
                }
            }

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
            return { blob, width: canvasW, height: canvasH };
        }

        function createImageGroupCard(originalName, originalSize) {
            const card = document.createElement('div');
            card.className = 'image-group-card';
            card.innerHTML = `
                <h3>${originalName} (Original: ${formatSize(originalSize)})</h3>
                <div class="result-grid"></div>
            `;
            return card;
        }

        function createResultItem(name, src, size, originalSize, width, height, isOriginal) {
            const item = document.createElement('div');
            item.className = 'result-item';
            const sizeDiff = ((size - originalSize) / originalSize * 100).toFixed(1);
            const color = size < originalSize ? 'green' : 'red';
            const originalLabel = isOriginal ? ' <strong>(Original)</strong>' : '';
            item.innerHTML = `
                <img src="${src}" alt="${name}">
                <div class="result-info">
                    <p>${name}</p>
                    <p>New Size: ${formatSize(size)}</p>
                    <p>Dimensions: ${width}x${height}${originalLabel}</p>
                    <p class="size-comparison" style="color: ${color};">${sizeDiff}%</p>
                </div>
                <button class="result-download-btn" onclick="downloadSingleImage('${name}')">Download</button>
            `;
            return item;
        }

        function downloadSingleImage(name) {
            const image = convertedImages.find(img => img.name === name);
            if (!image) {
                showError('Image not found for download');
                return;
            }
            const link = document.createElement('a');
            link.href = image.url; // Use the pre-generated URL
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function downloadAllAsZip() {
            if (!zip || convertedImages.length === 0) return;
            zip.generateAsync({ type: 'blob' })
                .then(blob => {
                    // The call to saveAs() was causing a 'saveAs is not defined' ReferenceError.
                    // This can happen if FileSaver.js fails to load or initialize correctly.
                    // To make the download more robust, we'll use the same anchor-tag-trick
                    // used by downloadSingleImage(), which relies on native browser APIs.
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'webp_images.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url); // Clean up the object URL.
                })
                .catch(err => {
                    console.error("Error generating ZIP:", err);
                    showError(`Error generating ZIP file: ${err.message}`);
                });
        }

        function clearAll() {
            convertedImages.forEach(img => URL.revokeObjectURL(img.url));
            convertedImages = [];
            zip = new JSZip();
            resultDiv.innerHTML = '';
            downloadAllBtn.style.display = 'none';
            exportListBtn.style.display = 'none';
            clearAllBtn.style.display = 'none';
        }

        function formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = message;
            setTimeout(() => errorDiv.style.display = 'none', 5000);
        }

        // Export Modal Functions
        const exportModal = document.getElementById('exportModal');
        const settingsModal = document.getElementById('settingsModal');
        const exportPreview = document.getElementById('exportPreview');
        const exportFormat = document.getElementById('exportFormat');

        function openExportModal() {
            updateExportPreview();
            exportModal.style.display = 'block';
        }

        function closeExportModal() {
            exportModal.style.display = 'none';
        }

        function openSettingsModal() {
            settingsModal.style.display = 'block';
        }

        function closeSettingsModal() {
            settingsModal.style.display = 'none';
        }

        function resetSettings() {
            // Reset Sizes
            document.getElementById('sizeOriginal').checked = true;
            document.getElementById('size480').checked = true;
            document.getElementById('size800').checked = true;
            document.getElementById('size1200').checked = true;
            customWidthsInput.value = '';

            // Reset Quality
            qualitySlider.value = 80;
            qualityValue.textContent = '80';

            // Reset Aspect Ratios
            document.querySelectorAll('.aspect-ratio-cb').forEach(cb => cb.checked = (cb.value === 'original'));
            customAspectRatioInput.value = '';
            fitModeSelect.value = 'cover';
        }

        window.onclick = function(event) {
            if (event.target == exportModal) {
                closeExportModal();
            } else if (event.target == settingsModal) {
                closeSettingsModal();
            }
        }

        function updateExportPreview() {
            const format = exportFormat.value;
            let content = '';

            if (format === 'json') {
                const data = convertedImages.map(img => ({
                    name: img.name,
                    width: img.width,
                    height: img.height,
                    size: img.size,
                    originalName: img.originalName
                }));
                content = JSON.stringify(data, null, 2);
            } else if (format === 'xml') {
                content = '<?xml version="1.0" encoding="UTF-8"?>\n<files>\n';
                convertedImages.forEach(img => {
                    content += `  <file name="${img.name}" width="${img.width}" height="${img.height}" size="${img.size}" originalName="${img.originalName}" />\n`;
                });
                content += '</files>';
            } else if (format === 'markdown') {
                convertedImages.forEach(img => {
                    content += `!${img.name}\n`;
                });
            } else if (format === 'html') {
                // Group by original name to create srcset snippets
                const groups = {};
                convertedImages.forEach(img => {
                    if (!groups[img.originalName]) groups[img.originalName] = [];
                    groups[img.originalName].push(img);
                });

                for (const originalName in groups) {
                    const imgs = groups[originalName].sort((a, b) => a.width - b.width);
                    const largest = imgs[imgs.length - 1];
                    const srcset = imgs.map(img => `${img.name} ${img.width}w`).join(',\n         ');
                    
                    content += `<!-- ${originalName} -->\n`;
                    content += `<img src="${largest.name}"\n     srcset="${srcset}"\n     alt="${originalName}">\n\n`;
                }
            }

            exportPreview.value = content;
        }

        function copyExportToClipboard() {
            exportPreview.select();
            exportPreview.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(exportPreview.value).then(() => {
                const originalText = document.querySelector('.modal-actions button:first-child').textContent;
                document.querySelector('.modal-actions button:first-child').textContent = 'Copied!';
                setTimeout(() => {
                    document.querySelector('.modal-actions button:first-child').textContent = originalText;
                }, 2000);
            });
        }

        function downloadExportFile() {
            const format = exportFormat.value;
            const content = exportPreview.value;
            const extension = format === 'markdown' ? 'md' : format;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            
            // Using the anchor-tag-trick for robustness, consistent with other download functions.
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `file-list.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
