// Digital Decluttering Agent - Dashboard Application
// IBM Design Language Implementation

class DeclutterDashboard {
    constructor() {
        this.files = [];
        this.currentCategory = 'all';
        this.selectedFiles = new Set();
        this.categories = {
            documents: {
                name: 'Documents',
                extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages', '.md', '.tex', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.potx', '.strings'],
                color: '#0f62fe'
            },
            media: {
                name: 'Media',
                extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.mp4', '.mov', '.avi', '.mkv', '.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.webm', '.webp'],
                color: '#8a3ffc'
            },
            archives: {
                name: 'Archives',
                extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.dmg', '.iso', '.pkg'],
                color: '#198038'
            },
            downloads: {
                name: 'Downloads',
                path: '/downloads/',
                color: '#fa4d56'
            },
            other: {
                name: 'Other',
                color: '#8d8d8d'
            }
        };
        this.filters = {
            search: '',
            sizeMin: 0,
            sizeMax: Infinity,
            recommendation: 'all',
            fileType: 'all'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLatestReport();
    }

    populateFileTypeFilter() {
        // Get unique file types from current files
        const fileTypes = [...new Set(this.files.map(f => f.file_type))].sort();
        
        const select = document.getElementById('fileTypeFilter');
        // Keep the "All Types" option
        select.innerHTML = '<option value="all">All Types</option>';
        
        // Add each file type
        fileTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type || 'No extension';
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadLatestReport();
        });

        // Selection controls
        document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.selectAllVisible();
        });

        document.getElementById('deselectAllBtn').addEventListener('click', () => {
            this.deselectAll();
        });

        // Deletion controls
        document.getElementById('moveToTrashBtn').addEventListener('click', () => {
            this.moveSelectedToTrash();
        });

        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteSelectedFiles();
        });

        // Filter inputs
        document.getElementById('searchFilter').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderFiles();
        });

        document.getElementById('sizeMinFilter').addEventListener('input', (e) => {
            this.filters.sizeMin = parseFloat(e.target.value) || 0;
            this.renderFiles();
        });

        document.getElementById('sizeMaxFilter').addEventListener('input', (e) => {
            this.filters.sizeMax = parseFloat(e.target.value) || Infinity;
            this.renderFiles();
        });

        document.getElementById('fileTypeFilter').addEventListener('change', (e) => {
            this.filters.fileType = e.target.value;
            this.renderFiles();
        });

        document.getElementById('recommendationFilter').addEventListener('change', (e) => {
            this.filters.recommendation = e.target.value;
            this.renderFiles();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    clearFilters() {
        this.filters = {
            search: '',
            sizeMin: 0,
            sizeMax: Infinity,
            recommendation: 'all',
            fileType: 'all'
        };
        document.getElementById('searchFilter').value = '';
        document.getElementById('sizeMinFilter').value = '';
        document.getElementById('sizeMaxFilter').value = '';
        document.getElementById('fileTypeFilter').value = 'all';
        document.getElementById('recommendationFilter').value = 'all';
        this.renderFiles();
    }

    async loadLatestReport() {
        try {
            this.showLoading();
            
            // Fetch the latest report data
            const response = await fetch('data/latest_report.json');
            if (!response.ok) {
                throw new Error('No report data found');
            }
            
            const data = await response.json();
            this.files = data.files;
            
            this.updateSummary(data);
            this.populateFileTypeFilter();
            this.renderFiles();
            this.generateInsights();
            
        } catch (error) {
            console.error('Error loading report:', error);
            this.showEmptyState();
        }
    }

    categorizeFile(file) {
        const ext = file.file_type.toLowerCase();
        const path = file.file_path.toLowerCase();

        // Check by extension first (more specific categorization)
        for (const [category, config] of Object.entries(this.categories)) {
            if (config.extensions && config.extensions.includes(ext)) {
                return category;
            }
        }

        // Then check Downloads path (for files without specific extensions)
        if (path.includes('/downloads/')) {
            return 'downloads';
        }

        return 'other';
    }

    getRecommendation(file) {
        const sizeMB = file.size_mb;
        const ext = file.file_type.toLowerCase();
        const path = file.file_path.toLowerCase();
        const daysSinceAccess = this.getDaysSinceAccess(file.last_access);

        // Large files (>100MB) not accessed in 2+ years
        if (sizeMB > 100 && daysSinceAccess > 730) {
            return { type: 'delete', reason: 'Large file unused for 2+ years' };
        }

        // Archives in Downloads older than 1 year
        if (path.includes('/downloads/') && ['.zip', '.rar', '.7z', '.dmg'].includes(ext) && daysSinceAccess > 365) {
            return { type: 'delete', reason: 'Old download archive' };
        }

        // Duplicate-looking files
        if (path.includes('copy') || path.includes('duplicate') || path.match(/\(\d+\)/)) {
            return { type: 'review', reason: 'Possible duplicate' };
        }

        // Media files >50MB not accessed in 1+ year
        if (this.categories.media.extensions.includes(ext) && sizeMB > 50 && daysSinceAccess > 365) {
            return { type: 'archive', reason: 'Large media file - consider archiving' };
        }

        // Documents not accessed in 2+ years
        if (this.categories.documents.extensions.includes(ext) && daysSinceAccess > 730) {
            return { type: 'archive', reason: 'Old document - consider archiving' };
        }

        // Default: review
        return { type: 'review', reason: 'Review for relevance' };
    }

    getDaysSinceAccess(dateString) {
        const accessDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - accessDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    updateSummary(data) {
        document.getElementById('totalFiles').textContent = data.files.length.toLocaleString();
        document.getElementById('totalSize').textContent = this.formatSize(data.total_size_mb);
        
        const deleteCount = data.files.filter(f => 
            this.getRecommendation(f).type === 'delete'
        ).length;
        document.getElementById('recommendDelete').textContent = deleteCount.toLocaleString();
        
        document.getElementById('lastScan').textContent = this.formatDate(data.scan_date);
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.renderFiles();
    }

    applyFilters(files) {
        return files.filter(file => {
            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search;
                const fileName = file.file_path.toLowerCase();
                if (!fileName.includes(searchLower)) {
                    return false;
                }
            }

            // Size filters
            if (file.size_mb < this.filters.sizeMin || file.size_mb > this.filters.sizeMax) {
                return false;
            }

            // File type filter
            if (this.filters.fileType !== 'all') {
                if (file.file_type !== this.filters.fileType) {
                    return false;
                }
            }

            // Recommendation filter
            if (this.filters.recommendation !== 'all') {
                const recommendation = this.getRecommendation(file);
                if (recommendation.type !== this.filters.recommendation) {
                    return false;
                }
            }

            return true;
        });
    }

    renderFiles() {
        // First filter by category
        let filteredFiles = this.currentCategory === 'all'
            ? this.files
            : this.files.filter(f => this.categorizeFile(f) === this.currentCategory);

        // Then apply additional filters
        filteredFiles = this.applyFilters(filteredFiles);

        // Update category header
        const categoryName = this.currentCategory === 'all' 
            ? 'All Files' 
            : this.categories[this.currentCategory].name;
        
        document.getElementById('categoryTitle').textContent = categoryName;
        document.getElementById('categoryCount').textContent = `${filteredFiles.length} files`;
        
        const totalSize = filteredFiles.reduce((sum, f) => sum + f.size_mb, 0);
        document.getElementById('categorySize').textContent = this.formatSize(totalSize);

        // Render table
        const tbody = document.getElementById('filesTableBody');
        
        if (filteredFiles.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <p>No files in this category</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredFiles
            .sort((a, b) => b.size_mb - a.size_mb)
            .map(file => this.renderFileRow(file))
            .join('');

        // Reattach checkbox event listeners
        this.attachCheckboxListeners();
        this.attachFileClickListeners();
        this.updateBulkActionsBar();
    }

    renderFileRow(file) {
        const fileName = file.file_path.split('/').pop();
        const location = file.file_path.substring(0, file.file_path.lastIndexOf('/'));
        const recommendation = this.getRecommendation(file);
        const isSelected = this.selectedFiles.has(file.file_path);
        
        return `
            <tr class="${isSelected ? 'selected' : ''}" data-file-path="${file.file_path}">
                <td class="checkbox-column">
                    <input type="checkbox" class="file-checkbox" data-file-path="${file.file_path}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="file-name clickable" title="Click to reveal in Finder: ${fileName}" data-file-path="${file.file_path}">${fileName}</div>
                </td>
                <td>
                    <div class="file-location clickable" title="Click to reveal in Finder: ${location}" data-file-path="${file.file_path}">${location}</div>
                </td>
                <td class="file-size">${this.formatSize(file.size_mb)}</td>
                <td class="file-date">${this.formatDate(file.last_access)}</td>
                <td><span class="file-type">${file.file_type}</span></td>
                <td>
                    <span class="recommendation-tag ${recommendation.type}" title="${recommendation.reason}">
                        ${recommendation.type.toUpperCase()}
                    </span>
                </td>
            </tr>
        `;
    }

    generateInsights() {
        const insightsGrid = document.getElementById('insightsGrid');
        
        // Calculate insights
        const totalSize = this.files.reduce((sum, f) => sum + f.size_mb, 0);
        const largeFiles = this.files.filter(f => f.size_mb > 100);
        const downloadFiles = this.files.filter(f => f.file_path.toLowerCase().includes('/downloads/'));
        const oldFiles = this.files.filter(f => this.getDaysSinceAccess(f.last_access) > 730);
        
        const deleteRecommendations = this.files.filter(f => 
            this.getRecommendation(f).type === 'delete'
        );
        const potentialSavings = deleteRecommendations.reduce((sum, f) => sum + f.size_mb, 0);

        const insights = [
            {
                title: 'Potential Space Savings',
                description: `You could free up ${this.formatSize(potentialSavings)} by removing ${deleteRecommendations.length} files recommended for deletion.`,
                items: [
                    `${largeFiles.length} files over 100 MB`,
                    `${downloadFiles.length} files in Downloads folder`,
                    `${oldFiles.length} files not accessed in 2+ years`
                ],
                color: '#198038'
            },
            {
                title: 'Downloads Folder',
                description: `Your Downloads folder contains ${downloadFiles.length} old files taking up ${this.formatSize(downloadFiles.reduce((sum, f) => sum + f.size_mb, 0))}.`,
                items: this.getTopFilesByCategory('downloads', 3),
                color: '#fa4d56'
            },
            {
                title: 'Large Files',
                description: `${largeFiles.length} files are larger than 100 MB. Consider archiving or removing these files.`,
                items: largeFiles.slice(0, 3).map(f => 
                    `${f.file_path.split('/').pop()} (${this.formatSize(f.size_mb)})`
                ),
                color: '#0f62fe'
            },
            {
                title: 'File Type Distribution',
                description: 'Understanding your file types helps identify cleanup opportunities.',
                items: this.getFileTypeDistribution(),
                color: '#8a3ffc'
            }
        ];

        insightsGrid.innerHTML = insights.map(insight => `
            <div class="insight-card" style="border-left-color: ${insight.color}">
                <h3>${insight.title}</h3>
                <p>${insight.description}</p>
                ${insight.items.length > 0 ? `
                    <ul class="insight-list">
                        ${insight.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('');
    }

    getTopFilesByCategory(category, limit) {
        return this.files
            .filter(f => this.categorizeFile(f) === category)
            .sort((a, b) => b.size_mb - a.size_mb)
            .slice(0, limit)
            .map(f => `${f.file_path.split('/').pop()} (${this.formatSize(f.size_mb)})`);
    }

    getFileTypeDistribution() {
        const distribution = {};
        this.files.forEach(f => {
            const category = this.categorizeFile(f);
            distribution[category] = (distribution[category] || 0) + 1;
        });

        return Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([cat, count]) => {
                const name = this.categories[cat]?.name || cat;
                return `${name}: ${count} files`;
            });
    }

    formatSize(mb) {
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb.toFixed(2)} MB`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }

    attachCheckboxListeners() {
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filePath = e.target.dataset.filePath;
                const row = e.target.closest('tr');
                
                if (e.target.checked) {
                    this.selectedFiles.add(filePath);
                    row.classList.add('selected');
                } else {
                    this.selectedFiles.delete(filePath);
                    row.classList.remove('selected');
                }
                
                this.updateBulkActionsBar();
            });
        });
    }

    attachFileClickListeners() {
        document.querySelectorAll('.file-name.clickable, .file-location.clickable').forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row selection
                const filePath = e.target.dataset.filePath;
                this.revealInFinder(filePath);
            });
        });
    }

    async revealInFinder(filePath) {
        try {
            const response = await fetch('/api/reveal-in-finder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file: filePath })
            });

            const result = await response.json();

            if (result.success) {
                // Optional: Show a brief success message
                console.log('File revealed in Finder:', filePath);
            } else {
                alert(`Failed to reveal file: ${result.error}`);
            }
        } catch (error) {
            console.error('Error revealing file:', error);
            alert('Failed to reveal file in Finder');
        }
    }

    toggleSelectAll(checked) {
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
            const filePath = checkbox.dataset.filePath;
            const row = checkbox.closest('tr');
            
            if (checked) {
                this.selectedFiles.add(filePath);
                row.classList.add('selected');
            } else {
                this.selectedFiles.delete(filePath);
                row.classList.remove('selected');
            }
        });
        
        this.updateBulkActionsBar();
    }

    selectAllVisible() {
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            const filePath = checkbox.dataset.filePath;
            const row = checkbox.closest('tr');
            this.selectedFiles.add(filePath);
            row.classList.add('selected');
        });
        
        document.getElementById('selectAllCheckbox').checked = true;
        this.updateBulkActionsBar();
    }

    deselectAll() {
        this.selectedFiles.clear();
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('tr').classList.remove('selected');
        });
        
        document.getElementById('selectAllCheckbox').checked = false;
        this.updateBulkActionsBar();
    }

    updateBulkActionsBar() {
        const count = this.selectedFiles.size;
        const bar = document.getElementById('bulkActionsBar');
        const countSpan = document.getElementById('selectedCount');
        
        if (count > 0) {
            bar.style.display = 'flex';
            countSpan.textContent = `${count} file${count > 1 ? 's' : ''} selected`;
        } else {
            bar.style.display = 'none';
        }
    }

    async moveSelectedToTrash() {
        if (this.selectedFiles.size === 0) {
            alert('No files selected');
            return;
        }

        const count = this.selectedFiles.size;
        const confirmed = confirm(
            `Move ${count} file${count > 1 ? 's' : ''} to Trash?\n\n` +
            `This action can be undone from the Trash.`
        );

        if (!confirmed) return;

        try {
            const files = Array.from(this.selectedFiles);
            
            const response = await fetch('/api/move-to-trash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ files })
            });

            const result = await response.json();

            if (result.success) {
                alert(
                    `✅ Successfully moved ${result.moved} file${result.moved > 1 ? 's' : ''} to Trash\n` +
                    (result.failed > 0 ? `⚠️ Failed to move ${result.failed} file${result.failed > 1 ? 's' : ''}` : '')
                );

                // Remove successfully deleted files from the list
                result.results.forEach(r => {
                    if (r.success) {
                        this.files = this.files.filter(f => f.file_path !== r.file);
                        this.selectedFiles.delete(r.file);
                    }
                });

                this.renderFiles();
                this.updateSummary({
                    files: this.files,
                    total_size_mb: this.files.reduce((sum, f) => sum + f.size_mb, 0),
                    scan_date: new Date().toISOString()
                });
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            alert(`❌ Error moving files to trash: ${error.message}`);
        }
    }

    async deleteSelectedFiles() {
        if (this.selectedFiles.size === 0) {
            alert('No files selected');
            return;
        }

        const count = this.selectedFiles.size;
        const confirmed = confirm(
            `⚠️ PERMANENTLY DELETE ${count} file${count > 1 ? 's' : ''}?\n\n` +
            `This action CANNOT be undone!\n\n` +
            `Consider using "Move to Trash" instead for safer deletion.`
        );

        if (!confirmed) return;

        // Double confirmation for permanent deletion
        const doubleConfirm = confirm(
            `Are you absolutely sure?\n\n` +
            `This will PERMANENTLY delete ${count} file${count > 1 ? 's' : ''} from your system.`
        );

        if (!doubleConfirm) return;

        try {
            const files = Array.from(this.selectedFiles);
            
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ files })
            });

            const result = await response.json();

            if (result.success) {
                alert(
                    `✅ Successfully deleted ${result.deleted} file${result.deleted > 1 ? 's' : ''}\n` +
                    (result.failed > 0 ? `⚠️ Failed to delete ${result.failed} file${result.failed > 1 ? 's' : ''}` : '')
                );

                // Remove successfully deleted files from the list
                result.results.forEach(r => {
                    if (r.success) {
                        this.files = this.files.filter(f => f.file_path !== r.file);
                        this.selectedFiles.delete(r.file);
                    }
                });

                this.renderFiles();
                this.updateSummary({
                    files: this.files,
                    total_size_mb: this.files.reduce((sum, f) => sum + f.size_mb, 0),
                    scan_date: new Date().toISOString()
                });
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            alert(`❌ Error deleting files: ${error.message}`);
        }
    }

    openInFinder(path) {
        // This would need a backend service to actually open Finder
        alert(`File location: ${path}\n\nTo open in Finder, use the terminal command:\nopen -R "${path}"`);
    }

    showLoading() {
        const tbody = document.getElementById('filesTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    <div class="loading-spinner"></div>
                    <p>Loading report data...</p>
                </td>
            </tr>
        `;
    }

    showEmptyState() {
        const tbody = document.getElementById('filesTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                        <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                    </svg>
                    <h3>No Report Data Found</h3>
                    <p>Run a scan to generate your first report</p>
                </td>
            </tr>
        `;
        
        document.getElementById('totalFiles').textContent = '0';
        document.getElementById('totalSize').textContent = '0 MB';
        document.getElementById('recommendDelete').textContent = '0';
        document.getElementById('lastScan').textContent = 'Never';
    }
}

// Initialize dashboard
const dashboard = new DeclutterDashboard();

// Made with Bob
