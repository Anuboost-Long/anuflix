"use client";

import { translation } from "@/constants/translation";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Brand() {
	const { t } = useTranslation();
	return (
		<Link
			href="/"
			className={clsx(
				"inline-flex items-center gap-2.5",
				"text-lg font-black tracking-[.08em] text-text-primary",
			)}
			aria-label={t(translation.Shell.BrandHome)}
		>
			<Image
				src="/brand/logo-bgless.png"
				alt=""
				width={48}
				height={48}
				unoptimized
				className="size-12 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,.4)]"
			/>
			<span>ANUFLIX</span>
		</Link>
	);
}
