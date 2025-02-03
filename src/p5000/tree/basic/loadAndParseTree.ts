import {BasicTreeNode} from "./BasicTreeView";
import {PlaybackFrame} from "../../playback/PlaybackTimelineView";


function loadAndParseTree(filePath: string, loadHandler: (result: ParseResult) => void) {

    parseJsonToObject(filePath)
        .then((result) => {
            loadHandler(result)
        })
        .catch((error) => console.error(error));
}

export function loadAndParseTrees(filePath: string[], loadHandler: (result: Map<String, ParseResult>) => void) {

    const promises = filePath.map(async (path) => {
        const result = await parseJsonToObject(path);
        return [path, result] as [string, ParseResult];
    });

    Promise.all(promises)
        .then((results) => {
            const resultMap = new Map<String, ParseResult>();
            results.forEach(([path, result]) => {
                resultMap.set(path, result);
            });
            loadHandler(resultMap);
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
    loadAndParseTree, ParseResult
}