import { useTranslations } from "next-intl";
import { appRoutes } from "@/app/appRoutes";
import { Button, type ButtonProps } from "../button/Button";

export interface CreateRouteButtonLinkProps {
    size?: ButtonProps["size"] | undefined;
}
export function CreateRouteButtonLink(props: CreateRouteButtonLinkProps) {
    const t = useTranslations("components.createRouteButtonLink");

    return (
        <Button type="link" href={appRoutes.route.create()} icon="add" size={props.size ?? "md"}>
            {t("text")}
        </Button>
    );
}
