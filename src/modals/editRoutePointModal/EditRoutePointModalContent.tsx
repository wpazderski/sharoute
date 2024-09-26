import { Center, type ComboboxData, Group, Select, Stack, TextInput } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { RichTextEditor } from "@/components/richTextEditor/RichTextEditor";
import { routePointTypes } from "@/lib/db/collections/routes/routePointTypes";
import type { RoutePoint, RoutePointDescription, RoutePointName, RoutePointType } from "@/lib/db/collections/routes/types";

export interface EditRoutePointModalContentProps {
    routePoint: RoutePoint;
    setRoutePoints: Dispatch<SetStateAction<RoutePoint[]>>;
    close: () => void;
}

export function EditRoutePointModalContent(props: EditRoutePointModalContentProps) {
    const t = useTranslations("modals.editRoutePoint");
    const tRoutePointTypes = useTranslations("routePointTypes");
    const [selectedType, setSelectedType] = useState<RoutePointType>(props.routePoint.type);
    const propsSetRoutePoints = props.setRoutePoints;
    const propsClose = props.close;
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionEditorRef = useRef<Editor | null>(null);

    const typeSelectOptions: ComboboxData = useMemo(() => {
        return routePointTypes
            .filter((value) => {
                // Photos haven't been implemented yet
                if (value === "photos") {
                    return false;
                }
                return true;
            })
            .map((value) => ({
                value,
                label: tRoutePointTypes(value),
                disabled: value === "routeStart" || value === "routeEnd",
            }));
    }, [tRoutePointTypes]);

    const handleTypeChange = useCallback(
        (value: string | null) => {
            setSelectedType(value === null ? props.routePoint.type : (value as RoutePointType));
        },
        [props.routePoint.type],
    );

    const handleDescriptionEditorChange = useCallback((editor: Editor | null) => {
        descriptionEditorRef.current = editor;
    }, []);

    const handleOkClick = useCallback(() => {
        propsSetRoutePoints((prev) => {
            if (nameInputRef.current === null || descriptionEditorRef.current === null) {
                return prev;
            }
            const newRoutePoints = [...prev];
            const idx = newRoutePoints.findIndex((value) => value.id === props.routePoint.id);
            if (idx < 0) {
                return prev;
            }
            newRoutePoints[idx] = {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...newRoutePoints[idx]!,
                type: selectedType,
                name: nameInputRef.current.value as RoutePointName,
                description: descriptionEditorRef.current.getHTML() as RoutePointDescription,
            };
            return newRoutePoints;
        });
        propsClose();
    }, [propsSetRoutePoints, props.routePoint.id, selectedType, propsClose]);

    const handleCancelClick = useCallback(() => {
        if (nameInputRef.current === null || descriptionEditorRef.current === null) {
            propsClose();
            return;
        }
        setSelectedType(props.routePoint.type);
        nameInputRef.current.value = props.routePoint.name;
        descriptionEditorRef.current.commands.setContent(props.routePoint.description);
        propsClose();
    }, [props.routePoint.description, props.routePoint.name, props.routePoint.type, propsClose]);

    return (
        <Stack gap="md">
            <Select
                value={selectedType}
                onChange={handleTypeChange}
                label={t("fields.type.label")}
                placeholder={t("fields.type.placeholder")}
                data={typeSelectOptions}
                comboboxProps={{ offset: 0 }}
                labelProps={{ c: "gray.7" }}
                disabled={props.routePoint.type === "routeStart" || props.routePoint.type === "routeEnd"}
            />
            <TextInput ref={nameInputRef} label={t("fields.name.label")} placeholder={t("fields.name.placeholder")} defaultValue={props.routePoint.name} />
            <RichTextEditor
                onEditorChange={handleDescriptionEditorChange}
                label={t("fields.description.label")}
                placeholder={t("fields.description.placeholder")}
                h={350}
                value={props.routePoint.description}
            />
            <Center>
                <Group>
                    <Button type="button" preset="ok" size="sm" onClick={handleOkClick} />
                    <Button type="button" preset="cancel" size="sm" onClick={handleCancelClick} />
                </Group>
            </Center>
        </Stack>
    );
}
