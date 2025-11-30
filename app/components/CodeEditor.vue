<!-- app/components/CodeEditor.vue -->
<script setup lang="ts">
import * as monaco from 'monaco-editor'

// 引入 Worker
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])
const editorContainer = shallowRef<HTMLElement | null>(null)
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

self.MonacoEnvironment = {
    getWorker(_: any, label: string) {
        if (label === 'json') return new jsonWorker()
        if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
        if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
        if (label === 'typescript' || label === 'javascript') return new tsWorker()
        return new editorWorker()
    }
}

const initIntelliSense = () => {
    const defaults = (monaco.languages as any).typescript.javascriptDefaults
    defaults.setCompilerOptions({
        target: 99,
        allowNonTsExtensions: true,
        noLib: false
    })

    // [修复] 添加 pickUp 和 attack 到类型定义中
    defaults.addExtraLib(`
    /**
     * The Robot Object. Control it to reach the goal!
     */
    declare class Robot {
        /** Move the robot UP (Backwards). */
        moveUp(steps?: number): void;
        /** Move the robot DOWN (Forwards). */
        moveDown(steps?: number): void;
        /** Move the robot LEFT. */
        moveLeft(steps?: number): void;
        /** Move the robot RIGHT. */
        moveRight(steps?: number): void;

        /** 
         * Pick up an item (Key, Weapon) from the current tile. 
         * The item will be stored in your Backpack.
         */
        pickUp(): void;

        /**
         * Attack a target entity.
         * @param target The entity element (e.g., from document.querySelector)
         */
        attack(target: any): void;
    }
    
    // Declare global variables
    declare const robot: Robot;
    declare const document: any;
    declare const console: any;
  `, 'ts:filename/robot.d.ts')
}

onMounted(() => {
    if (editorContainer.value) {
        initIntelliSense()

        // 注册代码片段 (保持不变)
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position)
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                }

                const suggestions = [
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ['if (${1:condition}) {', '\t$0', '}'].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'If Statement',
                        range: range
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ['for (let ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {', '\t$0', '}'].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'For Loop',
                        range: range
                    },
                    {
                        label: 'while',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ['while (${1:condition}) {', '\t$0', '}'].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'While Loop',
                        range: range
                    }
                ]
                return { suggestions: suggestions }
            }
        })

        editorInstance.value = monaco.editor.create(editorContainer.value, {
            value: props.modelValue,
            language: 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            fontFamily: '"Courier New", Courier, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true }
        })

        editorInstance.value.onDidChangeModelContent(() => {
            const value = editorInstance.value?.getValue() || ''
            emit('update:modelValue', value)
        })
    }
})

watch(() => props.modelValue, (newValue) => {
    if (editorInstance.value && newValue !== editorInstance.value.getValue()) {
        toRaw(editorInstance.value).setValue(newValue)
    }
})

onBeforeUnmount(() => {
    if (editorInstance.value) {
        toRaw(editorInstance.value).dispose()
    }
})
</script>

<template>
    <div ref="editorContainer" class="w-full h-full min-h-[300px]"></div>
</template>
