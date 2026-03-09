import type { Plugin } from '@opencode-ai/plugin'

export const RustTokenKillerPlugin: Plugin = async (ctx) => {
    const isRtkInstalled = await ctx.$`rtk gain`
        .quiet()
        .then(() => true)
        .catch(() => false)

    if (!isRtkInstalled) return {}

    return {
        'tool.execute.before': async (input, output) => {
            const tool = String(input.tool ?? '').toLowerCase()

            if (tool !== 'bash' && tool !== 'shell') return
            if (!output.args) return

            const result = await ctx.$`rtk rewrite ${String(output.args.command)}`
                .quiet()
                .text()
                .catch(() => '')
            const rewritten = result.trim()

            if (!rewritten) return

            Object.assign(output.args, { command: rewritten })
        },
    }
}
