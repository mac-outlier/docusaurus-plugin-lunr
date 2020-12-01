import { LoadContext, Plugin, PluginContentLoadedActions } from '@docusaurus/types';
import fs from 'fs-extra';
import globby from 'globby';
import { flatten } from 'lodash/fp';
import lunr from 'lunr';
import path from 'path';


import loadEnv from './env';
import processMetadata from './metadata';
import { Env, LoadedContent, PluginOptions } from './types';

const DEFAULT_OPTIONS: PluginOptions = {
  include: ['**/*.{md,mdx}'], // Extensions to include.
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
};

export default function pluginContentLunr(
  context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<LoadedContent | null> {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { siteDir } = context;
  const docsDir = path.resolve(siteDir, options.path);

  // Versioning
  const env: Env = loadEnv(siteDir);
  const { versioning } = env;
  const { versions, docsDir: versionedDir } = versioning;
  const versionsNames = versions.map(version => `version-${version}`);

  return {
    name: 'docusaurus-plugin-lunr',

    getThemePath(): string {
      return path.resolve(__dirname, '../theme');
    },

    // tslint:disable-next-line: readonly-array
    getPathsToWatch(): string[] {
      const { include } = options;
      const versionGlobPattern = (!versioning.enabled) ? [] : flatten(
        include.map(p => versionsNames.map(v => `${versionedDir}/${v}/${p}`))
      );
      return [...versionGlobPattern];
    },

    async loadContent(): Promise<LoadedContent> {
      const { include } = options;

      // tslint:disable-next-line: no-if-statement
      if (!await fs.exists(docsDir)) {
        return null;
      }

      // Metadata for versioned docs
      const versionedGlob = flatten(include.map(p => versionsNames.map(v => `${v}/${p}`)));
      const versionedFiles = await globby(versionedGlob, { cwd: versionedDir });
      const versionPromises = (!versioning.enabled) ? [] : versionedFiles.map(async source => processMetadata({
        context,
        env,
        options,
        refDir: versionedDir,
        source,
      }));

      const metadata = await Promise.all([...versionPromises]);
      return ({ metadata });
    },

    contentLoaded({
      content,
      actions
    }: {
      readonly content: LoadedContent,
      readonly actions: PluginContentLoadedActions
    }): void {
      const { metadata = [] } = content;
      const { createData } = actions;

      // tslint:disable: no-expression-statement no-this typedef
      const index = lunr(function () {
        this.ref('route');
        this.field('title');
        this.field('content');
        this.field('version');

        // Reference: https://github.com/olivernn/moonwalkers/blob/6d5a6e976921490033681617e92ea42e3a80eed0/build-index#L29.
        this.metadataWhitelist = ['position']

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
};
