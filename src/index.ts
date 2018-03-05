import {WorkFlowContext, File, Plugin} from 'fuse-box'
import * as jsyaml from 'js-yaml'

// note: this plugin is a copy paste from JSONPlugin
export class FuseBoxYAMLPlugin implements Plugin {
  public test: RegExp = /\.(yaml|yml)$/

  public init(context: WorkFlowContext) {
    context.allowExtension('.yaml');
    context.allowExtension('.yml');
  }

  public transform(file: File) {
    const context = file.context

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()


    let contents = JSON.stringify(jsyaml.load(file.contents)) || {}
    file.contents = `module.exports = ${contents};`

    if (context.useCache) {
      context.emitJavascriptHotReload(file)
      context.cache.writeStaticCache(file, file.sourceMap)
    }
  }
};

export const YAMLPlugin = () => {
  return new FuseBoxYAMLPlugin()
}
