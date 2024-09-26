import Link from "next/link";
import type React from "react";
import { Icon } from "./Icon";

export interface LinkExternalProps extends React.ComponentProps<typeof Link> {}

export function LinkExternal(props: LinkExternalProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const { children, ...otherProps } = props;

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Link {...otherProps}>
            {children} <Icon name="externalLink" />
        </Link>
    );
}
