import js from '@eslint/js'
import { defineConfig } from 'eslint/config'

// @ts-check
import tseslint from 'typescript-eslint'

// React-query
import pluginQuery from '@tanstack/eslint-plugin-query'

export default defineConfig(
    js.configs.recommended,
    tseslint.configs.recommended,
    [...pluginQuery.configs['flat/recommended']]
)
