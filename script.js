const dropZone = document.getElementById('dropZone');
        const imageInput = document.getElementById('imageInput');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');

        // Settings
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        const sizeCheckboxes = document.querySelectorAll('.size-options input[type="checkbox"]');

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
                .map(cb => parseInt(cb.value));

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

                    for (const size of selectedSizes) {
                        const { blob, width, height } = await resizeAndConvert(imgData.imageElement, size, quality);
                        const url = URL.createObjectURL(blob);
                        const baseName = imgData.name.split('.').slice(0, -1).join('');
                        const newName = `${baseName}-${width}.webp`;

                        zip.file(newName, blob);
                        const resultItem = createResultItem(newName, url, blob.size, imgData.originalSize);
                        resultGrid.appendChild(resultItem);
                        convertedImages.push({ blob, name: newName, url });
                    }

                } catch (error) {
                    showError(`Error converting ${file.name}: ${error.message}`);
                }
            }

            loadingDiv.style.display = 'none';
            if (resultDiv.hasChildNodes()) {
                downloadAllBtn.style.display = 'block';
                clearAllBtn.style.display = 'block';
            }
            window.currentZip = zip;
        }

        async function resizeAndConvert(imageElement, targetWidth, quality) {
            const aspectRatio = imageElement.naturalHeight / imageElement.naturalWidth;
            const targetHeight = Math.round(targetWidth * aspectRatio);

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
            return { blob, width: targetWidth, height: targetHeight };
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

        function createResultItem(name, src, size, originalSize) {
            const item = document.createElement('div');
            item.className = 'result-item';
            const sizeDiff = ((size - originalSize) / originalSize * 100).toFixed(1);
            const color = size < originalSize ? 'green' : 'red';
            item.innerHTML = `
                <img src="${src}" alt="${name}">
                <div class="result-info">
                    <p>${name}</p>
                    <p>New Size: ${formatSize(size)}</p>
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
            if (!window.currentZip || convertedImages.length === 0) return;
            window.currentZip.generateAsync({ type: 'blob' }).then(blob => {
                saveAs(blob, 'webp_images.zip');
            });
        }

        function clearAll() {
            convertedImages.forEach(img => URL.revokeObjectURL(img.url));
            convertedImages = [];
            zip = new JSZip();
            window.currentZip = zip;
            resultDiv.innerHTML = '';
            downloadAllBtn.style.display = 'none';
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
