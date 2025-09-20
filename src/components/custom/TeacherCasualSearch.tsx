import { useState, useMemo, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../utils/cn';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button'; // Import Button component

interface TeacherCasualSearchProps {
    id: string;
    label?: string; // Made optional
    placeholder: string;
    items: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    isLoading?: boolean;
}

export function TeacherCasualSearch({
    id,
    label,
    placeholder,
    items,
    selectedValue,
    onValueChange,
    isLoading = false,
}: TeacherCasualSearchProps) {
    const [searchTerm, setSearchTerm] = useState(selectedValue);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setSearchTerm(selectedValue);
    }, [selectedValue]);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        return items.filter(item =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, items]);

    const handleSelect = (item: string) => {
        setSearchTerm(item);
        onValueChange(item);
        setShowDropdown(false);
    };

    return (
        <div className="control-group flex flex-col">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    placeholder={isLoading ? 'Loading...' : placeholder}
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                    className="w-full pr-10" // Added pr-10 for clear button space
                    disabled={isLoading}
                />
                {searchTerm && ( // Show clear button only when there's text
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => {
                            setSearchTerm('');
                            onValueChange('');
                            setShowDropdown(false);
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                {!isLoading && showDropdown && (
                    <div className="absolute z-[9999] mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <div
                                    key={item}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                                    onMouseDown={() => handleSelect(item)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue === item ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-gray-500">
                                No matching {label ? label.toLowerCase() : 'items'} found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
