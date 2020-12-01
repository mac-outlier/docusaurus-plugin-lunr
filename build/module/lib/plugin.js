import fs from 'fs-extra';
import globby from 'globby';
import { flatten } from 'lodash/fp';
import lunr from 'lunr';
import path from 'path';
import loadEnv from './env';
import processMetadata from './metadata';
const DEFAULT_OPTIONS = {
    include: ['**/*.{md,mdx}'],
    path: 'docs',
    routeBasePath: 'docs',
};
export default function pluginContentLunr(context, opts) {
    const options = { ...DEFAULT_OPTIONS, ...opts };
    const { siteDir } = context;
    const docsDir = path.resolve(siteDir, options.path);
    // Versioning
    const env = loadEnv(siteDir);
    const { versioning } = env;
    const { versions, docsDir: versionedDir } = versioning;
    const versionsNames = versions.map(version => `version-${version}`);
    return {
        name: 'docusaurus-plugin-lunr',
        getThemePath() {
            return path.resolve(__dirname, '../theme');
        },
        // tslint:disable-next-line: readonly-array
        getPathsToWatch() {
            const { include } = options;
            const versionGlobPattern = (!versioning.enabled) ? [] : flatten(include.map(p => versionsNames.map(v => `${versionedDir}/${v}/${p}`)));
            return [...versionGlobPattern];
        },
        async loadContent() {
            const { include } = options;
            // tslint:disable-next-line: no-if-statement
            if (!await fs.exists(docsDir)) {
                return null;
            }
            // // Metadata for default/ master docs files.
            // const docsFiles = await globby(include, { cwd: docsDir });
            // const docsPromises = docsFiles.map(async source => processMetadata({
            //   context,
            //   env,
            //   options,
            //   refDir: docsDir,
            //   source,
            // }));
            // Metadata for versioned docs
            const versionedGlob = flatten(include.map(p => versionsNames.map(v => `${v}/${p}`)));
            const versionedFiles = await globby(versionedGlob, { cwd: versionedDir });
            const versionPromises = (!versioning.enabled) ? [] : versionedFiles.map(async (source) => processMetadata({
                context,
                env,
                options,
                refDir: versionedDir,
                source,
            }));
            // const metadata = await Promise.all([...docsPromises, ...versionPromises]);
            const metadata = await Promise.all([...versionPromises]);
            return ({ metadata });
        },
        contentLoaded({ content, actions }) {
            const { metadata = [] } = content;
            const { createData } = actions;
            // tslint:disable: no-expression-statement no-this typedef
            const index = lunr(function () {
                this.ref('route');
                this.field('title');
                this.field('content');
                this.field('version');
                // Reference: https://github.com/olivernn/moonwalkers/blob/6d5a6e976921490033681617e92ea42e3a80eed0/build-index#L29.
                this.metadataWhitelist = ['position'];
                metadata.forEach(function ({ permalink, title, version, plaintext }) {
                    this.add({
                        content: plaintext,
                        route: permalink,
                        title,
                        version
                    });
                }, this);
                // tslint:enable: no-expression-statement no-this typedef
            });
            const documents = metadata.map(({ permalink: route, title, version }) => ({ route, title, version }));
            // tslint:disable-next-line: no-expression-statement
            createData('search-index.json', JSON.stringify({ index, documents }, null, 2));
            createData('meta.json', JSON.stringify(metadata, null, 2));
        }
    };
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFHeEIsT0FBTyxPQUFPLE1BQU0sT0FBTyxDQUFDO0FBQzVCLE9BQU8sZUFBZSxNQUFNLFlBQVksQ0FBQztBQUd6QyxNQUFNLGVBQWUsR0FBa0I7SUFDckMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzFCLElBQUksRUFBRSxNQUFNO0lBQ1osYUFBYSxFQUFFLE1BQU07Q0FDdEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLFVBQVUsaUJBQWlCLENBQ3ZDLE9BQW9CLEVBQ3BCLElBQTRCO0lBRTVCLE1BQU0sT0FBTyxHQUFHLEVBQUUsR0FBRyxlQUFlLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztJQUNoRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQzVCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRCxhQUFhO0lBQ2IsTUFBTSxHQUFHLEdBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDM0IsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ3ZELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFX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