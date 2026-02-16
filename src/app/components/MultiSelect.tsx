"use client";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type MultiSelectProps = {
    options: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    className?: string;
    label?: string;
    placeholder?: string;
};

export function MultiSelect({
    options,
    selectedValues,
    onChange,
    className = "",
    label = "",
    placeholder = "",
}: MultiSelectProps) {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Normalisation pour ignorer les accents et les espaces
    const normalize = (str: string) => {
         return str
            .normalize("NFD") // sépare accents
            .replace(/[\u0300-\u036f]/g, "") // supprime accents
            .replace(/\s+/g, "") // supprime espaces
            .toLowerCase();
    };

   const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            normalize(option.label).includes(normalize(filter))
        );
    }, [options, filter]);

    const selectedLabels = useMemo(() => {
        return options
            .filter((option) => selectedValues.includes(option.value))
            .map((option) => option.label);
    }, [options, selectedValues]);

    // Vérifie si tous les éléments filtrés sont sélectionnés
    const allFilteredSelected = useMemo(() => {
        if (filteredOptions.length === 0) return false;
        return filteredOptions.every((o) => selectedValues.includes(o.value));
    }, [filteredOptions, selectedValues]);


    const removeSite = (value: string) => {
        onChange(selectedValues.filter((v) => v !== value));
    };

    const containerRef = useRef<HTMLDivElement>(null);

    // Ferme le dropdown si on clique en dehors du composant
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocus(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div ref={containerRef} className={`relative w-full ${className} flex flex-col gap-2`}>
            {label && <label className="block text-sm font-medium">{label}</label>}
            <div
                className={`border rounded-md p-2 ${
                    isFocus ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }}
            >
                <div className="flex justify-between">
                    <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                        {selectedLabels.map((label) => {
                            const id = options.find((opt) => opt.label === label)?.value || "";
                            return (
                                <span
                                    key={label}
                                    className="flex gap-1 bg-gray-200 rounded-full px-2 py-1 text-xs"
                                >
                                    <span>{label}</span>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeSite(id);
                                        }}
                                        //disabled={disabled}
                                        className="rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed"
                                        aria-label={`Retirer ${label}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </span>
                            );
                        })}
                        <input
                            ref={inputRef}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border-0 focus:ring-0 outline-none focus:outline-none bg-inherit"
                            onFocus={() => {
                                setIsFocus(true);
                            }}
                            onBlur={() => {
                                setIsFocus(false);
                            }}
                            placeholder={placeholder}
                        />
                    </div>
                    <div className="flex">
                        <div className="flex items-center justify-center px-2">
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onChange([]);
                                    setFilter("");
                                }}
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="border-l-2 border-gray-300"></div>
                        <div className="flex items-center justify-center px-2">
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    //if (!isFocus) inputRef.current?.focus();
                                    setIsFocus((prev) => !prev);
                                }}
                            >
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isFocus && (
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                >
                    <div className="flex gap-2 p-2 border-b-2 border-gray-200">
                        <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={(e) => {
                                console.log(e);
                                //e.preventDefault();
                                if (e.target.checked) {
                                    onChange(filteredOptions.map((o) => o.value));
                                } else {
                                    onChange([]);
                                }
                            }}
                        />
                        <span className="text-sm">Tout sélectionner</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <div className="flex gap-2 p-2" key={option.value}>
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => {
                                        //e.preventDefault();
                                        if (selectedValues.includes(option.value)) {
                                            onChange(
                                                selectedValues.filter((v) => v !== option.value)
                                            );
                                        } else {
                                            onChange([...selectedValues, option.value]);
                                        }
                                    }}
                                />
                                <span className="text-sm">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
