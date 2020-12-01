import { aliasedSitePath, normalizeUrl, parseMarkdownString } from '@docusaurus/utils';
import fs from 'fs-extra';
import path from 'path';
import striptags from 'striptags';
function inferVersion(dirName, versions) {
    const maybeVersion = dirName.split('/', 1).shift();
    const inferredVersion = maybeVersion ? maybeVersion.replace(/^version-/, '') : null;
    return inferredVersion && versions.includes(inferredVersion) ? inferredVersion : null;
}
function versionFromSource(dirName, versions) {
    return /^version-/.test(dirName) ? inferVersion(dirName, versions) : 'next';
}
export default async function processMetadata({ source, refDir, context, options, env, }) {
    const { routeBasePath } = options;
    const { siteDir, baseUrl } = context;
    const { versioning } = env;
    const dirName = path.dirname(source);
    const filePath = path.join(refDir, source);
    const fileStringPromise = fs.readFile(filePath, 'utf-8');
    const version = (versioning.enabled) ? versionFromSource(dirName, versioning.versions) : null;
    // The version portion of the url path. Eg: 'next', '1.0.0', and ''
    const versionPath = version && version !== versioning.latestVersion ? version : '';
    const contents = await fileStringPromise;
    const { frontMatter = {}, excerpt, content } = parseMarkdownString(contents);
    const plaintext = striptags(content);
    const baseID = frontMatter.id || path.basename(source, path.extname(source));
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
    const permalink = normalizeUrl([
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
        source: aliasedSitePath(filePath, siteDir),
        title,
        version,
    };
    return metadata;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdkYsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLFNBQVMsTUFBTSxXQUFXLENBQUM7QUFJbEMsU0FBUyxZQUFZLENBQUMsT0FBZSxFQUFFLFFBQStCO0lBQ3BFLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25ELE1BQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNwRixPQUFPLGVBQWUsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN4RixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsUUFBK0I7SUFDekUsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDOUUsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLGVBQWUsQ0FBQyxFQUM1QyxNQUFNLEVBQ04sTUFBTSxFQUNOLE9BQU8sRUFDUCxPQUFPLEVBQ1AsR0FBRyxHQUNKO0lBQ0MsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUNsQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUNyQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBRTNCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0MsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV6RCxNQUFNLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTlGLG1FQUFtRTtJQUNuRSxNQUFNLFdBQVcsR0FBRyxPQUFPLElBQUksT0FBTyxLQUFLLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRW5GLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWlCLENBQUM7SUFDekMsTUFBTSxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVwQyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM3RSw0Q0FBNEM7SUFDNUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztLQUNwRDtJQUNELGdDQUFnQztJQUVoQyxxQ0FBcUM7SUFDckMsTUFBTSxFQUFFLEdBQUcsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUU3RCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQztJQUV2RCx5REFBeUQ7SUFDekQsTUFBTSxTQUFTLEdBQ2IsT0FBTyxJQUFJLE9BQU8sS0FBSyxNQUFNO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFlBQVksT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNULE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQztRQUM3QixPQUFPO1FBQ1AsYUFBYTtRQUNiLFdBQVc7UUFDWCxTQUFTO0tBQ1YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxRQUFRLEdBQWdCO1FBQzVCLFdBQVc7UUFDWCxFQUFFO1FBQ0YsU0FBUztRQUNULFNBQVM7UUFDVCxNQUFNLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7UUFDMUMsS0FBSztRQUNMLE9BQU87S0FDUixDQUFDO0lBRUYsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyJ9