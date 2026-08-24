"use client";

import { Icon } from "@/components/shared/icon";
import clsx from "clsx";
import { useId } from "react";

type SelectOption = Readonly<{
	label: string;
	value: string;
}>;

export function SelectInput({
	ariaLabel,
	id,
	name,
	options,
	value,
	defaultValue,
	onChange,
	disabled = false,
	size = "small",
	className,
}: Readonly<{
	ariaLabel: string;
	id?: string;
	name?: string;
	options: ReadonlyArray<SelectOption>;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	size?: "small" | "medium";
	className?: string;
}>) {
	const generatedId = useId();
	const selectId = id ?? generatedId;

	return (
		<div className={clsx("relative", className)}>
			<select
				id={selectId}
				name={name}
				aria-label={ariaLabel}
				value={value}
				defaultValue={value === undefined ? defaultValue : undefined}
				disabled={disabled}
				onChange={(event) => onChange?.(event.target.value)}
				className={clsx(
					"block w-full appearance-none rounded-lg",
					"bg-surface",
					"border border-border",
					"font-semibold text-text-primary",
					"pr-9 pl-3 text-left",
					"transition-colors hover:border-border-strong focus-visible:border-brand-bright focus-visible:outline-none",
					size === "medium" ? "h-11 text-sm" : "h-10 text-xs",
				)}
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						className="bg-background-secondary text-text-primary"
					>
						{option.label}
					</option>
				))}
			</select>
			<Icon
				name="arrow-right"
				className={clsx(
					"pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 rotate-90",
					"text-text-muted",
				)}
			/>
		</div>
	);
}
