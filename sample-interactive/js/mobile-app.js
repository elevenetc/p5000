import {allProjects, allTags} from './projectsData';
import {formatDateToMMYYYY} from './dateUtils';

function byDateDesc(a, b) {
    return b.date.getTime() - a.date.getTime();
}

function byTitleAsc(a, b) {
    return a.title.localeCompare(b.title);
}

function render() {
    const projectsRoot = document.getElementById('projects-root');
    const tagsRoot = document.getElementById('tags-root');

    if (!projectsRoot || !tagsRoot) {
        console.error('Projects root: ' + projectsRoot + ". Tags root: " + tagsRoot);
        return;
    }

    // Projects list
    const fragProjects = document.createDocumentFragment();
    allProjects.slice().sort(byDateDesc).forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';

        const title = document.createElement('div');
        title.className = 'project-title';
        title.textContent = `${formatDateToMMYYYY(project.date)} ${project.title}`;

        const tags = document.createElement('div');
        tags.className = 'project-tags';
        project.tags.forEach(tag => {
            const t = document.createElement('span');
            t.className = 'chip';
            t.textContent = tag.title;
            tags.appendChild(t);
        });

        item.appendChild(title);
        if (project.tags.length > 0) item.appendChild(tags);
        fragProjects.appendChild(item);
    });
    projectsRoot.appendChild(fragProjects);

    // Tags cloud
    const fragTags = document.createDocumentFragment();
    allTags.slice().sort(byTitleAsc).forEach(tag => {
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'tag-chip';
        t.textContent = tag.title;
        fragTags.appendChild(t);
    });
    tagsRoot.appendChild(fragTags);
}

// Run after DOM is ready
if (document.readyState === 'loading') {
    console.log("mobile-app", "loading")
    document.addEventListener('DOMContentLoaded', render, {once: true});
} else {
    console.log("mobile-app", "render")
    render();
}
