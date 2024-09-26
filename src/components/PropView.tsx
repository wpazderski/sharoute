import { Box, Group, InputLabel, Stack } from "@mantine/core";
import { MiniCopyButton } from "./MiniCopyButton";

export interface PropViewProps extends React.PropsWithChildren {
    label: string;
    monospaceFont?: boolean | undefined;
    copyValue?: string | undefined;
    copyButtonLocation?: "before" | "after" | undefined;
}

export function PropView(props: PropViewProps) {
    const copyButtonLocation = props.copyButtonLocation ?? "after";

    return (
        <Stack gap={5} bg="gray.1" style={{ borderRadius: 5 }} p="md">
            <InputLabel c="gray.7">{props.label}</InputLabel>
            <Group gap={5}>
                {props.copyValue === undefined || copyButtonLocation === "after" ? null : <MiniCopyButton value={props.copyValue} />}
                <Box ff={props.monospaceFont === true ? "monospace" : "text"}>{props.children}</Box>
                {props.copyValue === undefined || copyButtonLocation === "before" ? null : <MiniCopyButton value={props.copyValue} />}
            </Group>
        </Stack>
    );
}
