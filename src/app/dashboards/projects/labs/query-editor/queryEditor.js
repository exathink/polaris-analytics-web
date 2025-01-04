import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import 'monaco-sql-languages/esm/languages/mysql/mysql.contribution';
import 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution';
import { setupLanguageFeatures, LanguageIdEnum } from 'monaco-sql-languages';

export function SQLEditor(){
  const monaco = useMonaco();

  const [code, setCode] = useState("// type your SQL here\n");

  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);

    // Add action
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const selectedText = editor.getModel().getValueInRange(editor.getSelection());
      if (selectedText) {
        console.log('excuting on server..', selectedText);
      }
    });

    editor.focus();
  }



  useEffect(() => {
    if (monaco) {
      setupLanguageFeatures(LanguageIdEnum.PG, {
        completionItems: {
          enable: true,
          triggerCharacters: [' ', '.'],
        }
      });
    }
  }, [monaco]);



  return (
    <Editor
      height="100%"
      width="100%"
      theme={'vs-dark'}
      defaultLanguage={LanguageIdEnum.PG}
      defaultValue=""
      onMount={editorDidMount}
      
      options={{
        fontSize: 20
      }}
    />
  );
};

