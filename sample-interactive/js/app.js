import p5 from 'p5';
import {allProjects, allTags} from "./projectsData";
import {formatDateToMMYYYY} from "./dateUtils";
import LinksView from "./LinksView";
import {tagTitleToColor} from "./appConfig";
import Vertical from "../../src/p5000/Vertical";
import Align from "../../src/p5000/Align";
import TextView from "../../src/p5000/text/TextView";
import {Free} from "../../src/p5000/containers/Free";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";
import {InputView} from "../../src/p5000/text/InputView";
import SelectionTextOverlay from "../../src/p5000/text/SelectionTextOverlay";

const projectsToTags = new Map();
const tagsToProjects = new Map();

const root = new Free()
const linksView = new LinksView()
const projectsView = new Vertical()

const keyboardHandler = new KeyboardHandlerImpl()

projectsView.align = Align.LEFT_TOP;
projectsView.alignContent = Align.LEFT;
const tagsView = new Vertical()
tagsView.align = Align.RIGHT_TOP;
tagsView.alignContent = Align.RIGHT;

allProjects.sort((a, b) => b.date.getTime() - a.date.getTime()).forEach(project => {
    const title = formatDateToMMYYYY(project.date) + " " + project.title
    const projectView = new TextView(" " + title, project.id, (id, hovered, p) => {
        linksView.onProjectHover(id, hovered, p)
    });
    projectView.color = [255, 255, 255]
    projectView.textAlign = Align.LEFT
    projectView.overlays.push(new SelectionTextOverlay(keyboardHandler))
    projectsToTags.set(projectView, [])
    projectsView.addChild(projectView);
})

allTags.sort((a, b) => a.title.localeCompare(b.title)).forEach(tag => {
    let tagTitle = tag.title + " ";
    let tagView = new TextView(
        tagTitle,
        tag.id,
        (id, hovered, p) => {
            linksView.onTagHover(id, hovered, p)
        },
        tagTitleToColor(tagTitle)
    );
    tagView.textAlign = Align.RIGHT
    tagView.overlays.push(new SelectionTextOverlay(keyboardHandler))
    tagsView.addChild(tagView);
    tagsToProjects.set(tagView, [])
})

tagsView.children.forEach(tagView => {
    const tagId = tagView.id

    projectsView.children.forEach(projectView => {

        const projectId = projectView.id
        const project = allProjects.filter(project => project.id === projectId)[0]

        project.tags.forEach(tag => {
            if (tag.id === tagId) {
                projectsToTags.get(projectView).push(tagView)
            }
        })
    })
})


const filterText = new InputView("Type to search...", "", keyboardHandler)
filterText.align = Align.CENTER_BOTTOM
filterText.color = [100, 100, 100]


projectsView.children.forEach(projectView => {
    const projectId = projectView.id

    tagsView.children.forEach(tagView => {

        const tagId = tagView.id
        const project = allProjects.filter(project => project.id === projectId)[0]

        project.tags.forEach(tag => {
            if (tag.id === tagId) {
                tagsToProjects.get(tagView).push(projectView)
            }
        })
    })
})

linksView.setMaps(tagsToProjects, projectsToTags)

root.addChild(linksView)
root.addChild(projectsView)
root.addChild(tagsView, Align.RIGHT_TOP)
root.addChild(filterText, Align.CENTER_BOTTOM)

function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
}

function draw(p) {
    p.background(0);

    layoutAndRender(root, p, null, (view, p) => {
        linksView.onNoHover(p)
    })
}


const sketch = (p) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(sketch);
