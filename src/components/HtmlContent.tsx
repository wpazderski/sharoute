import { TypographyStylesProvider } from "@mantine/core";

export interface HtmlContentProps {
    html: string;
}

export function HtmlContent(props: HtmlContentProps) {
    return (
        <TypographyStylesProvider>
            {/* eslint-disable-next-line react/no-danger, @typescript-eslint/naming-convention */}
            <div dangerouslySetInnerHTML={{ __html: props.html }} />
        </TypographyStylesProvider>
    );
}
