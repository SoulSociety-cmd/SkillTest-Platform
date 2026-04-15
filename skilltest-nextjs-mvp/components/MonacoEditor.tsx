'use client'

import Editor from '@monaco-editor/react'
import { useState } from 'react'

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
}

export default function MonacoEditor({ value, onChange, height = '500px' }: MonacoEditorProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-1 hover:border-blue-400 transition-all bg-gradient-to-b from-gray-50 to-white">
      <Editor
        height={height}
        defaultLanguage="javascript"
        theme="vs-dark"
        value={value}
        onChange={onChange as any}
        options={{
          minimap: { enabled: true },
          fontSize: 16,
          wordWrap: 'on',
          automaticLayout: true,
          fontFamily: 'Monaco, Menlo, monospace',
        }}
      />
    </div>
  )
}
