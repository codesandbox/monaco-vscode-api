import * as rollup from 'rollup'
import dts from 'rollup-plugin-dts'
import * as path from 'path'

const VSCODE_DIR = path.join(__dirname, '../vscode')

const interfaceOverride = new Map<string, string>()
interfaceOverride.set('Event<T>', 'vscode.Event<T>')
interfaceOverride.set('ICodeEditor', 'monaco.editor.ICodeEditor')
interfaceOverride.set('URI', 'monaco.Uri')
interfaceOverride.set('ITextModel', 'monaco.editor.ITextModel')
interfaceOverride.set('vs/editor/common/config/editorOptions:IEditorOptions', 'monaco.editor.IEditorOptions')

export default rollup.defineConfig([
  './dist/types/src/services.d.ts',
  './dist/types/src/service-override/messages.d.ts',
  './dist/types/src/service-override/modelEditor.d.ts'
].map((input): rollup.RollupOptions => ({
  input,
  output: {
    format: 'esm',
    dir: 'dist',
    entryFileNames: chunk => `${chunk.name}.ts`
  },
  external: function isExternal (id) {
    if (id === 'vscode') {
      return true
    }
    if (id === 'monaco-editor') {
      return true
    }
    if (id.endsWith('.css')) {
      return true
    }
    return false
  },
  plugins: [
    {
      name: 'ignore-css',
      load (id) {
        if (id.includes('vs/css!') || id.endsWith('.css')) {
          return 'export default undefined;'
        }
        return undefined
      }
    },
    {
      name: 'change-unsupported-syntax',
      transform (code) {
        return code.replace('export import Severity = BaseSeverity;', 'type Severity = BaseSeverity; export { Severity }')
      }
    },
    {
      name: 'replace-interfaces',
      transform (code, id) {
        interfaceOverride.forEach((value, key) => {
          const [, path, name] = /(?:(.*):)?(.*)/.exec(key)!
          if (path == null || path === id) {
            code = code.replace(`interface ${name} `, `type ${name} = ${value}\ninterface _${name} `)
          }
        })

        return `import * as monaco from 'monaco-editor'\nimport * as vscode from 'vscode'\n${code}`
      }
    },
    {
      name: 'resolve-vscode',
      resolveId: async function (importee, importer) {
        if (importee.startsWith('vscode/')) {
          return path.resolve(VSCODE_DIR, path.relative('vscode', `${importee}.d.ts`))
        }
        if (!importee.startsWith('vs/') && importer != null && importer.startsWith(VSCODE_DIR)) {
          importee = path.relative(VSCODE_DIR, path.resolve(path.dirname(importer), importee))
        }
        // const overridePath = path.resolve(OVERRIDE_PATH, `${importee}.d.ts`)
        // if (fs.existsSync(overridePath)) {
        //   return overridePath
        // }
        if (importee.startsWith('vs/')) {
          return path.join(VSCODE_DIR, `${importee}.d.ts`)
        }
        return undefined
      }
    },
    dts({
      respectExternal: true
    })
  ]
})))
