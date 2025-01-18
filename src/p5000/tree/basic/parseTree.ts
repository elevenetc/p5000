import {BasicTreeNode} from "./BasicTreeView";
import {PlaybackFrame} from "../../playback/PlaybackView";

function parseTree(filePath: string, loadHandler: (result: ParseResult) => void) {

    parseJsonToObject(filePath)
        .then((node) => {
            loadHandler(node)
            //node.forEach((person) => console.log(person));
        })
        .catch((error) => console.error(error));
}

async function parseJsonToObject(filePath: string): Promise<ParseResult> {
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

function jsonToBasicTreeNode(json: any): ParseResult {
    let result = new ParseResult()
    result.root = parseNode(json.treeRoot)
    result.history = parseHistory(json.history)
    return result
}

function parseHistory(history: any): PlaybackFrame[] {
    let result: PlaybackFrame[] = [];
    history.forEach((item) => {
        let frame = new PlaybackFrame()
        frame.id = item.id
        frame.name = item.fqn
        result.push(frame);
    })
    return result
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

    return result
}

class ParseResult {
    root: BasicTreeNode | null = null
    history: PlaybackFrame[] = []
}

export {
    parseTree, ParseResult
}