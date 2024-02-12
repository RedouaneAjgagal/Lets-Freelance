import ReactQuill from "react-quill"

type DescriptionRichTextEditorProps = {
  textValue: string;
  onChange: (value: string, plainText: string) => void;
  error: string;
}

const DescriptionRichTextEditor = (props: React.PropsWithoutRef<DescriptionRichTextEditorProps>) => {
  return (
    <div className="relative pb-6 flex flex-col gap-1">
      <span className="text-lg font-medium">
        Description
      </span>
      <ReactQuill id="Description" theme="snow" value={props.textValue} onChange={(value, _, __, editor) => props.onChange(value, editor.getText())} className={`bg-white [&>.ql-container>.ql-editor]:min-h-[9rem] [&>.ql-container]:border-2 [&>.ql-container]:border-t [&>.ql-container]:rounded-b [&>.ql-toolbar]:border-2 [&>.ql-toolbar]:border-b [&>.ql-toolbar]:rounded-t ${props.error ? "[&>.ql-container]:border-red-300 [&>.ql-toolbar]:border-red-300" : "[&>.ql-container]:border-slate-300 [&>.ql-toolbar]:border-slate-300"}`} modules={{
        toolbar: [
          [{ size: [false, 'large', 'huge'] }],
          [{ "header": [false, 2, 3, 4] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },],
          ['link']
        ]
      }} />
      {props.error ?
        <span className="absolute right-0 bottom-1 text-red-600 text-sm">{props.error}</span>
        : null
      }
    </div>

  )
}

export default DescriptionRichTextEditor