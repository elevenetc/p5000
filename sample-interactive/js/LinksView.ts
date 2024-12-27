import p5 from "p5";
import {tagTitleToColor} from "./appConfig";
import View from "../../src/p5000/View";
import Align from "../../src/p5000/Align";
import TextView from "../../src/p5000/text/TextView";
import LinearAnimationValue from "../../src/p5000/animation/LinearAnimationValue";
import {MouseSpeed} from "../../src/p5000/utils/MouseSpeed";
import SinAnimationValue from "../../src/p5000/animation/SinAnimationValue";

class LinksView extends View {

  projectsToTags: Map<TextView, TextView[]>
  tagsToProjects: Map<TextView, TextView[]>

  links: Link[] = []

  hoveredProject: string = "";
  hoveredTag: string = "";

  highlightRoot(
    rootId: string,
    hovered: boolean,
    roots: Map<TextView, TextView[]>,
    leaves: Map<TextView, TextView[]>,
  ) {
    const leavesToShow = []

    roots.forEach((leaves, root) => {
      if (root.id === rootId && hovered) {
        root.setAlpha(255, 1, true)

        leaves.forEach(tagView => {
          leavesToShow.push(tagView.id)
        })

      } else {
        root.setAlpha(50, 1, true)
      }
    })

    leaves.forEach((roots, leaf) => {
      if (leavesToShow.indexOf(leaf.id) !== -1) {
        leaf.setAlpha(255, 1, true)
      } else {
        leaf.setAlpha(50, 1, true)
      }
    })
  }

  onProjectHover(id: string, hovered: boolean, p: p5) {
    if (!hovered) return
    if (hovered) {
      if (this.hoveredProject == id) return
      this.hoveredProject = id;
    }

    this.links.forEach(link => {
      link.setSelected(link.projectView.id === this.hoveredProject, p)
    })

    this.highlightRoot(id, hovered, this.projectsToTags, this.tagsToProjects)
  }

  onTagHover(id: string, hovered: boolean, p: p5) {
    if (!hovered) return
    if (hovered) {
      if (this.hoveredTag == id) return
      this.hoveredTag = id;
    }

    this.links.forEach(link => {
      link.setSelected(link.tagView.id === this.hoveredTag, p)
    })

    this.highlightRoot(id, hovered, this.tagsToProjects, this.projectsToTags)
  }

  onNoHover(p: p5) {

    if (this.hoveredProject == "" && this.hoveredTag == "") return

    this.hoveredProject = ""
    this.hoveredTag = ""

    this.tagsToProjects.forEach((projectsViews, tagView) => {
      tagView.setAlpha(255, 5, true)
    })

    this.projectsToTags.forEach((tagsViews, projectView) => {
      projectView.setAlpha(255, 5, true)
    })

    this.links.forEach(link => {
      link.setSelected(false, p)
    });
  }

  getWidth(p: p5): number {
    throw new Error("getWidth not implemented.");
  }

  getHeight(p: p5): number {
    throw new Error("getHeight not implemented.");
  }

  onHoverIn(p: p5): void {

  }

  onHoverOut(p: p5): void {

  }

  contains(x: number, mouseY: number, p: p5): boolean {
    return false
  }

  setMaps(tagsToProjects: Map<TextView, TextView[]>, projectsToTags: Map<TextView, TextView[]>) {
    this.projectsToTags = projectsToTags
    this.tagsToProjects = tagsToProjects

    this.projectsToTags.forEach((tags, projectView) => {

      tags.forEach(tagView => {
        this.links.push(new Link(projectView, tagView))
      })


    })
  }

  render(p: p5): void {
    p.push();


    this.links.forEach(link => {
      link.render(p)
    })

    p.pop()
  }
}

class Link {

  projectView: TextView
  tagView: TextView

  minAlpha = 10

  maxBouns = 0.5

  mouseSpeed = new MouseSpeed()

  alpha: LinearAnimationValue = new LinearAnimationValue(this.minAlpha, 0.5, 0, 255)
  bouns: SinAnimationValue = new SinAnimationValue(this.maxBouns, 0.1, 5, true)
  color: [number, number, number]

  selected: boolean = false;

  constructor(projectView: TextView, tagView: TextView) {
    this.projectView = projectView
    this.tagView = tagView
    this.color = tagTitleToColor(tagView.title)
  }

  setSelected(selected: boolean, p: p5) {
    if (selected) {
      this.selected = true
      this.alpha.setTarget(100, 5);
      this.bouns.setTarget(this.maxBouns);

    } else {
      this.selected = false
      this.alpha.setTarget(this.minAlpha, 5);
    }
  }

  lines = 20

  render(p: p5) {

    let projectStartX = this.projectView.getX(p);
    let projectEndX = projectStartX + this.projectView.getWidth(p);
    let projectY = this.projectView.getY(p) + this.projectView.getHeight(p);
    let tagStartX = this.tagView.getX(p);
    let tagEndX = this.tagView.getX(p) + this.tagView.getWidth(p);
    let tagY = this.tagView.getY(p) + this.tagView.getHeight(p);


    p.noFill();





    const bv = this.bouns.calculate();
    let lineAlpha = this.alpha.calculate();

    for (let i = -this.lines; i < this.lines; i++) {
      let bounsValue = bv * i;


      let a = Math.abs((Math.abs(i) / (this.lines)) - 1)
      p.stroke(this.color[0], this.color[1], this.color[2], lineAlpha * a);

      p.line(projectStartX, projectY, projectEndX, projectY)

      p.bezier(
        projectEndX,
        projectY,
        projectEndX + bounsValue + 150 + i * 6,
        projectY + bounsValue,
        tagStartX + bounsValue - 150 - i * 6,
        tagY + bounsValue,
        tagStartX,
        tagY
      );

      p.line(tagStartX, tagY, tagEndX, tagY)
    }
  }
}

export default LinksView;
