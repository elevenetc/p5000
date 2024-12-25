function notImplementedError(className: string, methodName: string){
  throw new Error(`${className}.${methodName} not implemented.`);
}

export {
  notImplementedError
}
