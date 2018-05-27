const replacePrefRegExp = /^[/\\]+(.*)/;
const replaceSufRegExp = /\/$/;
const replaceSepsRegExp = /[/\\]+/g;
/**
 *
 * join paths with path separator '/'
 * @export
 * @param {...string[]} paths
 * @returns {string}
 */
export function join(...paths: string[]): string {
    console.info(paths);
    return paths
        .filter(path => !!path)
        .map(path => {
            if (path.match(/^[a-z]+:\/{2,}.*/i)) {
                return path.replace(replaceSufRegExp, '');
            }
            return path
                .replace(replacePrefRegExp, '$1')
                .replace(replaceSepsRegExp, '/')
                .replace(replaceSufRegExp, '');
        })
        .join('/');
}
