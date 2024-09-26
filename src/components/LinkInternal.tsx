import Link from "next/link";
import type React from "react";
import { Icon } from "./Icon";

export interface LinkInternalProps extends React.ComponentProps<typeof Link> {}

export function LinkInternal(props: LinkInternalProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const { children, ...otherProps } = props;

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Link {...otherProps}>
            {children} <Icon name="internalLink" />
        </Link>
    );
}
