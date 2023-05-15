import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ModuleOptions, MotionPluginOptions } from '../types'

const DEFAULTS: ModuleOptions = {}

const CONFIG_KEY = 'motion'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vueuse/motion',
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^3.0.0',
      bridge: true,
    },
  },
  defaults: DEFAULTS,
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Push options to runtimeConfig
    nuxt.options.runtimeConfig.public.motion = options

    // Add templates (options and directives)
    addPlugin(resolve('./runtime/templates/motion.js'))

    // Transpile necessary packages at build time
    if (!nuxt.options.build.transpile)
      nuxt.options.build.transpile = []
    const transpileList = ['defu', '@vueuse/motion', '@vueuse/shared', '@vueuse/core']
    transpileList.forEach(
      (pkgName) => {
        if (!nuxt.options.build.transpile.includes(pkgName))
          nuxt.options.build.transpile.push(pkgName)
      },
    )

    /**
     * Workaround for TSLib issue on @nuxt/bridge and nuxt3
     */
    if (!nuxt.options.alias)
      nuxt.options.alias = {}
    if (!nuxt.options.alias.tslib)
      nuxt.options.alias.tslib = 'tslib/tslib.es6.js'

    // Add auto imports
    nuxt.hook('nitro:config', (nitroConfig) => {
      if (!nitroConfig.imports) nitroConfig.imports = { imports: [] }
      if (!nitroConfig.imports.imports) nitroConfig.imports.imports = []

      nitroConfig.imports.imports.push({ name: 'reactiveStyle', as: 'reactiveStyle', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'reactiveStyle', as: 'reactiveStyle', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'reactiveTransform', as: 'reactiveTransform', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useElementStyle', as: 'useElementStyle', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useElementTransform', as: 'useElementTransform', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotion', as: 'useMotion', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotionControls', as: 'useMotionControls', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotionProperties', as: 'useMotionProperties', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotions', as: 'useMotions', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotionTransitions', as: 'useMotionTransitions', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useMotionVariants', as: 'useMotionVariants', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useSpring', as: 'useSpring', from: resolve('../index') })
      nitroConfig.imports.imports.push({ name: 'useReducedMotion', as: 'useReducedMotion', from: resolve('../index') })
    })
  },
})

interface ModulePublicRuntimeConfig extends MotionPluginOptions {}

interface ModulePrivateRuntimeConfig extends MotionPluginOptions {}

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      motion: ModulePublicRuntimeConfig
    }
    privateRuntimeConfig?: {
      motion: ModulePrivateRuntimeConfig
    }
  }
}
