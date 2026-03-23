import { useEffect, useRef, useState } from "react";
import { useGetProgressQuery } from "../services/api";

export const useSmartPolling = (jobId: string | null) => {
    const [interval, setInterval] = useState(1000);
    const prevProgressRef = useRef<number | null>(null);

    const { data: progressData } = useGetProgressQuery(jobId!, {
        skip: !jobId,
        pollingInterval: interval,
    });

    useEffect(() => {
        if (!progressData) return;

        const status = progressData.status;

        if (["done", "error", "not_found"].includes(status)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInterval((prev) => (prev !== 0 ? 0 : prev));
            return;
        }

        const current = progressData.progress ?? 0;

        if (
            prevProgressRef.current !== null &&
            current > prevProgressRef.current
        ) {
            setInterval(1000);
        } else {
            setInterval((prev) => Math.min(prev + 1000, 5000));
        }

        prevProgressRef.current = current;
    }, [progressData]);

    return { progressData };
};