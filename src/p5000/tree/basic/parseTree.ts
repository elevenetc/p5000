import {BasicTreeNode} from "./BasicTreeView";

function parseTree(filePath: string, loadHandler: (result: any) => BasicTreeNode) {

    parseJsonToObject(filePath)
        .then((node) => {
            console.log("parsed node: " + node)
            loadHandler(node)
            //node.forEach((person) => console.log(person));
        })
        .catch((error) => console.error(error));
}

async function parseJsonToObject(filePath: string): Promise<BasicTreeNode> {
    const jsonData = await loadJSON(filePath);
    return jsonToBasicTreeNode(jsonData);
}

async function loadJSON(filePath: string): Promise<any> {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
    }
    return response.json();
}

function jsonToBasicTreeNode(json: any): BasicTreeNode | null {
    let root = json.treeRoot;
    return parseNode(root)
}

function parseNode(json: any): BasicTreeNode {
    let id = json.id
    let fqn = json.fqn
    let result = new BasicTreeNode()


    let children: BasicTreeNode[] = []
    json.children.forEach(child => {
        children.push(parseNode(child))
    })

    result.id = id
    result.fqn = fqn
    result.children = children
    console.log("child count: " + result.children.length)

    return result
}

export {
    parseTree
}