import {BasicTreeNode} from "./TreeModel";
import {arrayToMap} from "../../utils/arrayToMap";
import {PopStackInstruction, PushStackInstruction, StackData, StackInstruction} from "./CallStack";


function loadAndParseTree(
    filePath: string,
    loadHandler: (result: ParseResult) => void,
    errorHandler: (error) => void
) {

    loadAndParseJsonToObject(filePath)
        .then((result) => {
                loadHandler(result)
            }
        )
        .catch((error) => {
                errorHandler(error);
                console.error(error);
            }
        );
}

// export function loadAndParseTrees(filePath: string[], loadHandler: (result: Map<String, ParseResult>) => void) {
//
//     const promises = filePath.map(async (path) => {
//         const result = await loadAndParseJsonToObject(path);
//         return [path, result] as [string, ParseResult];
//     });
//
//     Promise.all(promises)
//         .then((results) => {
//             const resultMap = new Map<String, ParseResult>();
//             results.forEach(([path, result]) => {
//                 resultMap.set(path, result);
//             });
//             loadHandler(resultMap);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }

async function loadAndParseJsonToObject(filePath: string): Promise<ParseResult> {
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

    for (const rootId of Object.keys(json.roots)) {
        result.roots.set(
            rootId,
            parseNode(
                json.roots[rootId],
                (childrenCount) => {
                    result.analytics.maxChildren = Math.max(result.analytics.maxChildren, childrenCount)
                    result.analytics.minChildren = Math.min(result.analytics.minChildren, childrenCount)
                }
            )
        )
    }

    for (const stackId of Object.keys(json.stacks)) {
        result.stacks.set(stackId, parseStack(
                json.stacks[stackId],
                stackId,
                (execTime) => {
                    result.analytics.maxExecTime = Math.max(result.analytics.maxExecTime, execTime)
                    result.analytics.minExecTime = Math.min(result.analytics.minExecTime, execTime)
                }
            )
        )
    }

    // console.log(
    //     "parse result: " +
    //     "\nroots: " + result.roots.size +
    //     "\nstacks size: " + result.stacks.size
    // )

    //printType(result, "result-pre")
    //console.log("!!: " + result.stacks.keys())

    return result
}

function parseStack(
    stack: any,
    id: string,
    measureExecTime: (execTime: number) => void
): StackData {
    let frames: StackInstruction[] = [];
    //let frames = new Stack<StackCmd>();
    let idx = 0
    stack.forEach((rawStackCmd: any) => {
        let cmd: StackInstruction

        if (rawStackCmd.type == "push") {
            cmd = new PushStackInstruction(rawStackCmd.nodeId)
        } else if (rawStackCmd.type == "pop") {
            cmd = new PopStackInstruction()
        } else {
            console.warn("unknown stack command type: " + rawStackCmd.type)
        }

        cmd.id = rawStackCmd.id

        //cmd.index = idx++
        cmd.start = rawStackCmd.start
        cmd.end = rawStackCmd.end
        frames.push(cmd);

        measureExecTime(rawStackCmd.end - rawStackCmd.start)
    })
    let result = new StackData()

    result.id = id
    result.instructions = frames
    return result
}

function parseNode(
    json: any,
    measureMaxChildren: (childrenCount: number) => void
): BasicTreeNode {
    let id = json.id
    let fqn = json.fqn
    let start = json.start
    let end = json.end
    let result = new BasicTreeNode()


    let children: BasicTreeNode[] = []
    json.children.forEach((child: any) => {
        children.push(parseNode(child, measureMaxChildren))
    })

    result.id = id
    result.fqn = fqn
    result.children = children
    result.childrenMap = arrayToMap(result.children, (child) => child.id)
    result.start = start
    result.end = end

    bindParentWithChildren(result)

    if (start != -1 && end != -1) result.execTime = end - start

    measureMaxChildren(children.length)

    return result
}

function bindParentWithChildren(node: BasicTreeNode) {
    node.children.forEach((child) => {
        child.parent = node
    })
}

class ParseResult {
    roots = new Map<string, BasicTreeNode>();
    stacks = new Map<string, StackData>();
    analytics = new TraceAnalytics()
}

export class TraceAnalytics {
    minExecTime = Number.MAX_VALUE
    maxExecTime = Number.MIN_VALUE

    minChildren = Number.MAX_VALUE
    maxChildren = Number.MIN_VALUE
}

export {
    loadAndParseTree, ParseResult
}