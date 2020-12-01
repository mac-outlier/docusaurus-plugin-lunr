"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
const fp_1 = require("lodash/fp");
const lunr_1 = __importDefault(require("lunr"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("./env"));
const metadata_1 = __importDefault(require("./metadata"));
const DEFAULT_OPTIONS = {
    include: ['**/*.{md,mdx}'],
    path: 'docs',
    routeBasePath: 'docs',
};
function pluginContentLunr(context, opts) {
    const options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), opts);
    const { siteDir } = context;
    const docsDir = path_1.default.resolve(siteDir, options.path);
    // Versioning
    const env = env_1.default(siteDir);
    const { versioning } = env;
    const { versions, docsDir: versionedDir } = versioning;
    const versionsNames = versions.map(version => `version-${version}`);
    return {
        name: 'docusaurus-plugin-lunr',
        getThemePath() {
            return path_1.default.resolve(__dirname, '../theme');
        },
        // tslint:disable-next-line: readonly-array
        getPathsToWatch() {
            const { include } = options;
            const versionGlobPattern = (!versioning.enabled) ? [] : fp_1.flatten(include.map(p => versionsNames.map(v => `${versionedDir}/${v}/${p}`)));
            return [...versionGlobPattern];
        },
        async loadContent() {
            const { include } = options;
            // tslint:disable-next-line: no-if-statement
            if (!await fs_extra_1.default.exists(docsDir)) {
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
            const versionedGlob = fp_1.flatten(include.map(p => versionsNames.map(v => `${v}/${p}`)));
            const versionedFiles = await globby_1.default(versionedGlob, { cwd: versionedDir });
            const versionPromises = (!versioning.enabled) ? [] : versionedFiles.map(async (source) => metadata_1.default({
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
            const index = lunr_1.default(function () {
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
exports.default = pluginContentLunr;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx3REFBMEI7QUFDMUIsb0RBQTRCO0FBQzVCLGtDQUFvQztBQUNwQyxnREFBd0I7QUFDeEIsZ0RBQXdCO0FBR3hCLGdEQUE0QjtBQUM1QiwwREFBeUM7QUFHekMsTUFBTSxlQUFlLEdBQWtCO0lBQ3JDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUMxQixJQUFJLEVBQUUsTUFBTTtJQUNaLGFBQWEsRUFBRSxNQUFNO0NBQ3RCLENBQUM7QUFFRixTQUF3QixpQkFBaUIsQ0FDdkMsT0FBb0IsRUFDcEIsSUFBNEI7SUFFNUIsTUFBTSxPQUFPLG1DQUFRLGVBQWUsR0FBSyxJQUFJLENBQUUsQ0FBQztJQUNoRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQzVCLE1BQU0sT0FBTyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRCxhQUFhO0lBQ2IsTUFBTSxHQUFHLEdBQVEsYUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDM0IsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ3ZELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFcEUsT0FBTztRQUNMLElBQUksRUFBRSx3QkFBd0I7UUFFOUIsWUFBWTtZQUNWLE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELDJDQUEyQztRQUMzQyxlQUFlO1lBQ2Is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