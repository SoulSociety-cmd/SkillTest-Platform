// Sentry webpack config overrides
import * as bundleAnalysis from '@sentry/nextjs/dist/webpack-plugins/analyzer'

const config = {
  // Org/project set in next.config.mjs
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: 'skilltest',
  project: 'skilltest-nextjs',
  // Upload sourcemaps to release
  release: {
    name: process.env.SENTRY_RELEASE || `skilltest-nextjs@${process.env.npm_package_version}`,
  },
  // Transpilation
  esModuleGlobals: true,
  silent: true,
  // Analyzer
  webpackPluginOptions: {
    analyzerOptions: bundleAnalysis.defaultAnalyzerOptions
  }
}

export default config
