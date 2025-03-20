const dropZone = document.getElementById('dropZone');
        const imageInput = document.getElementById('imageInput');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
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

        async function handleFiles(files) {
            if (files.length === 0) {
                showError('No valid images selected!');
                return;
            }

            loadingDiv.style.display = 'block';

            for (const file of Array.from(files)) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') continue;

                try {
                    const reader = new FileReader();
                    const imgData = await new Promise((resolve) => {
                        reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => resolve({ img, name: file.name, originalSize: file.size });
                            img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    });

                    const canvas = document.createElement('canvas');
                    canvas.width = imgData.img.naturalWidth;
                    canvas.height = imgData.img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgData.img, 0, 0);

                    const webpBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
                    const webpSize = webpBlob.size;
                    const webpUrl = URL.createObjectURL(webpBlob);
                    const baseName = imgData.name.split('.').slice(0, -1).join('.');
                    let uniqueName = `${baseName}.webp`;
                    let counter = 1;
                    while (convertedImages.some(img => img.name === uniqueName)) {
                        uniqueName = `${baseName}_${counter}.webp`;
                        counter++;
                    }

                    zip.file(uniqueName, webpBlob);
                    const card = createImageCard(uniqueName, webpUrl, webpSize, imgData.originalSize, webpBlob);
                    resultDiv.appendChild(card);
                    convertedImages.push({ blob: webpBlob, name: uniqueName, url: webpUrl });
                } catch (error) {
                    showError(`Error converting ${file.name}: ${error.message}`);
                }
            }

            loadingDiv.style.display = 'none';
            if (convertedImages.length > 0) {
                downloadAllBtn.style.display = 'block';
                clearAllBtn.style.display = 'block';
            }
            window.currentZip = zip;
        }

        function createImageCard(name, src, size, originalSize, blob) {
            const card = document.createElement('div');
            card.className = 'image-card';
            const sizeDiff = ((size - originalSize) / originalSize * 100).toFixed(1);
            const color = size < originalSize ? 'green' : 'red';
            card.innerHTML = `
                <img src="${src}" alt="${name}">
                <div class="image-info">
                    <p>${name}</p>
                    <p>Original: ${formatSize(originalSize)}</p>
                    <p>WebP: ${formatSize(size)} (<span style="color: ${color};">${sizeDiff}%</span>)</p>
                </div>
                <button class="card-download-btn" onclick="downloadSingleImage('${name}', '${src}')">Download</button>
            `;
            return card;
        }

        function downloadSingleImage(name, src) {
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
