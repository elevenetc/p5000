import Project from "./Project";
import Tag from "./Tag";

function tags(titles: string[]): Tag[] {
    const result: Tag[] = [];
    titles.forEach(title => {
        result.push(new Tag(title));
    })
    return result;
}

const allProjects: Project[] = [
    new Project("DraggableView", new Date(2015, 1), tags(["java"])),
    new Project("Interactive canvas", new Date(2016, 1), tags(["android", "java", "canvas", "udp/tcp"])),
    new Project("Raytracer", new Date(2016, 4), tags(["android", "java", "canvas"])),
    new Project("TextSurface", new Date(2016, 6), tags(["android", "kotlin", "canvas"])),
    new Project("Mobile device manager", new Date(2020, 20), tags(["js", "node", "android", "ios", "udp/tcp"])),
    new Project("Pinocchio", new Date(2023, 8), tags(["art", "graphite"])),
    new Project("Yo momma KMP app", new Date(2024, 6), tags(["kmp", "kotlin", "ios", "android"])),
    new Project("Hello IDE", new Date(2024, 6), tags(["kotlin", "ij", "swift", "udp/tcp"])),
    new Project("Diff-Issue plugin", new Date(2024, 6), tags(["kotlin", "ij"])),
    new Project("Batman", new Date(2024, 7), tags(["art", "graphite"])),
    new Project("Objective-C diff tool", new Date(2024, 6), tags(["obj-c", "kotlin"])),
    new Project("Objective-C validation plugin", new Date(2024, 6), tags(["obj-c", "kotlin", "ij"])),
    new Project("Omon", new Date(2024, 10), tags(["art", "graphite"])),
    new Project("p5000", new Date(2024, 12), tags(["js", "typescript", "canvas"])),
];

const allTags = Array.from(
    allProjects
        .flatMap(project => project.tags)
        .reduce((map, tag) => {
            if (!map.has(tag.title)) {
                map.set(tag.title, tag);
            }
            return map;
        }, new Map())
        .values()
);

export {
    allProjects,
    allTags
}
