import { Box, Stack, Text, Title } from "@mantine/core";

export interface PageWrapperProps extends React.PropsWithChildren {
    title: React.ReactNode;
    subTitle?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

const widthBySize = {
    sm: 500,
    md: 700,
    lg: 900,
    xl: 1200,
    full: "100%",
};

export function PageWrapper(props: PageWrapperProps) {
    const size = props.size ?? "md";

    return (
        <Stack maw={widthBySize[size]} gap={20} ml={20}>
            <Stack gap="m">
                <Title order={1}>{props.title}</Title>
                {props.subTitle === undefined ? null : <Text>{props.subTitle}</Text>}
            </Stack>
            <Box>{props.children}</Box>
        </Stack>
    );
}
