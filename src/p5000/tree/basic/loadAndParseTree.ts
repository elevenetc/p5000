import {PlaybackFrame} from "../../playback/PlaybackTimelineView";
import {BasicTreeNode} from "./TreeModel";


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

    for (const key of Object.keys(json.threadsRoots)) {
        let name = json.threadsNamesMap[key]
        let root = parseNode(
            json.threadsRoots[key],
            (execTime) => {
                result.maxExecTime = Math.max(result.maxExecTime, execTime)
                result.minExecTime = Math.min(result.minExecTime, execTime)
            },
            (childrenCount) => {
                result.maxChildren = Math.max(result.maxChildren, childrenCount)
                result.minChildren = Math.min(result.minChildren, childrenCount)
            }
        )
        result.roots.set(name, root)
    }
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

function parseNode(
    json: any,
    measureExecTime: (execTime: number) => void,
    measureMaxChildren: (childrenCount: number) => void
): BasicTreeNode {
    let id = json.id
    let fqn = json.fqn
    let start = json.start
    let end = json.end
    let result = new BasicTreeNode()


    let children: BasicTreeNode[] = []
    json.children.forEach((child: any) => {
        children.push(parseNode(child, measureExecTime, measureMaxChildren))
    })

    result.id = id
    result.fqn = fqn
    result.children = children
    result.start = start
    result.end = end

    if (start != -1 && end != -1) {
        result.execTime = end - start
        measureExecTime(result.execTime)
    }

    measureMaxChildren(children.length)

    return result
}

class ParseResult {
    roots = new Map<String, BasicTreeNode>();
    history: PlaybackFrame[] = []

    minExecTime = Number.MAX_VALUE
    maxExecTime = Number.MIN_VALUE

    minChildren = Number.MAX_VALUE
    maxChildren = Number.MIN_VALUE
}

export {
    loadAndParseTree, ParseResult
}