import { Text, TimelineItem } from "@mantine/core";
import { Icon, type IconName } from "@/components/Icon";

export interface IntroItemProps {
    iconName: IconName;
    title: React.ReactNode;
    description: React.ReactNode;
}

export function IntroItem(props: IntroItemProps) {
    return (
        <TimelineItem bullet={<Icon name={props.iconName} size="lg" />} title={props.title}>
            <Text c="gray.8" size="sm">
                {props.description}
            </Text>
        </TimelineItem>
    );
}
