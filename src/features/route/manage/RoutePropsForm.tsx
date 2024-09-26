import { Box, Center, Group, Stack, Switch, TextInput } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback, useRef } from "react";
import type { UpdateRouteRequest } from "@/app/api/route/update/types";
import { Button } from "@/components/button/Button";
import { RichTextEditor } from "@/components/richTextEditor/RichTextEditor";
import { RoutePointsTable } from "@/components/routePointsTable/RoutePointsTable";
import type { WithProcessingFunction } from "@/hooks/useProcessing";
import { ApiClient } from "@/lib/ApiClient";
import type { Route, RouteDescription, RouteHasElevation, RouteName, RoutePoint } from "@/lib/db/collections/routes/types";
import { ApiError } from "@/lib/errors/ApiError";
import { maxRouteNameLength } from "@/lib/validation/schemas";
import type { LatLon } from "@/units";
import { Notifications } from "@/utils/Notifications";

export interface RoutePropsFormProps {
    savedRoute: Route;
    setSavedRoute: Dispatch<SetStateAction<Route>>;
    unsavedRoute: Route;
    setUnsavedRoute: Dispatch<SetStateAction<Route>>;
    withProcessing: WithProcessingFunction<Route>;
    goToMapLatLon?: ((latLon: LatLon) => void) | undefined;
}

export function RoutePropsForm(props: RoutePropsFormProps) {
    const t = useTranslations("features.route.manage.form");
    const tApiErrors = useTranslations("apiErrors");

    // eslint-disable-next-line react/destructuring-assignment
    const { withProcessing, savedRoute, setSavedRoute, unsavedRoute, setUnsavedRoute } = props;
    const unsavedRouteRef = useRef(unsavedRoute);
    unsavedRouteRef.current = unsavedRoute;
    const savedRouteRef = useRef(savedRoute);
    savedRouteRef.current = savedRoute;
    const routeDescriptionEditorRef = useRef<Editor | null>(null);

    const handleSaveClick = useCallback(() => {
        void withProcessing(async () => {
            const request: UpdateRouteRequest = {
                routeId: unsavedRouteRef.current.id,
                routePropsToUpdate: {},
            };
            let hasAnyChanges = false;
            if (savedRouteRef.current.name !== unsavedRouteRef.current.name) {
                request.routePropsToUpdate.name = unsavedRouteRef.current.name;
                hasAnyChanges = true;
            }
            if (savedRouteRef.current.description !== unsavedRouteRef.current.description) {
                request.routePropsToUpdate.description = unsavedRouteRef.current.description;
                hasAnyChanges = true;
            }
            if (savedRouteRef.current.hasElevation !== unsavedRouteRef.current.hasElevation) {
                request.routePropsToUpdate.hasElevation = unsavedRouteRef.current.hasElevation;
                hasAnyChanges = true;
            }
            if (JSON.stringify(savedRouteRef.current.points) !== JSON.stringify(unsavedRouteRef.current.points)) {
                request.routePropsToUpdate.points = unsavedRouteRef.current.points;
                hasAnyChanges = true;
            }
            if (JSON.stringify(savedRouteRef.current.photoIds) !== JSON.stringify(unsavedRouteRef.current.photoIds)) {
                request.routePropsToUpdate.photoIds = unsavedRouteRef.current.photoIds;
                hasAnyChanges = true;
            }
            if (!hasAnyChanges) {
                return savedRouteRef.current;
            }
            const response = await ApiClient.updateRoute(request);
            setSavedRoute(response.route);
            setUnsavedRoute(response.route);
            routeDescriptionEditorRef.current?.commands.setContent(response.route.description);
            return response.route;
        }).then((result) => {
            if (result.success) {
                Notifications.showSuccess({ message: t("result.success") });
            } else {
                if (result.error instanceof ApiError) {
                    Notifications.showError({ message: tApiErrors(result.error.errorI18nKey) });
                } else {
                    Notifications.showError({ message: t("result.error") });
                }
            }
        });
    }, [withProcessing, setSavedRoute, setUnsavedRoute, t, tApiErrors]);

    const handleResetClick = useCallback(() => {
        setUnsavedRoute(savedRoute);
        routeDescriptionEditorRef.current?.commands.setContent(savedRoute.description);
    }, [savedRoute, setUnsavedRoute]);

    const handleRouteNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value as RouteName;
            setUnsavedRoute((prev) => ({
                ...prev,
                name: value,
            }));
        },
        [setUnsavedRoute],
    );

    const handleRouteHasElevationChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.currentTarget.checked as RouteHasElevation;
            setUnsavedRoute((prev) => ({
                ...prev,
                hasElevation: value,
            }));
        },
        [setUnsavedRoute],
    );

    const handleRouteDescriptionEditorChange = useCallback((editor: Editor | null) => {
        routeDescriptionEditorRef.current = editor;
    }, []);

    const handleRouteDescriptionChange = useCallback(
        (description: string) => {
            setUnsavedRoute((prev) => ({
                ...prev,
                description: description as RouteDescription,
            }));
        },
        [setUnsavedRoute],
    );

    const setUnsavedRoutePoints: Dispatch<SetStateAction<RoutePoint[]>> = useCallback(
        (newPointsOrSetter: SetStateAction<RoutePoint[]>) => {
            const newPoints = typeof newPointsOrSetter === "function" ? newPointsOrSetter(unsavedRouteRef.current.points) : newPointsOrSetter;
            setUnsavedRoute((prev) => ({
                ...prev,
                points: newPoints,
            }));
        },
        [setUnsavedRoute],
    );

    return (
        <Stack gap="md" maw={1200}>
            <TextInput
                label={t("name.label")}
                placeholder={t("name.placeholder")}
                value={unsavedRoute.name}
                onChange={handleRouteNameChange}
                maxLength={maxRouteNameLength}
                maw={500}
            />
            {/* Use savedRoute.description here - Mantine's RichTextEditor has an internal state and passing update value won't do anything */}
            <RichTextEditor
                label={t("description.label")}
                placeholder={t("description.placeholder")}
                h={500}
                value={savedRoute.description}
                onEditorChange={handleRouteDescriptionEditorChange}
                onValueChange={handleRouteDescriptionChange}
            />
            <Group>
                <Switch label={t("hasElevation.label")} checked={unsavedRoute.hasElevation} onChange={handleRouteHasElevationChange} />
            </Group>
            <Box my="md">
                <RoutePointsTable routePoints={unsavedRoute.points} setRoutePoints={setUnsavedRoutePoints} goToMapLatLon={props.goToMapLatLon} />
            </Box>
            <Center>
                <Group>
                    <Button type="button" preset="save" size="sm" onClick={handleSaveClick} />
                    <Button type="button" preset="reset" size="sm" onClick={handleResetClick} />
                </Group>
            </Center>
        </Stack>
    );
}
