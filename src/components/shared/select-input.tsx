"use client";

import { Icon } from "@/components/shared/icon";
import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";

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
	const [open, setOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(defaultValue ?? options[0]?.value ?? "");
	const root = useRef<HTMLDivElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	const selected = useRef<HTMLButtonElement>(null);
	const generatedId = useId();
	const listboxId = id ?? generatedId;
	const currentValue = value ?? selectedValue;
	const current = options.find((option) => option.value === currentValue) ?? options[0];

	useEffect(() => {
		if (!open) return;

		const frame = window.requestAnimationFrame(() => selected.current?.focus());

		function closeOnPointer(event: PointerEvent) {
			if (!root.current?.contains(event.target as Node)) setOpen(false);
		}

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key !== "Escape") return;
			setOpen(false);
			trigger.current?.focus();
		}

		document.addEventListener("pointerdown", closeOnPointer);
		document.addEventListener("keydown", closeOnEscape);

		return () => {
			window.cancelAnimationFrame(frame);
			document.removeEventListener("pointerdown", closeOnPointer);
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, [open]);

	function selectOption(optionValue: string) {
		if (!options.some((option) => option.value === optionValue)) return;
		setOpen(false);
		setSelectedValue(optionValue);
		onChange?.(optionValue);
	}

	function moveFocus(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
		if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
		event.preventDefault();
		const optionButtons = root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
		if (!optionButtons?.length) return;
		const next =
			event.key === "Home"
				? 0
				: event.key === "End"
					? optionButtons.length - 1
					: (index + (event.key === "ArrowDown" ? 1 : -1) + optionButtons.length) % optionButtons.length;
		optionButtons[next]?.focus();
	}

	return (
		<div ref={root} className={clsx("relative", open ? "z-30" : "z-20", className)}>
			{name ? <input type="hidden" name={name} value={currentValue} readOnly /> : null}
			<button
				ref={trigger}
				type="button"
				aria-label={ariaLabel}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={listboxId}
				disabled={disabled}
				onClick={() => setOpen((currentOpen) => !currentOpen)}
				className={clsx(
					"flex w-full items-center justify-between gap-3 rounded-lg",
					"bg-surface",
					"border border-border",
					"font-semibold text-text-primary",
					"text-left",
					"transition-colors hover:border-border-strong focus-visible:border-brand-bright focus-visible:outline-none",
					size === "medium" ? "h-11 px-3 text-sm" : "h-10 px-3 text-xs",
				)}
			>
				<span className={clsx("truncate")}>{current?.label}</span>
				<Icon
					name="arrow-right"
					className={clsx(
						"size-4 shrink-0",
						"text-text-muted",
						"transition-transform duration-200",
						open ? "-rotate-90" : "rotate-90",
					)}
				/>
			</button>

			{open ? (
				<div
					id={listboxId}
					role="listbox"
					aria-label={ariaLabel}
					className={clsx(
						"absolute top-full right-0 mt-2 max-h-64 min-w-full overflow-y-auto rounded-lg",
						"bg-background-secondary",
						"border border-border shadow-[0_18px_48px_rgba(0,0,0,.5)]",
						"p-1.5",
					)}
				>
					{options.map((option, index) => {
						const active = currentValue === option.value;

						return (
							<button
								key={option.value}
								ref={active ? selected : undefined}
								type="button"
								role="option"
								aria-selected={active}
								disabled={disabled}
								onClick={() => selectOption(option.value)}
								onKeyDown={(event) => moveFocus(event, index)}
								className={clsx(
									"flex w-full items-center justify-between gap-3 rounded-md whitespace-nowrap",
									"font-semibold",
									"px-3 py-2.5 text-left",
									"transition-colors focus-visible:outline-none",
									size === "medium" ? "text-sm" : "text-xs",
									active
										? "bg-brand-primary text-white"
										: "text-text-secondary hover:bg-surface-hover hover:text-white focus-visible:bg-surface-hover focus-visible:text-white",
								)}
							>
								<span>{option.label}</span>
								{active ? <Icon name="check" className={clsx("size-4")} /> : null}
							</button>
						);
					})}
				</div>
			) : null}
		</div>
	);
}
