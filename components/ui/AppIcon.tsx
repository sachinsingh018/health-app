"use client";

import { useMemo } from "react";
// Material Icons (md)
import { MdFavorite, MdWarningAmber, MdHealthAndSafety, MdTimeline, MdDescription, MdMedication, MdCloudUpload, MdPictureAsPdf } from "react-icons/md";
// Tabler Icons (tb)
import { TbHeartbeat, TbTestPipe, TbActivityHeartbeat, TbUpload } from "react-icons/tb";
// Heroicons v2 (hi2)
import { HiExclamationTriangle, HiChatBubbleLeftRight, HiArrowLeft, HiArrowRight } from "react-icons/hi2";
// AI Icons (ai)
import { AiOutlineAlert, AiOutlineSend, AiOutlineInfoCircle } from "react-icons/ai";
// FontAwesome 6 (fa6)
import { FaHeartPulse, FaUserDoctor, FaUserNurse, FaRegUserCircle } from "react-icons/fa6";
// Phosphor Icons (pi)
import { PiRobotLight } from "react-icons/pi";

interface AppIconProps {
    name: string;
    size?: number;
    className?: string;
    color?: string;
}

// Icon mapping with friendly names
const iconMap: Record<string, React.ComponentType<any>> = {
    // Cardiology
    heart: MdFavorite,
    heartbeat: TbHeartbeat,
    risk: AiOutlineAlert,
    condition: FaHeartPulse,

    // Warnings
    warning: MdWarningAmber,
    critical: MdHealthAndSafety,
    danger: HiExclamationTriangle,

    // Timeline
    event: MdTimeline,
    diagnosis: MdDescription,
    medication: MdMedication,
    lab: TbTestPipe,
    vitals: TbActivityHeartbeat,

    // Actions
    upload: MdCloudUpload,
    chat: HiChatBubbleLeftRight,
    send: AiOutlineSend,
    back: HiArrowLeft,
    next: HiArrowRight,
    pdf: MdPictureAsPdf,
    info: AiOutlineInfoCircle,

    // Onboarding
    doctor: FaUserDoctor,
    nurse: FaUserNurse,
    user: FaRegUserCircle,
    ai: PiRobotLight,
};

export default function AppIcon({ name, size = 24, className = "", color = "#4EFFD2" }: AppIconProps) {
    const IconComponent = useMemo(() => {
        return iconMap[name.toLowerCase()] || AiOutlineInfoCircle;
    }, [name]);

    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            size={size}
            className={className}
            style={{ color }}
        />
    );
}

