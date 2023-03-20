declare module '*.webp' {
    const fileName: string;
    export = fileName;
}

declare module '*.png' {
    const fileName: string;
    export = fileName;
}

declare module '*.css' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}
