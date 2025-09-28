export function printType(x: any, prefix = "") {
    console.log(prefix, x)
    //console.log(typeToString(x, prefix))
}

export function typeToString(x: any, prefix = "") {
    return prefix + ": `" + (typeof x) + "`, json: `" + JSON.stringify(x) + "`"
}