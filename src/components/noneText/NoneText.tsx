import { type MantineSize, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

export interface NoneTextProps {
    inline?: boolean | undefined;
    size?: MantineSize | (string & {});
}

export function NoneText(props: NoneTextProps) {
    const t = useTranslations("components.noneText");

    return (
        <Text c="dimmed" fs="italic" size={props.size} component={props.inline === true ? "span" : "p"}>
            {t("none")}
        </Text>
    );
}
