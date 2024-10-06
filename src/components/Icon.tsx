import {
    IconAlertTriangleFilled,
    IconArrowRight,
    IconBackspace,
    IconBrandGithub,
    IconCheck,
    IconCopy,
    IconDeviceFloppy,
    IconDownload,
    IconExclamationMark,
    IconExternalLink,
    IconFocus2,
    IconHome,
    IconInfoCircleFilled,
    IconLogin,
    IconLogout,
    IconMapPin,
    IconPencil,
    IconPlus,
    IconQuestionMark,
    IconRoute,
    IconShare,
    IconTrash,
    IconUpload,
    IconX,
    IconZoomQuestionFilled,
} from "@tabler/icons-react";

export interface IconProps {
    name: IconName;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    className?: string | undefined;
}

export function Icon(props: IconProps) {
    const IconComponent = iconsMap[props.name];
    const size = iconSizes[props.size ?? "md"];

    return <IconComponent size={size} className={props.className} />;
}

const iconsMap = {
    add: IconPlus,
    cancel: IconX,
    check: IconCheck,
    close: IconCheck,
    confirm: IconCheck,
    copy: IconCopy,
    delete: IconTrash,
    download: IconDownload,
    edit: IconPencil,
    error: IconX,
    externalLink: IconExternalLink,
    github: IconBrandGithub,
    home: IconHome,
    info: IconQuestionMark,
    infoCircle: IconInfoCircleFilled,
    internalLink: IconArrowRight,
    mapGoToLatLon: IconFocus2,
    remove: IconX,
    reset: IconBackspace,
    routes: IconRoute,
    routePoint: IconMapPin,
    save: IconDeviceFloppy,
    share: IconShare,
    signIn: IconLogin,
    signOut: IconLogout,
    submit: IconCheck,
    update: IconDeviceFloppy,
    upload: IconUpload,
    viewDetails: IconZoomQuestionFilled,
    warning: IconExclamationMark,
    warningTriangle: IconAlertTriangleFilled,
    write: IconPencil,
} as const;

export type IconName = keyof typeof iconsMap;

const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;
