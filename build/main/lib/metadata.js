"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@docusaurus/utils");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const striptags_1 = __importDefault(require("striptags"));
function inferVersion(dirName, versions) {
    const maybeVersion = dirName.split('/', 1).shift();
    const inferredVersion = maybeVersion ? maybeVersion.replace(/^version-/, '') : null;
    return inferredVersion && versions.includes(inferredVersion) ? inferredVersion : null;
}
function versionFromSource(dirName, versions) {
    return /^version-/.test(dirName) ? inferVersion(dirName, versions) : 'next';
}
async function processMetadata({ source, refDir, context, options, env, }) {
    const { routeBasePath } = options;
    const { siteDir, baseUrl } = context;
    const { versioning } = env;
    const dirName = path_1.default.dirname(source);
    const filePath = path_1.default.join(refDir, source);
    const fileStringPromise = fs_extra_1.default.readFile(filePath, 'utf-8');
    const version = (versioning.enabled) ? versionFromSource(dirName, versioning.versions) : null;
    // The version portion of the url path. Eg: 'next', '1.0.0', and ''
    const versionPath = version && version !== versioning.latestVersion ? version : '';
    const contents = await fileStringPromise;
    const { frontMatter = {}, excerpt, content } = utils_1.parseMarkdownString(contents);
    const plaintext = striptags_1.default(content);
    const baseID = frontMatter.id || path_1.default.basename(source, path_1.default.extname(source));
    // tslint:disable-next-line: no-if-statement
    if (baseID.includes('/')) {
        throw new Error('Document id cannot include "/".');
    }
    // tslint:enable no-if-statement
    // Append subdirectory as part of id.
    const id = dirName !== '.' ? `${dirName}/${baseID}` : baseID;
    const title = frontMatter.title || baseID;
    const description = frontMatter.description || excerpt;
    // The last portion of the url path. Eg: 'foo/bar', 'bar'
    const routePath = version && version !== 'next'
        ? id.replace(new RegExp(`^version-${version}/`), '')
        : id;
    const permalink = utils_1.normalizeUrl([
        baseUrl,
        routeBasePath,
        versionPath,
        routePath,
    ]);
    const metadata = {
        description,
        id,
        permalink,
        plaintext,
        source: utils_1.aliasedSitePath(filePath, siteDir),
        title,
        version,
    };
    return metadata;
}
exports.default = processMetadata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBQXVGO0FBQ3ZGLHdEQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsMERBQWtDO0FBSWxDLFNBQVMsWUFBWSxDQUFDLE9BQWUsRUFBRSxRQUErQjtJQUNwRSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuRCxNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDcEYsT0FBTyxlQUFlLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDeEYsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLFFBQStCO0lBQ3pFLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzlFLENBQUM7QUFFYyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQzVDLE1BQU0sRUFDTixNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxHQUFHLEdBQ0o7SUFDQyxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ3JDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFFM0IsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQyxNQUFNLGlCQUFpQixHQUFHLGtCQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV6RCxNQUFNLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTlGLG1FQUFtRTtJQUNuRSxNQUFNLFdBQVcsR0FBRyxPQUFPLElBQUksT0FBTyxLQUFLLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRW5GLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWlCLENBQUM7SUFDekMsTUFBTSxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sU0FBUyxHQUFHLG1CQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFcEMsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEVBQUUsSUFBSSxjQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0UsNENBQTRDO0lBQzVDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDcEQ7SUFDRCxnQ0FBZ0M7SUFFaEMscUNBQXFDO0lBQ3JDLE1BQU0sRUFBRSxHQUFHLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFN0QsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUM7SUFFdkQseURBQXlEO0lBQ3pELE1BQU0sU0FBUyxHQUNiLE9BQU8sSUFBSSxPQUFPLEtBQUssTUFBTTtRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDVCxNQUFNLFNBQVMsR0FBRyxvQkFBWSxDQUFDO1FBQzdCLE9BQU87UUFDUCxhQUFhO1FBQ2IsV0FBVztRQUNYLFNBQVM7S0FDVixDQUFDLENBQUM7SUFFSCxNQUFNLFFBQVEsR0FBZ0I7UUFDNUIsV0FBVztRQUNYLEVBQUU7UUFDRixTQUFTO1FBQ1QsU0FBUztRQUNULE1BQU0sRUFBRSx1QkFBZSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7UUFDMUMsS0FBSztRQUNMLE9BQU87S0FDUixDQUFDO0lBRUYsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQTVERCxrQ0E0REMifQ==