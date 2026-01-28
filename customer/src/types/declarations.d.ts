declare module '*.jsx' {
    const content: any;
    export default content;
}

declare module '@shared/*' {
    const content: any;
    export = content;
}
