"use client";

import { Box, InputLabel, ScrollArea, type StyleProp } from "@mantine/core";
import { Link, RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { type Editor, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import styles from "./RichTextEditor.module.scss";

export interface RichTextEditorProps {
    value: string;
    label?: string | undefined;
    placeholder?: string | undefined;
    h?: StyleProp<React.CSSProperties["height"]> | undefined;
    onEditorChange?: ((editor: Editor | null) => void) | undefined;
    onValueChange?: ((value: string) => void) | undefined;
}

const colorPickerColors = ["#777777", "#0089ff", "#24b2c6", "#11803f", "#ff0000", "#ff6900", "#7950f2"];

export function RichTextEditor(props: RichTextEditorProps) {
    const propsOnEditorChange = props.onEditorChange;
    const editor = useEditor({
        extensions: [
            StarterKit,
            Color,
            Highlight,
            Link,
            Placeholder.configure({ placeholder: props.placeholder }),
            SubScript,
            Superscript,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TextStyle,
            Underline,
        ],
        immediatelyRender: false,
        content: props.value,
        onUpdate: () => {
            if (editor === null) {
                return;
            }
            props.onValueChange?.(editor.getHTML());
        },
    });

    useEffect(() => {
        propsOnEditorChange?.(editor);
    }, [editor, propsOnEditorChange]);

    return (
        <Box>
            {props.label === undefined ? null : <InputLabel>{props.label}</InputLabel>}
            <MantineRichTextEditor editor={editor} h={props.h} withTypographyStyles={true} style={{ display: "flex", flexDirection: "column" }}>
                <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.Bold />
                        <MantineRichTextEditor.Italic />
                        <MantineRichTextEditor.Underline />
                        <MantineRichTextEditor.Strikethrough />
                        <MantineRichTextEditor.ClearFormatting />
                        <MantineRichTextEditor.Highlight />
                        <MantineRichTextEditor.Code />
                        <MantineRichTextEditor.CodeBlock />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.ColorPicker colors={colorPickerColors} />
                        <MantineRichTextEditor.UnsetColor />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.H1 />
                        <MantineRichTextEditor.H2 />
                        <MantineRichTextEditor.H3 />
                        <MantineRichTextEditor.H4 />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.Blockquote />
                        <MantineRichTextEditor.Hr />
                        <MantineRichTextEditor.BulletList />
                        <MantineRichTextEditor.OrderedList />
                        <MantineRichTextEditor.Subscript />
                        <MantineRichTextEditor.Superscript />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.Link />
                        <MantineRichTextEditor.Unlink />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.AlignLeft />
                        <MantineRichTextEditor.AlignCenter />
                        <MantineRichTextEditor.AlignJustify />
                        <MantineRichTextEditor.AlignRight />
                    </MantineRichTextEditor.ControlsGroup>

                    <MantineRichTextEditor.ControlsGroup>
                        <MantineRichTextEditor.Undo />
                        <MantineRichTextEditor.Redo />
                    </MantineRichTextEditor.ControlsGroup>
                </MantineRichTextEditor.Toolbar>
                <ScrollArea style={{ flex: "1 1 auto" }} className={styles["content-scroll-area"]} type="auto">
                    <MantineRichTextEditor.Content h="100%" />
                </ScrollArea>
            </MantineRichTextEditor>
        </Box>
    );
}
